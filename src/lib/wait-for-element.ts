/**
 * Wait for an element matching `selector` to appear in the DOM.
 *
 * Resolves synchronously if the element already exists, otherwise
 * attaches a MutationObserver to `document.body` and watches for it.
 *
 * Returns a disposer that cancels the wait + invokes any cleanup the
 * callback returned. The disposer is safe to call before or after the
 * element has been found.
 */
export function waitForElement<T extends Element = Element>(
  selector: string,
  onFound: (element: T) => void | (() => void),
  options: { timeout?: number } = {},
): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const { timeout = 5000 } = options;
  let disposed = false;
  let cleanup: void | (() => void);

  const tryAttach = (el: T): boolean => {
    if (disposed) return true;
    cleanup = onFound(el);
    return true;
  };

  const existing = document.querySelector<T>(selector);
  if (existing) {
    tryAttach(existing);
    return () => {
      disposed = true;
      cleanup?.();
    };
  }

  const observer = new MutationObserver(() => {
    if (disposed) return;
    const el = document.querySelector<T>(selector);
    if (el) {
      observer.disconnect();
      clearTimeout(timeoutId);
      tryAttach(el);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const timeoutId = window.setTimeout(() => {
    observer.disconnect();
  }, timeout);

  return () => {
    disposed = true;
    observer.disconnect();
    clearTimeout(timeoutId);
    cleanup?.();
  };
}
