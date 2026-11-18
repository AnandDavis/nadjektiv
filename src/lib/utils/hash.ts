/** Small stable string hash (djb2), base 36. Not for security: for seeds and cache keys. */
export function hashString(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  return hash.toString(36);
}
