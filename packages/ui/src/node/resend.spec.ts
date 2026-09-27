// @vitest-environment node
import {
  createResendTemplates,
  type ResendTemplates,
  uploadTemplateToResend,
} from './resend';

type TemplatesMock = {
  [Method in keyof ResendTemplates]: ReturnType<typeof vi.fn>;
};

const makeTemplates = (templates: TemplatesMock): ResendTemplates =>
  templates as unknown as ResendTemplates;

const listSuccess = (templates: { id: string; name: string }[]) => ({
  data: templates,
  error: null,
});

const errorResponse = {
  data: null,
  error: { name: 'application_error', message: 'boom', statusCode: 500 },
};

describe('uploadTemplateToResend()', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a new template when no existing template shares the name', async () => {
    const templates: TemplatesMock = {
      list: vi.fn().mockResolvedValue(listSuccess([])),
      create: vi
        .fn()
        .mockResolvedValue({ data: { id: 'tmpl_new' }, error: null }),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeTemplates(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result).toEqual({
      name: 'welcome',
      status: 'succeeded',
      id: 'tmpl_new',
    });
    expect(templates.create).toHaveBeenCalledWith({
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });
    expect(templates.update).not.toHaveBeenCalled();
  });

  it('updates in place when exactly one existing template matches the name', async () => {
    const templates: TemplatesMock = {
      list: vi
        .fn()
        .mockResolvedValue(
          listSuccess([{ id: 'tmpl_existing', name: 'welcome' }]),
        ),
      create: vi.fn(),
      update: vi
        .fn()
        .mockResolvedValue({ data: { id: 'tmpl_existing' }, error: null }),
    };

    const result = await uploadTemplateToResend(makeTemplates(templates), {
      name: 'welcome',
      html: '<h1>updated</h1>',
    });

    expect(result).toEqual({
      name: 'welcome',
      status: 'succeeded',
      id: 'tmpl_existing',
    });
    expect(templates.update).toHaveBeenCalledWith('tmpl_existing', {
      html: '<h1>updated</h1>',
    });
    expect(templates.create).not.toHaveBeenCalled();
  });

  it('falls back to create when several templates share the name', async () => {
    const templates: TemplatesMock = {
      list: vi.fn().mockResolvedValue(
        listSuccess([
          { id: 'tmpl_a', name: 'welcome' },
          { id: 'tmpl_b', name: 'welcome' },
        ]),
      ),
      create: vi
        .fn()
        .mockResolvedValue({ data: { id: 'tmpl_new' }, error: null }),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeTemplates(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result).toEqual({
      name: 'welcome',
      status: 'succeeded',
      id: 'tmpl_new',
    });
    expect(templates.create).toHaveBeenCalledTimes(1);
    expect(templates.update).not.toHaveBeenCalled();
  });

  it('ignores templates whose name does not match', async () => {
    const templates: TemplatesMock = {
      list: vi
        .fn()
        .mockResolvedValue(
          listSuccess([{ id: 'tmpl_other', name: 'password-reset' }]),
        ),
      create: vi
        .fn()
        .mockResolvedValue({ data: { id: 'tmpl_new' }, error: null }),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeTemplates(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result.status).toBe('succeeded');
    expect(templates.create).toHaveBeenCalledTimes(1);
    expect(templates.update).not.toHaveBeenCalled();
  });

  it('returns failed without writing when listing templates errors', async () => {
    const templates: TemplatesMock = {
      list: vi.fn().mockResolvedValue(errorResponse),
      create: vi.fn(),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeTemplates(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result).toEqual({ name: 'welcome', status: 'failed' });
    expect(templates.create).not.toHaveBeenCalled();
    expect(templates.update).not.toHaveBeenCalled();
  });

  it('returns failed when updating an existing template errors', async () => {
    const templates: TemplatesMock = {
      list: vi
        .fn()
        .mockResolvedValue(
          listSuccess([{ id: 'tmpl_existing', name: 'welcome' }]),
        ),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue(errorResponse),
    };

    const result = await uploadTemplateToResend(makeTemplates(templates), {
      name: 'welcome',
      html: '<h1>updated</h1>',
    });

    expect(result).toEqual({ name: 'welcome', status: 'failed' });
    expect(templates.create).not.toHaveBeenCalled();
  });

  it('returns failed when creating a new template errors', async () => {
    const templates: TemplatesMock = {
      list: vi.fn().mockResolvedValue(listSuccess([])),
      create: vi.fn().mockResolvedValue(errorResponse),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeTemplates(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result).toEqual({ name: 'welcome', status: 'failed' });
  });
});

describe('createResendTemplates()', () => {
  const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  it('lists the templates of every page', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          object: 'list',
          data: [{ id: 'tmpl_a', name: 'a' }],
          has_more: true,
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          object: 'list',
          data: [{ id: 'tmpl_b', name: 'b' }],
          has_more: false,
        }),
      );
    const templates = createResendTemplates('re_123', fetchMock);

    expect(await templates.list()).toEqual({
      data: [
        { id: 'tmpl_a', name: 'a' },
        { id: 'tmpl_b', name: 'b' },
      ],
      error: null,
    });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://api.resend.com/templates?limit=100',
      'https://api.resend.com/templates?limit=100&after=tmpl_a',
    ]);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('GET');
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer re_123',
      'Content-Type': 'application/json',
    });
  });

  it('creates and updates templates', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(jsonResponse({ object: 'template', id: 'tmpl_a' })),
      );
    const templates = createResendTemplates('re_123', fetchMock);

    expect(await templates.create({ name: 'a', html: '<p>a</p>' })).toEqual({
      data: { object: 'template', id: 'tmpl_a' },
      error: null,
    });
    expect(await templates.update('tmpl_a', { html: '<p>b</p>' })).toEqual({
      data: { object: 'template', id: 'tmpl_a' },
      error: null,
    });

    const [[createUrl, createInit], [updateUrl, updateInit]] = fetchMock.mock
      .calls as [[string, RequestInit], [string, RequestInit]];
    expect([createUrl, createInit.method, createInit.body]).toEqual([
      'https://api.resend.com/templates',
      'POST',
      JSON.stringify({ name: 'a', html: '<p>a</p>' }),
    ]);
    expect([updateUrl, updateInit.method, updateInit.body]).toEqual([
      'https://api.resend.com/templates/tmpl_a',
      'PATCH',
      JSON.stringify({ html: '<p>b</p>' }),
    ]);
  });

  it('resolves with the errors of the API', async () => {
    const templates = createResendTemplates(
      're_123',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            statusCode: 401,
            name: 'validation_error',
            message: 'API key is invalid',
          },
          401,
        ),
      ),
    );

    expect(await templates.list()).toEqual({
      data: null,
      error: {
        name: 'validation_error',
        message: 'API key is invalid',
        statusCode: 401,
      },
    });
  });

  it('resolves with an error when the API cannot be reached', async () => {
    const templates = createResendTemplates(
      're_123',
      vi.fn().mockRejectedValue(new TypeError('fetch failed')),
    );

    expect(await templates.create({ name: 'a', html: '' })).toEqual({
      data: null,
      error: {
        name: 'application_error',
        message: 'fetch failed',
        statusCode: null,
      },
    });
  });
});
