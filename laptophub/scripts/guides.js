document.addEventListener('DOMContentLoaded', function() {
  
  setupTabNavigation();
  
  // Fetch laptop data and populate recommended laptops
  fetchLaptopData()
    .then(data => {
      populateRecommendedLaptops(data);
    })
    .catch(error => {
      console.error('Error fetching laptop data:', error);
    });
  
  checkUrlHash();
  
  window.addEventListener('hashchange', checkUrlHash);
});

function setupTabNavigation() {
  const tabLinks = document.querySelectorAll('#guide-tabs a');
  const guideSections = document.querySelectorAll('.guide-section');
  
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      
      document.querySelector('#guide-tabs a.active').classList.remove('active');
      this.classList.add('active');
      
      const targetId = this.getAttribute('href').substring(1);
      guideSections.forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(targetId).classList.add('active');
      
      if (history.pushState) {
        history.pushState(null, null, `#${targetId}`);
      } else {
        location.hash = `#${targetId}`;
      }
      
      e.preventDefault();
    });
  });
}

function checkUrlHash() {
  const hash = window.location.hash.substring(1);
  
  if (hash) {
    const targetTab = document.querySelector(`#guide-tabs a[href="#${hash}"]`);
    if (targetTab) {
      targetTab.click();
    }
  }
}

async function fetchLaptopData() {
  try {
    const response = await fetch('data/laptops.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.warn('Falling back to local data', error);
    return [];
  }
}

function populateRecommendedLaptops(data) {

  const gamingLaptops = data.filter(laptop => laptop.category === 'gaming');
  
  populateLaptopCategory('gaming-laptops', gamingLaptops);
  
}

function populateLaptopCategory(containerId, laptops) {
  const container = document.querySelector(`#${containerId} .laptop-cards`);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (laptops.length === 0) {
    container.innerHTML = '<p>No recommended laptops in this category yet.</p>';
    return;
  }
  
  laptops.forEach(laptop => {
    const laptopCard = document.createElement('div');
    laptopCard.className = 'laptop-card';
    
    const imageSrc = laptop.image || 'images/placeholder-laptop.webp';
    
    laptopCard.innerHTML = `
      <div class="laptop-image">
        <img src="${imageSrc}" alt="${laptop.name}" loading="lazy">
      </div>
      <div class="laptop-details">
        <h3>${laptop.name}</h3>
        <p class="laptop-price">$${laptop.price.toLocaleString()}</p>
        <div class="laptop-specs">
          <span><strong>CPU:</strong> ${laptop.processor}</span>
          <span><strong>RAM:</strong> ${laptop.ram}</span>
          <span><strong>Storage:</strong> ${laptop.storage}</span>
          <span><strong>Display:</strong> ${laptop.display}</span>
        </div>
        <a href="compare.html" class="btn btn-primary">Compare</a>
      </div>
    `;
    
    container.appendChild(laptopCard);
  });
}
