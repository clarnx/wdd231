const today = new Date();
const currentYear = today.getFullYear();

const currentYearElement = document.querySelector("#currentyear");
const lastModifiedElement = document.querySelector("#lastModified");;

currentYearElement.innerHTML = currentYear;
lastModifiedElement.innerHTML = `Last Modified ${document.lastModified}`;
