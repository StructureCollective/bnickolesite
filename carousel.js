/*
  Homepage photo carousel, styled as Instagram post cards, that spins
  automatically like a rotating cube. Reads its slide list from the
  data-slides attribute on #igStage. Two DOM faces (front + right) are
  reused for every slide: the stage rotates -90deg to bring "right"
  into view, then snaps back to 0deg instantly (transition disabled
  for one frame) while the face content is swapped underneath, ready
  for the next spin. Autoplay pauses on hover/focus and is skipped
  entirely for reduced-motion users, who can still use the dots.
*/
document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("igStage");
  if (!stage) return;

  const front = stage.querySelector(".ig-face-front");
  const right = stage.querySelector(".ig-face-right");
  const dotsWrap = document.getElementById("igDots");

  let slides = [];
  try {
    slides = JSON.parse(stage.dataset.slides || "[]");
  } catch (err) {
    slides = [];
  }
  if (!slides.length) return;

  let index = 0;
  let spinning = false;
  let timer = null;
  const AUTOPLAY_MS = 4200;
  const TRANSITION_MS = 900;

  const setHalfWidth = () => {
    const width = stage.getBoundingClientRect().width;
    stage.style.setProperty("--half-w", `${width / 2}px`);
  };
  setHalfWidth();
  window.addEventListener("resize", setHalfWidth);

  const renderFace = (face, slideIndex) => {
    const slide = slides[((slideIndex % slides.length) + slides.length) % slides.length];
    const img = face.querySelector(".ig-post-photo");
    img.src = slide.src;
    img.alt = slide.alt || "";
  };

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "ig-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Go to photo ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  };

  const updateDots = () => {
    dotsWrap.querySelectorAll(".ig-dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  renderFace(front, index);
  renderFace(right, index + 1);
  buildDots();

  const advance = () => {
    if (spinning) return;
    spinning = true;
    stage.classList.add("is-spinning");
    window.setTimeout(() => {
      index = (index + 1) % slides.length;
      stage.classList.add("is-resetting");
      stage.classList.remove("is-spinning");
      renderFace(front, index);
      renderFace(right, index + 1);
      updateDots();
      void stage.offsetWidth; // force reflow before re-enabling the transition
      stage.classList.remove("is-resetting");
      spinning = false;
    }, TRANSITION_MS);
  };

  const goTo = (target) => {
    if (spinning || target === index) return;
    index = target;
    renderFace(front, index);
    renderFace(right, index + 1);
    updateDots();
    restartTimer();
  };

  const stopTimer = () => window.clearInterval(timer);
  const restartTimer = () => {
    stopTimer();
    if (!prefersReducedMotion) {
      timer = window.setInterval(advance, AUTOPLAY_MS);
    }
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  restartTimer();

  stage.addEventListener("mouseenter", stopTimer);
  stage.addEventListener("mouseleave", restartTimer);
  stage.addEventListener("focusin", stopTimer);
  stage.addEventListener("focusout", restartTimer);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTimer(); else restartTimer();
  });
});
