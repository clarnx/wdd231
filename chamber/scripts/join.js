document.addEventListener("DOMContentLoaded", function () {
  const timestampField = document.getElementById("timestamp");
  if (timestampField) {
    const now = new Date();
    timestampField.value = now.toISOString();
  }

  const modalLinks = document.querySelectorAll(".membership-details");
  const modals = document.querySelectorAll(".modal");
  const closeButtons = document.querySelectorAll(".close-modal");

  modalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const modalId = this.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = "block";
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.style.display = "none";
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        modal.style.display = "none";
      });
    }
  });

  const isThankYouPage = window.location.pathname.includes("thankyou.html");
  if (isThankYouPage) {
    displayFormData();
  }
});

function displayFormData() {
  const params = new URLSearchParams(window.location.search);
  const submissionContainer = document.getElementById("submissionData");

  if (!submissionContainer) return;

  const dataToDisplay = [
    { param: "firstName", label: "First Name" },
    { param: "lastName", label: "Last Name" },
    { param: "email", label: "Email" },
    { param: "phone", label: "Phone Number" },
    { param: "businessName", label: "Business Name" },
    { param: "timestamp", label: "Submission Date/Time" },
  ];

  let html = "";

  dataToDisplay.forEach((item) => {
    const value = params.get(item.param);
    if (value) {
      let displayValue = value;

      if (item.param === "timestamp") {
        try {
          displayValue = new Date(value).toLocaleString();
        } catch (error) {
          displayValue = value;
        }
      }

      html += `<p><strong>${item.label}:</strong> ${displayValue}</p>`;
    }
  });

  // Display the membership level selected
  const membershipLevel = params.get("membershipLevel");
  if (membershipLevel) {
    let displayLevel;
    switch (membershipLevel) {
      case "np":
        displayLevel = "Non-Profit Membership";
        break;
      case "bronze":
        displayLevel = "Bronze Membership";
        break;
      case "silver":
        displayLevel = "Silver Membership";
        break;
      case "gold":
        displayLevel = "Gold Membership";
        break;
      default:
        displayLevel = membershipLevel;
    }
    html += `<p><strong>Membership Level:</strong> ${displayLevel}</p>`;
  }

  // If no data was found, show a message
  if (html === "") {
    html = "<p>No form data found.</p>";
  }

  submissionContainer.innerHTML = html;
}
