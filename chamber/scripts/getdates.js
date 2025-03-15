document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const currentYearElement = document.querySelector("#currentYear");
  const lastModifiedElement = document.querySelector("#lastModified");

  currentYearElement.innerHTML = currentYear;
  lastModifiedElement.innerHTML = `Last Modified ${document.lastModified}`;
});
