// Rahul Kumar - Auficionado Front-End

// Base Open Library search endpoint
const BASE_API_URL = "https://openlibrary.org/search.json";

// Simple mapping from category to query term
const CATEGORY_QUERIES = {
  all: "audiobook",
  fiction: "audiobook fiction",
  nonfiction: "audiobook nonfiction",
  science: "audiobook science",
  history: "audiobook history"
};

let currentCategory = "all";
let currentSearchTerm = "";

// Build query string for Open Library
function buildQuery() {
  const base = CATEGORY_QUERIES[currentCategory] || CATEGORY_QUERIES.all;

  if (currentSearchTerm.trim()) {
    return `${base} ${currentSearchTerm.trim()}`;
  }

  return base;
}

// Fetch audiobooks from Open Library
async function loadAudiobooks() {
  const loader = document.getElementById("loader");
  const container = document.getElementById("audiobook-list");

  try {
    loader.style.display = "block";
    container.innerHTML = "";

    const query = buildQuery();
    const url = `${BASE_API_URL}?q=${encodeURIComponent(query)}&limit=20`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    loader.style.display = "none";

    renderAudiobooks(data.docs || []);

  } catch (err) {
    console.error("Failed to load audiobooks:", err);
    loader.style.display = "none";

    container.innerHTML = `
      <div class="audiobook-card" style="border-left: 4px solid red;">
        <h3>Error Loading Audiobooks</h3>
        <p>Could not connect to Open Library.</p>
        <p style="color:red;">${err.message}</p>
      </div>
    `;
  }
}

// Render audiobook cards
function renderAudiobooks(items) {
  const container = document.getElementById("audiobook-list");
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `
      <div class="audiobook-card">
        <h3>No Results</h3>
        <p>Try a different search term or category.</p>
      </div>
    `;
    return;
  }

  items.forEach(book => {
    const card = document.createElement("div");
    card.className = "audiobook-card";

    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/300x220?text=No+Cover";

    const author = book.author_name?.[0] || "Unknown";
    const year = book.first_publish_year || "N/A";

    card.innerHTML = `
      <img src="${cover}" class="cover" alt="Cover for ${book.title}" />
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${author}</p>
      <p><strong>First Published:</strong> ${year}</p>
    `;

    container.appendChild(card);
  });
}

// Handle category tab clicks
function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      currentCategory = tab.dataset.category || "all";
      loadAudiobooks();
    });
  });
}

// Handle search
function setupSearch() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");

  button.addEventListener("click", () => {
    currentSearchTerm = input.value;
    loadAudiobooks();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      currentSearchTerm = input.value;
      loadAudiobooks();
    }
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupCategoryTabs();
  setupSearch();
  loadAudiobooks();
});