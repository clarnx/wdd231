async function loadWeatherData() {
  const APPID = "942f482bd53fa37751e8cdcb99bfbb93"
  
  try {
  
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=5.63&lon=-0.00&units=metric&appid=${APPID}`
    );

    if (!currentResponse.ok) {
      throw new Error("Weather data not available");
    }

    const currentData = await currentResponse.json();

   
    const weatherIconEl = document.querySelector(".weather-icon span");
    const temperatureEl = document.querySelector(".temperature");
    const descriptionEl = document.querySelector(".weather-description");
    const weatherDetailsEl = document.querySelector(".weather-details");

    const iconMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "⛅",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌦️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };

    weatherIconEl.textContent = iconMap[currentData.weather[0].icon] || "🌤️";
    temperatureEl.textContent = `${Math.round(currentData.main.temp)}°C`;
    descriptionEl.textContent = currentData.weather[0].description
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    
    const formatTime = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    weatherDetailsEl.innerHTML = `
      <p>High: ${Math.round(currentData.main.temp_max)}°</p>
      <p>Low: ${Math.round(currentData.main.temp_min)}°</p>
      <p>Humidity: ${currentData.main.humidity}%</p>
      <p>Sunrise: ${formatTime(currentData.sys.sunrise)}</p>
      <p>Sunset: ${formatTime(currentData.sys.sunset)}</p>
    `;

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=5.63&lon=-0.00&units=metric&appid=${APPID}`
    );

    if (!forecastResponse.ok) {
      throw new Error("Forecast data not available");
    }

    const forecastData = await forecastResponse.json();

    const dailyForecasts = [];
    const today = new Date().getDate();
    const forecastContentEl = document.querySelector(".forecast-content");

    forecastContentEl.innerHTML = "";

    for (let i = 0; i < forecastData.list.length; i++) {
      const forecast = forecastData.list[i];
      const forecastDate = new Date(forecast.dt * 1000);

      if (
        forecastDate.getDate() !== today &&
        forecastDate.getHours() >= 11 &&
        forecastDate.getHours() <= 14
      ) {
        const day = forecastDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

        if (!dailyForecasts.find((f) => f.date === day)) {
          dailyForecasts.push({
            date: day,
            temp: Math.round(forecast.main.temp),
            description: forecast.weather[0].description,
            icon: forecast.weather[0].icon,
          });

          forecastContentEl.innerHTML += `
            <div class="forecast-day">
              <p>${day}</p>
              <p>${Math.round(forecast.main.temp)}°C ${
            iconMap[forecast.weather[0].icon] || ""
          }</p>
            </div>
          `;

          if (dailyForecasts.length === 3) break;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    
    document.querySelector(".weather-content").innerHTML =
      '<p class="error">Weather data unavailable</p>';
    document.querySelector(".forecast-content").innerHTML =
      '<p class="error">Forecast data unavailable</p>';
  }
}

// Function to load and display spotlight businesses
async function loadSpotlightBusinesses() {
  try {
  
    const response = await fetch("../chamber/data/members.json");
    if (!response.ok) {
      throw new Error("Failed to load member data");
    }

    const data = await response.json();

    const eligibleMembers = data.members.filter(
      (member) => member.membershipLevel >= 2
    );

    const spotlightCount = Math.min(
      eligibleMembers.length,
      Math.floor(Math.random() * 2) + 2
    ); 
    const shuffledMembers = [...eligibleMembers].sort(
      () => 0.5 - Math.random()
    );
    const selectedMembers = shuffledMembers.slice(0, spotlightCount);

    const businessGridEl = document.querySelector(".business-grid");
    if (!businessGridEl) return;

    businessGridEl.innerHTML = "";

    selectedMembers.forEach((member) => {
      const membershipLevel =
        member.membershipLevel === 3 ? "Gold Member" : "Silver Member";

      businessGridEl.innerHTML += `
        <div class="business-card ${
          member.membershipLevel === 3 ? "gold-member" : "silver-member"
        }">
          <h4>${member.name}</h4>
          <p class="business-tagline">${member.description}</p>
          <div class="business-content">
            <div class="business-image">
              <img src="${member.image}" alt="${member.name}">
            </div>
            <div class="business-info">
              <p><strong>ADDRESS:</strong> ${member.address}</p>
              <p><strong>PHONE:</strong> ${member.phone}</p>
              <p><strong>URL:</strong> <a href="${
                member.website
              }" target="_blank">${member.website.replace(
        /^https?:\/\//,
        ""
      )}</a></p>
              <p><strong>LEVEL:</strong> ${membershipLevel}</p>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading spotlight businesses:", error);
    const businessGridEl = document.querySelector(".business-grid");
    if (businessGridEl) {
      businessGridEl.innerHTML =
        '<p class="error">Business data unavailable</p>';
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".weather-content")) {
    loadWeatherData();
  }

  loadSpotlightBusinesses();
});
