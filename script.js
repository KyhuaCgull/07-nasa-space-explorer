// Select DOM elements matching your index.html IDs and classes
const getImagesBtn = document.getElementById('getImagesBtn');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const galleryContainer = document.getElementById('gallery'); // Matches id="gallery" in your HTML

console.log("🚀 script.js loaded successfully!");

// Main Event Listener for Fetching Images
if (getImagesBtn) {
  getImagesBtn.addEventListener('click', async () => {
    console.log("🖱️ Button clicked!");

    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    console.log(`📅 Selected Dates -> Start: ${startDate}, End: ${endDate}`);

    if (!startDate || !endDate) {
      alert('Please select both a start and end date.');
      return;
    }

    try {
      // Fetch data from NASA APOD API using DEMO_KEY
      const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startDate}&end_date=${endDate}`;
      console.log(`🌐 Fetching from URL: ${apiUrl}`);

      const response = await fetch(apiUrl);
      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Data received from NASA:", data);

      // Render Gallery
      renderGallery(data);

    } catch (error) {
      console.error('❌ Error fetching APOD data:', error);
      galleryContainer.innerHTML = `<p class="placeholder" style="color: red;">Failed to load space photos. Check console for details.</p>`;
    }
  });
} else {
  console.error("❌ Error: getImagesBtn element not found in HTML!");
}

// Render Gallery Cards
function renderGallery(items) {
  if (!Array.isArray(items)) {
    items = [items]; // Handle single item returns gracefully
  }

  galleryContainer.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('gallery-item');

    let mediaContent = '';
    if (item.media_type === 'video') {
      mediaContent = `<iframe src="${item.url}" title="${item.title}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      const imageUrl = item.hdurl || item.url;
      mediaContent = `<img src="${imageUrl}" alt="${item.title}" />`;
    }

    card.innerHTML = `
      ${mediaContent}
      <p><strong>${item.title}</strong><br><small>${item.date}</small></p>
    `;

    galleryContainer.appendChild(card);
  });
}