// Rahul Kumar - Auficionado Front-End

const OPEN_LIBRARY_API = "https://openlibrary.org/search.json";

const CATEGORY_QUERIES = {
  all: "audiobook",
  fiction: "audiobook fiction",
  nonfiction: "audiobook nonfiction",
  science: "audiobook science",
  history: "audiobook history"
};

let currentCategory = "all";
let currentSearchTerm = "";
let currentPage = 1;
let favorites = [];

const AUDIO_SAMPLES = {
  "Pride and Prejudice": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "Moby Dick": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "The Art of War": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "Frankenstein": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "Dracula": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
};

function buildQuery() {
  const base = CATEGORY_QUERIES[currentCategory];
  return currentSearchTerm.trim()
    ? `${base} ${currentSearchTerm.trim()}`
    : base;
}

async function loadAudiobooks(append = false) {
  const loader = document.getElementById("loader");
  const container = document.getElementById("audiobook-list");

  try {
    loader.style.display = "block";
    if (!append) container.innerHTML = "";

    const query = buildQuery();

    const url = `${OPEN_LIBRARY_API}?q=${encodeURIComponent(query)}&page=${currentPage}&limit=20`;

    const res = await fetch(url);
    const data = await res.json();

    loader.style.display = "none";

    if (!data.docs || data.docs.length === 0) {
      container.innerHTML = `<p style="color:red;">No audiobooks found.</p>`;
      return;
    }

    renderAudiobooks(data.docs, append);

  } catch (err) {
    loader.style.display = "none";
    container.innerHTML = `<p style="color:red;">Failed to load audiobooks.</p>`;
  }
}

function renderAudiobooks(items, append) {
  const container = document.getElementById("audiobook-list");

  items.forEach(book => {
    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/300x220?text=No+Cover";

    const card = document.createElement("div");
    card.className = "audiobook-card";

    card.innerHTML = `
      <img src="${cover}" class="cover" />
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author_name?.[0] || "Unknown"}</p>
      <p><strong>Year:</strong> ${book.first_publish_year || "N/A"}</p>
    `;

    card.addEventListener("click", () => openModal(book, cover));
    container.appendChild(card);
  });
}

function openModal(book, cover) {
  const modal = document.getElementById("detail-modal");

  document.getElementById("modal-cover").src = cover;
  document.getElementById("modal-title").textContent = book.title;
  document.getElementById("modal-author").textContent =
    `Author: ${book.author_name?.[0] || "Unknown"}`;
  document.getElementById("modal-year").textContent =
    `First Published: ${book.first_publish_year || "N/A"}`;
  document.getElementById("modal-description").textContent =
    book.subtitle || "No description available.";

  const audioSrc = document.getElementById("modal-audio-src");
  const sample =
    AUDIO_SAMPLES[book.title] ||
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3";

  audioSrc.src = sample;
  document.getElementById("modal-audio").load();

  document.getElementById("favorite-btn").onclick = () =>
    addFavorite(book, cover);

  modal.classList.remove("hidden");
}

document.getElementById("modal-close").onclick = () => {
  document.getElementById("detail-modal").classList.add("hidden");
};

function addFavorite(book, cover) {
  favorites.push({ ...book, cover });
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
      <p>${fav.author_name?.[0] || "Unknown"}</p>
    `;
    list.appendChild(item);
  });
}

document.getElementById("load-more").onclick = () => {
  currentPage++;
  loadAudiobooks(true);
};

function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      currentCategory = tab.dataset.category;
      currentPage = 1;
      loadAudiobooks();
    });
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");

  button.addEventListener("click", () => {
    currentSearchTerm = input.value;
    currentPage = 1;
    loadAudiobooks();
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      currentSearchTerm = input.value;
      currentPage = 1;
      loadAudiobooks();
    }
  });
}

document.getElementById("dark-mode-toggle").onclick = () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
};

document.addEventListener("DOMContentLoaded", () => {
  setupCategoryTabs();
  setupSearch();
  loadAudiobooks();
});