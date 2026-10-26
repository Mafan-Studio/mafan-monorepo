import "@testing-library/jest-dom/vitest";

// Browser shims only; server-side tests (route handlers) run in the node
// environment, which has no window.
if (typeof window !== "undefined") {
  // Mantine components rely on these during layout/color-scheme checks;
  // happy-dom doesn't implement either.
  window.matchMedia =
    window.matchMedia ||
    (((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia);

  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = window.ResizeObserver || MockResizeObserver;
}
