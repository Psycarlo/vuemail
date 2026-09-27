import type { Editor, JSONContent } from '@tiptap/core';
import type { NodeType } from '@tiptap/pm/model';
import { describe, expect, it, vi } from 'vitest';
import { h, type VNodeChild } from 'vue';
import { render } from 'vuemail';
import { createImageExtension } from './extension';

function renderToHtml(content: () => VNodeChild) {
  return render(h({ render: content }), { pretty: true });
}

describe('Image extension', () => {
  const uploadImage = async () => ({ url: '' });
  const extension = createImageExtension({ uploadImage });
  const renderToVueEmail =
    (extension.options as any).renderToVueEmail ??
    extension.config.renderToVueEmail;
  const extensionContext = {
    name: extension.name,
    options: extension.options,
    storage: extension.storage as Record<string, never>,
    editor: {} as Editor,
    type: {} as NodeType,
    parent: undefined,
  };

  it('renders basic image', async () => {
    const html = await renderToHtml(() =>
      renderToVueEmail({
        node: {
          type: { name: 'image' },
          attrs: {
            src: 'https://example.com/img.png',
            alt: 'Test image',
            width: '600',
            height: 'auto',
            alignment: 'center',
            href: null,
          },
        } as unknown as JSONContent,
        style: {},
        extension,
      }),
    );

    expect(html).toContain('src="https://example.com/img.png"');
    expect(html).toContain('alt="Test image"');
  });

  it('wraps image in link when href is set', async () => {
    const html = await renderToHtml(() =>
      renderToVueEmail({
        node: {
          type: { name: 'image' },
          attrs: {
            src: 'https://example.com/img.png',
            alt: '',
            width: 'auto',
            height: 'auto',
            alignment: 'center',
            href: 'https://example.com',
          },
        } as unknown as JSONContent,
        style: {},
        extension,
      }),
    );

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('src="https://example.com/img.png"');
  });

  it('defines expected attributes', () => {
    const attrs = extension.config.addAttributes?.call(extensionContext) ?? {};
    expect(attrs).toHaveProperty('src');
    expect(attrs).toHaveProperty('alt');
    expect(attrs).toHaveProperty('width');
    expect(attrs).toHaveProperty('height');
    expect(attrs).toHaveProperty('alignment');
    expect(attrs).toHaveProperty('href');
  });

  it('returns correct node config', () => {
    const ext = createImageExtension({
      uploadImage: vi.fn().mockResolvedValue({ url: '' }),
    });

    expect(ext.name).toBe('image');
    expect(ext.config.atom).toBe(true);
    expect(ext.config.draggable).toBe(true);
    expect(ext.config.group).toBe('block');
  });

  it('has setImage and uploadImage commands', () => {
    const commands = extension.config.addCommands?.call(extensionContext);
    expect(commands).toHaveProperty('setImage');
    expect(commands).toHaveProperty('uploadImage');
  });

  it('registers the image file handler plugin', () => {
    const plugins =
      extension.config.addProseMirrorPlugins?.call(extensionContext);
    expect(plugins).toHaveLength(1);
  });
});
