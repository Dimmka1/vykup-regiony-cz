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
