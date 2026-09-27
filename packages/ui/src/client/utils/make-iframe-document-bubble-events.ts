/**
 * Bubbles the mouse events of an iframe's document up to the page, so that
 * dragging over the iframe keeps resizing it.
 */
export const makeIframeDocumentBubbleEvents = (iframe: HTMLIFrameElement) => {
  const mouseMoveBubbler = (event: MouseEvent) => {
    const bounds = iframe.getBoundingClientRect();
    document.dispatchEvent(
      new MouseEvent('mousemove', {
        ...event,
        clientX: event.clientX + bounds.x,
        clientY: event.clientY + bounds.y,
      }),
    );
  };
  const mouseUpBubbler = (event: MouseEvent) => {
    document.dispatchEvent(new MouseEvent('mouseup', event));
  };
  const iframeDocument = iframe.contentDocument;
  iframeDocument?.addEventListener('mousemove', mouseMoveBubbler);
  iframeDocument?.addEventListener('mouseup', mouseUpBubbler);
  return () => {
    iframeDocument?.removeEventListener('mousemove', mouseMoveBubbler);
    iframeDocument?.removeEventListener('mouseup', mouseUpBubbler);
  };
};
