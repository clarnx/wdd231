document.addEventListener('DOMContentLoaded', function() {
  // Fetch data from the JSON file
  fetchLaptopData()
    .then(data => {
      populateLaptopGrid(data);
      setupFilters(data);
      setupModal();
    })
    .catch(error => {
      console.error('Error fetching laptop data:', error);
      document.getElementById('laptop-list').innerHTML = `
        <div class="error-message">
          <p>Sorry, we couldn't load the laptop data. Please try again later.</p>
        </div>
      `;
    });
    
  setupNewsletterForm();
});

// Fetch laptop data
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

function populateLaptopGrid(data) {
  const laptopList = document.getElementById('laptop-list');
  laptopList.innerHTML = '';
  
  data.forEach(laptop => {
    const laptopCard = document.createElement('div');
    laptopCard.className = 'laptop-card';
    laptopCard.dataset.category = laptop.category;
    laptopCard.dataset.id = laptop.id;
    
    const imageSrc = laptop.image;
    
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
        <button class="btn btn-primary view-details" data-id="${laptop.id}">View Details</button>
      </div>
    `;
    
    laptopList.appendChild(laptopCard);
  });
}

function setupFilters(data) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      button.classList.add('active');
      
      const category = button.dataset.category;
      const laptopCards = document.querySelectorAll('.laptop-card');
      
      laptopCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function setupModal() {
  const modal = document.getElementById('laptop-modal');
  const modalBody = document.getElementById('modal-body');
  const closeModal = document.querySelector('.close-modal');
  
  // Close modal
  closeModal.onclick = function() {
    modal.style.display = 'none';
  };
  

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
  
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('view-details')) {
      const laptopId = event.target.dataset.id;
      showLaptopDetails(laptopId);
    }
  });
  

  async function showLaptopDetails(laptopId) {
    const data = await fetchLaptopData();
    const laptop = data.find(item => item.id === laptopId);
    
    if (laptop) {
      modalBody.innerHTML = `
        <div class="laptop-detail-header">
          <img src="${laptop.image || 'images/placeholder-laptop.webp'}" alt="${laptop.name}" class="laptop-detail-image">
          <div>
            <h2>${laptop.name}</h2>
            <p class="laptop-price">$${laptop.price.toLocaleString()}</p>
            <p class="laptop-category">Category: ${laptop.category.charAt(0).toUpperCase() + laptop.category.slice(1)}</p>
          </div>
        </div>
        <div class="laptop-detail-specs">
          <h3>Specifications</h3>
          <ul>
            <li><strong>Processor:</strong> ${laptop.processor}</li>
            <li><strong>RAM:</strong> ${laptop.ram}</li>
            <li><strong>Storage:</strong> ${laptop.storage}</li>
            <li><strong>Display:</strong> ${laptop.display}</li>
          </ul>
        </div>
        <div class="laptop-detail-description">
          <h3>Description</h3>
          <p>The ${laptop.name} is a powerful ${laptop.category} laptop that offers exceptional performance with its ${laptop.processor} processor and ${laptop.ram} of RAM. The ${laptop.storage} provides ample space for all your files and applications, while the ${laptop.display} display delivers stunning visuals.</p>
        </div>
        <div class="laptop-detail-cta">
          <button class="btn btn-primary">Add to Compare</button>
          <a href="compare.html" class="btn btn-secondary">Go to Compare Page</a>
        </div>
      `;
      
      modal.style.display = 'block';
    } else {
      console.error('Laptop not found');
    }
  }
}

function setupNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  const formFeedback = document.getElementById('form-feedback');
  
  newsletterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    
    formFeedback.innerHTML = '<div class="loading-spinner"></div>';
    formFeedback.className = '';
    
    setTimeout(() => {
      console.log('Subscription email:', email);
      
      formFeedback.innerHTML = 'Thank you for subscribing to our newsletter!';
      formFeedback.className = 'form-feedback success';
      
      newsletterForm.reset();
      
      const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
      subscribers.push({ email, date: new Date().toISOString() });
      localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }, 1500);
  });
}
