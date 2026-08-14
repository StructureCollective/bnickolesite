/*
  Replace each # below with the page or collection you want that card to open.
  Example: favorites: "https://yourdomain.com/current-favorites"
*/
const SITE_LINKS = {
  instagram: "https://www.instagram.com/b.nickole__/",
  favorites: "#",
  home: "#",
  mama: "#",
  diy: "#",
  odds: "#"
};

document.querySelectorAll("[data-link]").forEach((element) => {
  const destination = SITE_LINKS[element.dataset.link];
  if (destination && destination !== "#") {
    element.href = destination;
  } else {
    element.addEventListener("click", (event) => event.preventDefault());
    element.setAttribute("aria-disabled", "true");
    element.title = "Add this destination in links.js";
  }
});
