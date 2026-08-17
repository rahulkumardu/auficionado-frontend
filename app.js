// Rahul Kumar - Auficionado Front-End

let currentCategory = "all";
let currentSearchTerm = "";
let favorites = [];
let currentPage = 1;
const PAGE_SIZE = 20;

// Category keyword mapping
const CATEGORY_KEYWORDS = {
  all: "",
  fiction: "fiction",
  nonfiction: "nonfiction",
  science: "science",
  history: "history"
};

// Load audiobooks from JSON
async function loadAudiobooks(append = false) {
  const loader = document.getElementById("loader");
  const list = document.getElementById("audiobook-list");

  try {
    loader.style.display = "block";

    if (!append) {
      list.innerHTML = "";
      currentPage = 1;
    }

    const response = await fetch("audiobooks.json");
    const data = await response.json();

    loader.style.display = "none";

    let items = data.items;

    // Category filter
    const keyword = CATEGORY_KEYWORDS[currentCategory];
    if (keyword) {
      items = items.filter(item =>
        item.description.toLowerCase().includes(keyword)
      );
    }

    // Search filter
    if (currentSearchTerm.trim()) {
      const term = currentSearchTerm.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.author.toLowerCase().includes(term)
      );
    }

    // Pagination
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = items.slice(start, end);

    renderAudiobooks(pageItems);

    const loadMoreBtn = document.getElementById("load-more");
    if (end >= items.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }

  } catch (error) {
    loader.style.display = "none";
    list.innerHTML = `<p style="color:red;">Failed to load audiobooks.</p>`;
  }
}

// Render audiobook cards
function renderAudiobooks(items) {
  const list = document.getElementById("audiobook-list");

  items.forEach(book => {
    const card = document.createElement("div");
    card.className = "audiobook-card";

    card.innerHTML = `
      <img src="${book.cover}" class="cover" />
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Year:</strong> ${book.year}</p>
    `;

    card.addEventListener("click", () => openModal(book));
    list.appendChild(card);
  });
}

// Open modal with book details
function openModal(book) {
  const modal = document.getElementById("detail-modal");

  document.getElementById("modal-cover").src = book.cover;
  document.getElementById("modal-title").textContent = book.title;
  document.getElementById("modal-author").textContent = `Author: ${book.author}`;
  document.getElementById("modal-year").textContent = `Published: ${book.year}`;
  document.getElementById("modal-description").textContent = book.description;

  document.getElementById("modal-audio-src").src = book.audio;
  document.getElementById("modal-audio").load();

  document.getElementById("favorite-btn").onclick = () => addFavorite(book);

  modal.classList.remove("hidden");
}

// Close modal
document.getElementById("modal-close").onclick = () => {
  document.getElementById("detail-modal").classList.add("hidden");
};

// Add book to favorites
function addFavorite(book) {
  favorites.push(book);
  renderFavorites();
}

// Render favorites panel
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
      <h4>${fav.title}</h4>
      <p>${fav.author}</p>
    `;

    list.appendChild(item);
  });
}

// Category tabs
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

// Search functionality
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

// Load More button
document.getElementById("load-more").onclick = () => {
  currentPage++;
  loadAudiobooks(true);
};

// Dark mode toggle
document.getElementById("dark-mode-toggle").onclick = () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  setupCategoryTabs();
  setupSearch();
  loadAudiobooks();
});