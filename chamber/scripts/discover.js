document.addEventListener("DOMContentLoaded", function () {
  trackVisits();

  fetchAttractions();
});

function trackVisits() {
  const visitMessage = document.getElementById("visit-message");
  const currentDate = Date.now();

  const lastVisit = localStorage.getItem("lastVisit");

  let message = "";

  if (!lastVisit) {
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const lastVisitDate = parseInt(lastVisit);
    const daysSinceLastVisit = Math.floor(
      (currentDate - lastVisitDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastVisit < 1) {
      message = "Back so soon! Awesome!";
    } else if (daysSinceLastVisit === 1) {
      message = "You last visited 1 day ago.";
    } else {
      message = `You last visited ${daysSinceLastVisit} days ago.`;
    }
  }

  visitMessage.textContent = message;

  localStorage.setItem("lastVisit", currentDate);
}

function fetchAttractions() {
  fetch("data/attractions.json")
    .then((response) => response.json())
    .then((attractions) => {
      displayAttractions(attractions);
    })
    .catch((error) => {
      alert("Error loading attractions:");
    });
}

// Function to display attractions
function displayAttractions(attractions) {
  // Get the container
  const discoverGrid = document.getElementById("discover-grid");

  // Create cards for each attraction
  attractions.forEach((attraction) => {
    const card = document.createElement("div");
    card.className = "attraction-card";

    card.innerHTML = `
      <h2>${attraction.title}</h2>
      <figure>
        <img src="${attraction.image}" alt="${attraction.title}" width="300" height="200" loading="lazy">
      </figure>
      <address>${attraction.address}</address>
      <p>${attraction.description}</p>
      <button>Learn More</button>
    `;

    // Add click event for the "Learn More" button
    const button = card.querySelector("button");
    button.addEventListener("click", function () {
      alert(`More information about ${attraction.title} coming soon!`);
    });

    // Add the card to the grid
    discoverGrid.appendChild(card);
  });
}
