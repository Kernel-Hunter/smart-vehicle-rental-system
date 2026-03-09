// composables/useReveal.js
// Adds scroll-triggered reveal animation to elements with class "reveal"
// Usage: call setupReveal() in mounted()

export function useReveal() {
  function setupReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target) // Only animate once
          }
        })
      },
      { threshold: 0.12 }
    )
    // Observe all elements with class "reveal"
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return observer
  }
  return { setupReveal }
}
