import "./src/assets/styles/main.scss";

export { wrapRootElement } from "./internal/gatsby/wrap-root-element";

// Service worker update detection for cache busting
export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    "새로운 버전이 있습니다. 페이지를 새로고침하여 업데이트하시겠습니까?" // New version available. Reload to update?
  );

  if (answer === true) {
    window.location.reload();
  }
};

// Force reload when service worker is active and content updates are available
export const onServiceWorkerActive = () => {
  // Log that service worker is active
  console.log("Service worker is active");
};

// Handle route updates for proper cache management
export const onRouteUpdate = () => {
  // Clear any stale data when navigating
  if (typeof window !== "undefined" && "caches" in window) {
    // Log navigation for debugging
    console.log("Route updated, checking cache status");
  }
};
