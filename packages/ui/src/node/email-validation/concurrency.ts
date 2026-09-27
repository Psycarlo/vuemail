/**
 * Maps every item with at most `concurrency` of them being mapped at once,
 * resolving with the results in the order of the items.
 */
export async function mapConcurrently<Item, Result>(
  items: readonly Item[],
  concurrency: number,
  map: (item: Item) => Promise<Result>,
): Promise<Result[]> {
  const results = new Array<Result>(items.length);
  let nextIndex = 0;
  const work = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await map(items[index]!);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, work),
  );
  return results;
}

/**
 * Memoizes an async function by key, so that the same URL is only ever
 * fetched once for the links, or the images, of an email.
 */
export function memoizeAsync<Result>(
  load: (key: string) => Promise<Result>,
): (key: string) => Promise<Result> {
  const cache = new Map<string, Promise<Result>>();
  return (key) => {
    let result = cache.get(key);
    if (!result) {
      result = load(key);
      cache.set(key, result);
    }
    return result;
  };
}
