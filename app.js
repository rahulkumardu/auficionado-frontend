// Rahul Kumar - Auficionado Front-End

let currentCategory = "all";
let currentSearchTerm = "";
let favorites = [];
let currentIndex = 0;
const PAGE_SIZE = 12;
let filteredItems = [];

const CATEGORY_KEYWORDS = {
  all: "",
  fiction: "fiction",
  nonfiction: "nonfiction",
  science: "science",
  history: "history"
};

async function loadAudiobooks(reset = true) {
  const loader = document.getElementById("loader");
  const container = document.getElementById("audiobook-list");

  try {
    loader.style.display = "block";
    if (reset) {
      container.innerHTML = "";
      currentIndex = 0;
    }

    const res = await fetch("audiobooks.json");
    const data = await res.json();

    loader.style.display = "none";

    filteredItems = data.items;

    const categoryKeyword = CATEGORY_KEYWORDS[currentCategory];
    if (categoryKeyword) {
      filteredItems = filteredItems.filter(item =>
        item.description.toLowerCase().includes(categoryKeyword)
      );
    }

    if (currentSearchTerm.trim()) {
      const term = currentSearchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.author.toLowerCase().includes(term)
      );
    }

    loadMoreItems();

  } catch (err) {
    loader.style.display = "none";
    container.innerHTML = `<p style="color:red;">Failed to load audiobooks.</p>`;
  }
}

function loadMoreItems() {
  if (!filteredItems || filteredItems.length === 0) return;

  const container = document.getElementById("audiobook-list");

  const nextItems = filteredItems.slice(currentIndex, currentIndex + PAGE_SIZE);
  currentIndex += PAGE_SIZE;

  nextItems.forEach(book => {
    if (!book) return;

    const card = document.createElement("div");
    card.className = "audiobook-card";

    card.innerHTML = `
      <img src="${book.cover}" class="cover" />
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Year:</strong> ${book.year}</p>
    `;

    card.addEventListener("click", () => openModal(book));
    container.appendChild(card);
  });
}

window.addEventListener("scroll", () => {
  if (filteredItems.length === 0) return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadMoreItems();
  }

  const scrollTopBtn = document.getElementById("scroll-top");
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

document.getElementById("scroll-top").onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

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

document.getElementById("modal-close").onclick = () => {
  document.getElementById("detail-modal").classList.add("hidden");
};

function addFavorite(book) {
  favorites.push(book);
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
      <p>${fav.author}</p>
    `;
    list.appendChild(item);
  });
}

function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      currentCategory = tab.dataset.category;
      loadAudiobooks(true);
    });
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");

  button.addEventListener("click", () => {
    currentSearchTerm = input.value;
    loadAudiobooks(true);
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      currentSearchTerm = input.value;
      loadAudiobooks(true);
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
  loadAudiobooks(true);
});