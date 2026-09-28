import type { Attrs } from '@tiptap/pm/model';
import {
  type MaybeRefOrGetter,
  onBeforeUnmount,
  onMounted,
  toValue,
  watch,
} from 'vue';

const EVENT_PREFIX = '@vuemaildev/editor:';

/**
 * Base event map interface for the editor event bus.
 *
 * Components extend this via TypeScript module augmentation:
 * ```ts
 * declare module '@vuemaildev/editor/core' {
 *   interface EditorEventMap {
 *     'my-component:custom-event': { data: string };
 *   }
 * }
 * ```
 */
export interface EditorEventMap {
  'bubble-menu:add-link': undefined;
  'node-clicked': NodeClickedEvent;
}

export type NodeClickedEvent = {
  nodeType: string;
  nodeAttrs: Attrs;
  nodePos: { pos: number; inside: number };
};

export type EditorEventName = keyof EditorEventMap;

export type EditorEventHandler<T extends EditorEventName> = (
  payload: EditorEventMap[T],
) => void | Promise<void>;

export interface EditorEventSubscription {
  unsubscribe: () => void;
}

class EditorEventBus {
  private prefixEventName(eventName: EditorEventName): string {
    return `${EVENT_PREFIX}${String(eventName)}`;
  }

  dispatch<T extends EditorEventName>(
    eventName: T,
    payload: EditorEventMap[T],
    options?: { target?: EventTarget },
  ): void {
    const target = options?.target ?? window;
    const prefixedEventName = this.prefixEventName(eventName);
    const event = new CustomEvent(prefixedEventName, {
      detail: payload,
      bubbles: false,
      cancelable: false,
    });
    target.dispatchEvent(event);
  }

  on<T extends EditorEventName>(
    eventName: T,
    handler: EditorEventHandler<T>,
    options?: AddEventListenerOptions & { target?: EventTarget },
  ): EditorEventSubscription {
    const target = options?.target ?? window;
    const prefixedEventName = this.prefixEventName(eventName);
    const abortController = new AbortController();

    const wrappedHandler = (event: Event) => {
      const customEvent = event as CustomEvent<EditorEventMap[T]>;
      const result = handler(customEvent.detail);

      if (result instanceof Promise) {
        result.catch((error) => {
          console.error(
            `Error in async event handler for ${prefixedEventName}:`,
            { event: customEvent.detail, error },
          );
        });
      }
    };

    target.addEventListener(prefixedEventName, wrappedHandler, {
      ...options,
      signal: abortController.signal,
    });

    return {
      unsubscribe: () => {
        abortController.abort();
      },
    };
  }
}

export const editorEventBus = new EditorEventBus();

/**
 * Listens to an editor event while the component calling it is mounted,
 * subscribing again when the event name or the options change.
 *
 * Must be called inside `setup()`.
 */
export function useEditorEvent<T extends EditorEventName>(
  eventName: MaybeRefOrGetter<T>,
  handler: EditorEventHandler<T>,
  options?: MaybeRefOrGetter<
    (AddEventListenerOptions & { target?: EventTarget }) | undefined
  >,
) {
  let subscription: EditorEventSubscription | null = null;

  const unsubscribe = () => {
    subscription?.unsubscribe();
    subscription = null;
  };

  const subscribe = () => {
    unsubscribe();
    subscription = editorEventBus.on(
      toValue(eventName),
      handler,
      toValue(options),
    );
  };

  // Subscribing only once mounted keeps server rendering, where there is no
  // `window`, away from the event bus.
  onMounted(subscribe);
  onBeforeUnmount(unsubscribe);

  watch(
    () => [toValue(eventName), toValue(options)],
    () => {
      if (subscription) {
        subscribe();
      }
    },
  );
}
