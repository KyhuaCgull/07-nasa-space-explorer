console.log("script.js is loaded!");
// Select DOM elements based on standard starter file structure
const getImagesBtn = document.getElementById('getImagesBtn');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const galleryContainer = document.querySelector('.gallery');
const loadingElement = document.getElementById('loading-message'); // Loading message element
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');
const getImagesBtn = document.getElementById('getImagesBtn');

// --- LEVELUP: Random Space Facts Array ---
const spaceFacts = [
  "A day on Venus is longer than a year on Venus! It takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
  "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons on Earth.",
  "There are more trees on Earth than stars in the Milky Way galaxy—an estimated 3 trillion trees compared to 100-400 billion stars.",
  "Because there is no atmosphere on the Moon, astronauts' footprints left there will stay preserved for millions of years.",
  "One day on Mars lasts just over 24 hours and 39 minutes, very close to an Earth day!",
  "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth."
];

// Display a random space fact on page load (LevelUp)
function displayRandomFact() {
  const factContainer = document.getElementById('space-fact-container');
  if (factContainer) {
    const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    factContainer.innerHTML = `<strong>🌌 Did You Know?</strong> ${randomFact}`;
  }
}

// Run on initial page load
document.addEventListener('DOMContentLoaded', () => {
  displayRandomFact();
});

// Main Event Listener for Fetching Images
getImagesBtn.addEventListener('click', async () => {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }

  // Show Loading Message (Core Requirement)
  if (loadingElement) loadingElement.style.display = 'block';
  galleryContainer.innerHTML = '';

  try {
    // Fetch data from NASA APOD API using DEMO_KEY
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Hide Loading Message
    if (loadingElement) loadingElement.style.display = 'none';

    // Render Gallery
    renderGallery(data);

  } catch (error) {
    if (loadingElement) loadingElement.style.display = 'none';
    galleryContainer.innerHTML = `<p class="error-msg">Failed to load space photos. Please check your date range or network connection.</p>`;
    console.error('Error fetching APOD data:', error);
  }
});

// Render Gallery Cards
function renderGallery(items) {
  if (!Array.isArray(items)) {
    items = [items]; // Handle single item returns gracefully
  }

  galleryContainer.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('gallery-card');

    // --- LEVELUP: Handle Video vs Image Entries ---
    let mediaContent = '';
    if (item.media_type === 'video') {
      mediaContent = `
        <div class="video-preview-wrapper">
          <iframe src="${item.url}" title="${item.title}" frameborder="0" allowfullscreen></iframe>
          <p class="video-badge">🎥 Video Entry</p>
        </div>
      `;
    } else {
      // Use hdurl or url for images
      const imageUrl = item.hdurl || item.url;
      mediaContent = `<img src="${imageUrl}" alt="${item.title}" class="gallery-image" />`;
    }

    card.innerHTML = `
      ${mediaContent}
      <div class="card-info">
        <h3>${item.title}</h3>
        <p class="card-date">${item.date}</p>
      </div>
    `;

    // Click event to open Modal View (Core Requirement)
    card.addEventListener('click', () => {
      openModal(item);
    });

    galleryContainer.appendChild(card);
  });
}

// Modal View Handler (Core Requirement)
function openModal(item) {
  if (!modal || !modalBody) return;

  let modalMedia = '';
  if (item.media_type === 'video') {
    modalMedia = `<iframe src="${item.url}" title="${item.title}" class="modal-video" frameborder="0" allowfullscreen></iframe>`;
  } else {
    modalMedia = `<img src="${item.hdurl || item.url}" alt="${item.title}" class="modal-image" />`;
  }

  modalBody.innerHTML = `
    ${modalMedia}
    <h2>${item.title}</h2>
    <p class="modal-date"><strong>Date:</strong> ${item.date}</p>
    <p class="modal-explanation">${item.explanation}</p>
  `;

  modal.style.display = 'flex';
}

// Close Modal Logic
if (closeModalBtn && modal) {
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close when clicking outside modal content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}