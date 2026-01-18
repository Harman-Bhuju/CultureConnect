/**
 * useScrollReveal Hook for CultureConnect
 *
 * A custom hook for scroll-triggered reveal animations that works
 * with container-based scrolling (like sidebar layouts).
 *
 * @example
 * import useScrollReveal from '../hooks/useScrollReveal';
 *
 * const MyComponent = () => {
 *   const containerRef = useRef(null);
 *   useScrollReveal(containerRef); // Pass the scrollable container
 *
 *   return (
 *     <div ref={containerRef} className="overflow-y-auto">
 *       <div className="scroll-reveal">I'll fade in when scrolled into view!</div>
 *       <div className="stagger-reveal">
 *         <div>Child 1</div>
 *         <div>Child 2</div>
 *       </div>
 *     </div>
 *   );
 * };
 */

import { useEffect, useCallback } from "react";

/**
 * Custom hook for scroll-triggered reveal animations
 * @param {React.RefObject} containerRef - Reference to the scrollable container
 * @param {Object} options - Configuration options
 * @param {string} options.selector - CSS selector for reveal elements (default: '.scroll-reveal, .stagger-reveal')
 * @param {number} options.threshold - Viewport threshold 0-1 (default: 0.15)
 * @param {boolean} options.once - Only animate once (default: true)
 */
const useScrollReveal = (containerRef, options = {}) => {
  const {
    selector = ".scroll-reveal, .stagger-reveal",
    threshold = 0.15,
    once = true,
  } = options;

  const checkReveal = useCallback(() => {
    if (!containerRef?.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll(selector);
    const containerRect = container.getBoundingClientRect();
    const containerHeight = containerRect.height;

    elements.forEach((element) => {
      const elementRect = element.getBoundingClientRect();

      // Calculate position relative to container
      const elementTop = elementRect.top - containerRect.top;
      const elementBottom = elementTop + elementRect.height;

      // Element is visible when it's within the container viewport
      const isVisible =
        elementTop < containerHeight * (1 - threshold) &&
        elementBottom > containerHeight * threshold;

      if (isVisible) {
        element.classList.add("revealed");
      } else if (!once) {
        element.classList.remove("revealed");
      }
    });
  }, [containerRef, selector, threshold, once]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    // Initial check
    checkReveal();

    // Add scroll listener
    container.addEventListener("scroll", checkReveal, { passive: true });

    // Also check on resize
    window.addEventListener("resize", checkReveal, { passive: true });

    return () => {
      container.removeEventListener("scroll", checkReveal);
      window.removeEventListener("resize", checkReveal);
    };
  }, [containerRef, checkReveal]);

  // Return a manual trigger function
  return { triggerCheck: checkReveal };
};

export default useScrollReveal;

/**
 * Utility function to smoothly scroll to an element within a container
 * @param {HTMLElement} container - The scrollable container
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export const scrollToElement = (container, target, options = {}) => {
  const { offset = 0, behavior = "smooth" } = options;

  const targetElement =
    typeof target === "string" ? container.querySelector(target) : target;

  if (!targetElement || !container) return;

  const containerRect = container.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const relativeTop = targetRect.top - containerRect.top + container.scrollTop;

  container.scrollTo({
    top: relativeTop + offset,
    behavior,
  });
};

/**
 * Utility function to scroll to top of container
 * @param {HTMLElement} container - The scrollable container
 */
export const scrollToTop = (container) => {
  if (!container) return;
  container.scrollTo({ top: 0, behavior: "smooth" });
};
