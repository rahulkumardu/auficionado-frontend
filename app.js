// Rahul Kumar - Auficionado Front-End

// ⭐ Google Books API
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// Category → keyword mapping
const CATEGORY_QUERIES = {
  all: "audiobook",
  fiction: "fiction audiobook",
  nonfiction: "nonfiction audiobook",
  science: "science audiobook",
  history: "history audiobook"
};

let currentCategory = "all";
let currentSearchTerm = "";
let currentPage = 0; // Google Books uses startIndex instead of pages
let favorites = [];

// ⭐ Real audio samples (public domain demo clips)
const AUDIO_SAMPLES = {
  "Pride and Prejudice": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "Moby Dick": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "The Art of War": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "Frankenstein": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "Dracula": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
};

// Build query
function buildQuery() {
  const base = CATEGORY_QUERIES[currentCategory];
  return currentSearchTerm.trim()
    ? `${base} ${currentSearchTerm.trim()}`
    : base;
}

// Fetch audiobooks
async function loadAudiobooks(append = false) {
  const loader = document.getElementById("loader");
  const container = document.getElementById("audiobook-list");

  try {
    loader.style.display = "block";
    if (!append) container.innerHTML = "";

    const query = buildQuery();

    const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&printType=books&maxResults=20&startIndex=${currentPage}`;

    const res = await fetch(url);
    const data = await res.json();

    loader.style.display = "none";

    if (!data.items) {
      container.innerHTML = `<p style="color:red;">No audiobooks found.</p>`;
      return;
    }

    renderAudiobooks(data.items, append);

  } catch (err) {
    loader.style.display = "none";
    container.innerHTML = `<p style="color:red;">Failed to load audiobooks.</p>`;
  }
}

// Render cards
function renderAudiobooks(items, append) {
  const container = document.getElementById("audiobook-list");

  items.forEach(item => {
    const info = item.volumeInfo;

    const cover =
      info.imageLinks?.thumbnail ||
      "https://via.placeholder.com/300x220?text=No+Cover";

    const card = document.createElement("div");
    card.className = "audiobook-card";

    card.innerHTML = `
      <img src="${cover}" class="cover" />
      <h3>${info.title}</h3>
      <p><strong>Author:</strong> ${info.authors?.[0] || "Unknown"}</p>
      <p><strong>Year:</strong> ${info.publishedDate || "N/A"}</p>
    `;

    card.addEventListener("click", () => openModal(info, cover));
    container.appendChild(card);
  });
}

// Modal
function openModal(info, cover) {
  const modal = document.getElementById("detail-modal");

  document.getElementById("modal-cover").src = cover;
  document.getElementById("modal-title").textContent = info.title;
  document.getElementById("modal-author").textContent =
    `Author: ${info.authors?.[0] || "Unknown"}`;
  document.getElementById("modal-year").textContent =
    `Published: ${info.publishedDate || "N/A"}`;
  document.getElementById("modal-description").textContent =
    info.description || "No description available.";

  // ⭐ Set audio sample
  const audioSrc = document.getElementById("modal-audio-src");
  const sample =
    AUDIO_SAMPLES[info.title] ||
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3";

  audioSrc.src = sample;
  document.getElementById("modal-audio").load();

  // ⭐ Favorites button
  document.getElementById("favorite-btn").onclick = () =>
    addFavorite(info, cover);

  modal.classList.remove("hidden");
}

document.getElementById("modal-close").onclick = () => {
  document.getElementById("detail-modal").classList.add("hidden");
};

// Favorites
function addFavorite(info, cover) {
  favorites.push({ ...info, cover });
  renderFavorites();
}

function renderFavorites() {
  const panel = document.getElementById("favorites-panel");
  const list = document.getElementById("favorites-list");

  panel.classList.remove("hidden");
  list.innerHTML = "";

  favorites.forEach(fav => {
    const item = document.createElement("div");
    item.className = "audiobook-card";
    item.innerHTML = `
      <img src="${fav.cover}" class="cover" />
      <h3>${fav.title}</h3>
      <p>${fav.authors?.[0] || "Unknown"}</p>
    `;
    list.appendChild(item);
  });
}

// Pagination
document.getElementById("load-more").onclick = () => {
  currentPage += 20;
  loadAudiobooks(true);
};

// Tabs
function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      currentCategory = tab.dataset.category;
      currentPage = 0;
      loadAudiobooks();
    });
  });
}

// Search
function setupSearch() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");

  button.addEventListener("click", () => {
    currentSearchTerm = input.value;
    currentPage = 0;
    loadAudiobooks();
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      currentSearchTerm = input.value;
      currentPage = 0;
      loadAudiobooks();
    }
  });
}

// Dark Mode
document.getElementById("dark-mode-toggle").onclick = () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
};

// Init
document.addEventListener("DOMContentLoaded", () => {
  setupCategoryTabs();
  setupSearch();
  loadAudiobooks();
});