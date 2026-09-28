import type { ToolbarData } from '../../../shared/types';

vi.mock('../../config', () => ({
  isStatic: true,
  config: { mode: 'static', compatibilityClients: [] },
}));

const { checkEmailCompatibility, checkSpam, lintEmail } = await import(
  './toolbar-api'
);

const spamCheckingResult = { checks: [], isSpam: false, points: 0.4 };

const respondWith = (data: ToolbarData) =>
  vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async () => Response.json(data));

describe('toolbar API of a built preview', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('gives the results of the build, fetching them only once', async () => {
    const fetchSpy = respondWith({
      lintingRows: [],
      compatibilityResults: [],
      spamCheckingResult,
    });

    await expect(lintEmail('auth/welcome', '<html />')).resolves.toEqual([]);
    await expect(checkEmailCompatibility('auth/welcome')).resolves.toEqual([]);
    await expect(checkSpam('auth/welcome', '<html />', '')).resolves.toEqual(
      spamCheckingResult,
    );

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalledWith(
      '/data/toolbar/auth/welcome.json',
      undefined,
    );
  });

  it("doesn't check for spam when the build couldn't", async () => {
    const fetchSpy = respondWith({ lintingRows: [], compatibilityResults: [] });

    await expect(checkSpam('reset', '<html />', '')).resolves.toBeUndefined();
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalledWith(
      '/data/toolbar/reset.json',
      undefined,
    );
  });
});
