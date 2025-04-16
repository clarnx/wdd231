document.addEventListener('DOMContentLoaded', function() {
  fetchLaptopData()
    .then(data => {
      populateLaptopSelects(data);
      setupCompareButton(data);
      setupPresetComparisons(data);
    })
    .catch(error => {
      console.error('Error fetching laptop data:', error);
      showErrorMessage('Sorry, we couldn\'t load the laptop data. Please try again later.');
    });
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

function populateLaptopSelects(data) {
  const laptopSelects = document.querySelectorAll('.laptop-select');
  
  laptopSelects.forEach(select => {
  
    const defaultOption = select.querySelector('option');
    select.innerHTML = '';
    select.appendChild(defaultOption);
    
    data.forEach(laptop => {
      const option = document.createElement('option');
      option.value = laptop.id;
      option.textContent = `${laptop.name} - $${laptop.price.toLocaleString()}`;
      select.appendChild(option);
    });
  });
}

function setupCompareButton(data) {
  const compareBtn = document.getElementById('compare-btn');
  const comparisonTableContainer = document.getElementById('comparison-table-container');
  
  compareBtn.addEventListener('click', () => {
    const laptop1Id = document.getElementById('laptop1').value;
    const laptop2Id = document.getElementById('laptop2').value;
    const laptop3Id = document.getElementById('laptop3').value;
    
    const selectedLaptops = [laptop1Id, laptop2Id, laptop3Id].filter(id => id !== "");
    
    if (selectedLaptops.length < 2) {
      comparisonTableContainer.innerHTML = '<p id="no-selection-message">Please select at least two laptops to compare.</p>';
      return;
    }
    
    const laptopsToCompare = selectedLaptops.map(id => data.find(laptop => laptop.id === id));
    createComparisonTable(laptopsToCompare);
    

    saveComparisonToLocalStorage(selectedLaptops);
  });
}

// Create the comparison table
function createComparisonTable(laptops) {
  const comparisonTableContainer = document.getElementById('comparison-table-container');
  
  const tableHTML = `
    <table class="comparison-table">
      <tr>
        <th></th>
        ${laptops.map(laptop => `
          <th>
            <img src="${laptop.image || 'images/placeholder-laptop.webp'}" alt="${laptop.name}" class="laptop-thumbnail">
            <div class="laptop-name">${laptop.name}</div>
          </th>
        `).join('')}
      </tr>
      <tr>
        <td class="spec-name">Price</td>
        ${laptops.map(laptop => `<td>$${laptop.price.toLocaleString()}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">Processor</td>
        ${laptops.map(laptop => `<td>${laptop.processor}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">RAM</td>
        ${laptops.map(laptop => `<td>${laptop.ram}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">Storage</td>
        ${laptops.map(laptop => `<td>${laptop.storage}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">Display</td>
        ${laptops.map(laptop => `<td>${laptop.display}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">Graphics</td>
        ${laptops.map(laptop => `<td>${laptop.gpu}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">Weight</td>
        ${laptops.map(laptop => `<td>${laptop.weight}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">Battery Life</td>
        ${laptops.map(laptop => `<td>${laptop.battery}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">Ports</td>
        ${laptops.map(laptop => `<td>${laptop.ports}</td>`).join('')}
      </tr>
      <tr>
        <td class="spec-name">Operating System</td>
        ${laptops.map(laptop => `<td>${laptop.os}</td>`).join('')}
      </tr>
    </table>
  `;
  
  comparisonTableContainer.innerHTML = tableHTML;
  
  // Highlight best specifications
  highlightBestSpecs();
}

function highlightBestSpecs() {
  const table = document.querySelector('.comparison-table');
  if (!table) return;
  
  const rowsToCompare = [1, 2, 3, 4, 6, 7];
  
  rowsToCompare.forEach(rowIndex => {
    const row = table.rows[rowIndex];
    const cells = Array.from(row.cells).slice(1);
    
    if (cells.length < 2) return;
    

    const isLowerBetter = rowIndex === 1 || rowIndex === 7;
    
    let bestValue, bestIndex;
    
    cells.forEach((cell, index) => {
      const cellText = cell.textContent;
      let value;
      
      if (rowIndex === 1) {
        value = parseFloat(cellText.replace(/[^\d.]/g, ''));
      } else if (rowIndex === 2) { 
        value = cellText.includes('i9') ? 4 :
                cellText.includes('i7') ? 3 :
                cellText.includes('Ryzen 9') ? 4 :
                cellText.includes('Ryzen 7') ? 3 :
                cellText.includes('M1 Pro') ? 4 :
                cellText.includes('M1') ? 3 : 2;
      } else if (rowIndex === 3) { 
        value = parseInt(cellText);
      } else if (rowIndex === 4) { 
        value = cellText.includes('2TB') ? 2000 :
                cellText.includes('1TB') ? 1000 :
                cellText.includes('512GB') ? 512 : 256;
      } else if (rowIndex === 6) {
        value = cellText.includes('3080') ? 5 :
                cellText.includes('3070') ? 4 :
                cellText.includes('3050') ? 3 :
                cellText.includes('16-core') ? 4 :
                cellText.includes('7-core') ? 2 : 1;
      } else if (rowIndex === 7) { 
        value = parseFloat(cellText);
      }
      
      if (value !== undefined) {
        if (bestValue === undefined || 
            (isLowerBetter && value < bestValue) || 
            (!isLowerBetter && value > bestValue)) {
          bestValue = value;
          bestIndex = index;
        }
      }
    });
    
    if (bestIndex !== undefined) {
      cells[bestIndex].classList.add('highlight');
    }
  });
}

// Save comparison to localStorage
function saveComparisonToLocalStorage(laptopIds) {
  const recentComparisons = JSON.parse(localStorage.getItem('recentComparisons') || '[]');
  

  const comparisonStr = laptopIds.sort().join(',');
  if (!recentComparisons.includes(comparisonStr)) {
    recentComparisons.unshift(comparisonStr);
    
    if (recentComparisons.length > 5) {
      recentComparisons.pop();
    }
    
    localStorage.setItem('recentComparisons', JSON.stringify(recentComparisons));
  }
}

function setupPresetComparisons(data) {
  const presetButtons = document.querySelectorAll('.load-comparison');
  
  presetButtons.forEach(button => {
    button.addEventListener('click', () => {
      const laptop1Id = button.dataset.laptop1;
      const laptop2Id = button.dataset.laptop2;
      
      document.getElementById('laptop1').value = laptop1Id;
      document.getElementById('laptop2').value = laptop2Id;
      document.getElementById('laptop3').value = "";
      
      document.getElementById('compare-btn').click();
      
      document.querySelector('.comparison-results').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function showErrorMessage(message) {
  const container = document.querySelector('.comparison-tool .container');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  
  container.innerHTML = '';
  container.appendChild(errorDiv);
}
