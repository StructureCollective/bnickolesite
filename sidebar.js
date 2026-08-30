/*
  Shared left sidebar behavior — used on every page.
  The sidebar is collapsed (hidden off-canvas) by default and opens
  only when the menu button is clicked. It auto-collapses again when
  a link is chosen, the overlay is clicked, or Escape is pressed.
*/
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("siteSidebar");
  const toggle = document.getElementById("sidebarToggle");
  const closeBtn = document.getElementById("sidebarClose");
  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebar || !toggle || !overlay) return;

  const openSidebar = () => {
    sidebar.classList.add("is-open");
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-visible"));
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("sidebar-open");
  };

  const closeSidebar = () => {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("sidebar-open");
    window.setTimeout(() => {
      if (!sidebar.classList.contains("is-open")) overlay.hidden = true;
    }, 300);
  };

  toggle.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  closeBtn?.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
      closeSidebar();
      toggle.focus();
    }
  });
});
