// useReveal.js
// Scroll-reveal is now handled purely via CSS @keyframes (fade-up-1..4 classes).
// This file is kept as a no-op so any remaining import doesn't break the build.
export function useReveal() {
  return { setupReveal: () => {} }
}
