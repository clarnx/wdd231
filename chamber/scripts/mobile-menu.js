document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButtons = document.querySelectorAll(".mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  mobileMenuButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (mobileMenu.style.display === "none") {
        mobileMenu.style.display = "block";
      } else {
        mobileMenu.style.display = "none";
      }
    });
  });
});
