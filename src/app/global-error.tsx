"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="cs">
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Něco se pokazilo</h1>
          <p>Omlouváme se za technické potíže.</p>
          <button onClick={reset}>Zkusit znovu</button>
        </div>
      </body>
    </html>
  );
}
