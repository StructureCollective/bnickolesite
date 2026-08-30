/*
  Auto-scrolling category strip on the homepage.
  Duplicates the cards once so the strip can loop seamlessly, then
  drives scrollLeft with requestAnimationFrame. Pauses briefly on
  hover, touch/drag, keyboard focus, or when the tab is hidden, then
  resumes on its own. Stays still (but still manually scrollable) for
  anyone with reduced-motion enabled.
*/
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".scroll-strip");
  if (!track) return;

  // Duplicate the cards once so the loop has no visible seam.
  const originalCards = Array.from(track.children);
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add("strip-clone");
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");
    track.appendChild(clone);
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const speed = 0.06; // pixels per millisecond (~60px/sec)
  let loopWidth = track.scrollWidth / 2;
  const remeasure = () => { loopWidth = track.scrollWidth / 2; };
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);

  let paused = false;
  let lastTime = null;
  let resumeTimer = null;

  const pause = () => {
    paused = true;
    window.clearTimeout(resumeTimer);
  };
  const resume = (delay) => {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      lastTime = null;
      paused = false;
    }, delay || 0);
  };

  track.addEventListener("mouseenter", pause);
  track.addEventListener("mouseleave", () => resume(500));
  track.addEventListener("focusin", pause);
  track.addEventListener("focusout", () => resume(500));
  track.addEventListener("pointerdown", pause);
  track.addEventListener("pointerup", () => resume(1200));
  track.addEventListener("touchstart", pause, { passive: true });
  track.addEventListener("touchend", () => resume(1200));
  track.addEventListener("wheel", () => { pause(); resume(1200); }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause(); else resume(0);
  });

  const step = (time) => {
    if (lastTime === null) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;
    if (!paused && loopWidth > 0) {
      track.scrollLeft += speed * delta;
      if (track.scrollLeft >= loopWidth) {
        track.scrollLeft -= loopWidth;
      }
    }
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
});
