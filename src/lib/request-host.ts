import { headers } from "next/headers";

const HOST_HEADER_CANDIDATES = ["x-forwarded-host", "host"] as const;

export async function getRequestHost(): Promise<string | null> {
  const requestHeaders = await headers();

  for (const headerName of HOST_HEADER_CANDIDATES) {
    const headerValue = requestHeaders.get(headerName);
    if (headerValue && headerValue.trim().length > 0) {
      return headerValue;
    }
  }

  return null;
}

/**
 * Get the region key override set by middleware for dev/preview path-based routing.
 * Returns null if no override (i.e., host-based resolution should be used).
 */
export async function getRegionKeyOverride(): Promise<string | null> {
  const requestHeaders = await headers();
  return requestHeaders.get("x-region-key");
}
