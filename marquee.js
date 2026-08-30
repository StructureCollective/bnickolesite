/*
  Auto-scrolling category strip on the homepage.
  Duplicates the cards once so the strip can loop seamlessly, then
  drives scrollLeft with requestAnimationFrame. Pauses on hover,
  touch/drag, keyboard focus, when the tab is hidden, when the strip
  scrolls out of view, and entirely for reduced-motion users (who can
  still scroll it manually).
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

  const speed = 0.045; // pixels per millisecond
  let loopWidth = track.scrollWidth / 2;
  let lastTime = null;
  let paused = false;
  let resumeTimer = null;

  const measure = () => { loopWidth = track.scrollWidth / 2; };
  window.addEventListener("resize", measure);

  const pause = () => {
    paused = true;
    window.clearTimeout(resumeTimer);
  };
  const scheduleResume = () => {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      lastTime = null;
      paused = false;
    }, 2200);
  };

  track.addEventListener("mouseenter", pause);
  track.addEventListener("mouseleave", scheduleResume);
  track.addEventListener("focusin", pause);
  track.addEventListener("focusout", scheduleResume);
  track.addEventListener("pointerdown", pause);
  track.addEventListener("pointerup", scheduleResume);
  track.addEventListener("touchstart", pause, { passive: true });
  track.addEventListener("touchend", scheduleResume);
  track.addEventListener("wheel", () => { pause(); scheduleResume(); }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause(); else scheduleResume();
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) scheduleResume(); else pause();
    });
  }, { threshold: 0.1 });
  io.observe(track);

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
