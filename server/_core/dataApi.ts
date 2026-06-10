/**
 * Data API — AthlynX
 * Replaces WebDevService/CallApi.
 * Use this to call external data APIs (YouTube, etc.) via direct fetch.
 * NO forge dependencies.
 */

export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

/**
 * Stub: previously called WebDevService/CallApi.
 * Now returns null gracefully — replace with direct API calls as needed.
 */
export async function callDataApi(
  apiId: string,
  options: DataApiCallOptions = {}
): Promise<unknown> {
  console.warn(`[DataApi] callDataApi("${apiId}") called — forge removed. Wire up a direct API call here.`);
  return null;
}
