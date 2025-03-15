document.addEventListener("DOMContentLoaded", async () => {
  // Get DOM elements
  const directoryContainer = document.getElementById("directory-container");
  const gridButton = document.getElementById("grid-btn");
  const listButton = document.getElementById("list-btn");

  // Function to fetch members data
  async function fetchMembers() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) {
        throw new Error("Failed to fetch members data");
      }
      const data = await response.json();
      return data.members;
    } catch (error) {
      console.error("Error fetching members:", error);
      directoryContainer.innerHTML = `<p class="error">Error loading directory data. Please try again later.</p>`;
      return [];
    }
  }

  // Function to display members in grid view
  function displayMembersGrid(members) {
    directoryContainer.innerHTML = "";
    directoryContainer.className = "directory-grid grid-view";

    members.forEach((member) => {
      const memberClass =
        member.membershipLevel === 3
          ? "gold-member"
          : member.membershipLevel === 2
          ? "silver-member"
          : "";

      const memberElement = document.createElement("div");
      memberElement.className = `directory-item ${memberClass}`;

      memberElement.innerHTML = `
        <img src="${member.image}" alt="${member.name}" class="member-image">
        <div class="member-info">
          <h3>${member.name}</h3>
          <span class="category-tag">${member.category}</span>
          <p>${member.description}</p>
          <p><strong>Address:</strong> ${member.address}</p>
          <p><strong>Phone:</strong> ${member.phone}</p>
          <p><strong>Website:</strong> <a href="${
            member.website
          }" target="_blank">${member.website.replace("https://", "")}</a></p>
        </div>
      `;

      directoryContainer.appendChild(memberElement);
    });
  }

  // Function to display members in list view
  function displayMembersList(members) {
    directoryContainer.innerHTML = "";
    directoryContainer.className = "directory-list list-view";

    members.forEach((member) => {
      const memberClass =
        member.membershipLevel === 3
          ? "gold-member"
          : member.membershipLevel === 2
          ? "silver-member"
          : "";

      const memberElement = document.createElement("div");
      memberElement.className = `directory-item ${memberClass}`;

      memberElement.innerHTML = `
        <img src="${member.image}" alt="${member.name}" class="member-image">
        <div class="member-info">
          <h3>${member.name}</h3>
          <span class="category-tag">${member.category}</span>
          <p>${member.description}</p>
          <p><strong>Phone:</strong> ${
            member.phone
          } | <strong>Website:</strong> <a href="${
        member.website
      }" target="_blank">${member.website.replace("https://", "")}</a></p>
        </div>
      `;

      directoryContainer.appendChild(memberElement);
    });
  }

  // Toggle view buttons
  gridButton.addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      this.classList.add("active");
      listButton.classList.remove("active");
      displayMembersGrid(membersData);
    }
  });

  listButton.addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      this.classList.add("active");
      gridButton.classList.remove("active");
      displayMembersList(membersData);
    }
  });

  // Fetch and display members
  const membersData = await fetchMembers();
  if (membersData.length > 0) {
    displayMembersGrid(membersData);
  }
});
