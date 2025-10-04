/**
 * Utility functions for Notion integration
 */

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if it's a rate limit error
      if ((error as any)?.code === 'rate_limited') {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Rate limited. Retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await sleep(delay);
      } else if (i < maxRetries - 1) {
        // For other errors, retry with shorter delay
        const delay = initialDelay * (i + 1);
        console.warn(`Error occurred. Retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Batch process items with rate limiting
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize = 5,
  delayBetweenBatches = 1000
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processor(item))
    );
    results.push(...batchResults);

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < items.length) {
      await sleep(delayBetweenBatches);
    }
  }

  return results;
}