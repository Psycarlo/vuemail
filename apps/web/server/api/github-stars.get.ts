const REPOSITORY = 'psycarlo/vuemail';

/** The star count of the repository, formatted like `1.2K`, cached for an hour. */
export default defineCachedEventHandler(
  async () => {
    try {
      const data = await $fetch<{ stargazers_count: number }>(
        `https://api.github.com/repos/${REPOSITORY}`,
        { headers: { 'User-Agent': 'vuemail.dev' } },
      );
      const starCount = data.stargazers_count;
      return starCount > 999
        ? `${(starCount / 1000).toFixed(1)}K`
        : `${starCount}`;
    } catch {
      return '';
    }
  },
  { maxAge: 60 * 60, name: 'github-stars' },
);
