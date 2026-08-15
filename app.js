// Rahul Kumar - Auficionado Prototype (Front-End Only)

const API_URL = "https://auficionado-backend-production.up.railway.app/api/audiobooks";

async function loadAudiobooks() {
  const loader = document.getElementById("loader");
  const container = document.getElementById("audiobook-list");

  try {
    loader.style.display = "block";

    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    loader.style.display = "none";

    renderAudiobooks(data);

  } catch (err) {
    console.error("Failed to load audiobooks:", err);
    loader.style.display = "none";

    container.innerHTML = `
      <div class="audiobook-card" style="border-left: 4px solid red;">
        <h3>Error Loading Audiobooks</h3>
        <p>Could not connect to the backend API.</p>
        <p style="color:red;">${err.message}</p>
      </div>
    `;
  }
}

function renderAudiobooks(audiobooks) {
  const container = document.getElementById("audiobook-list");
  container.innerHTML = "";

  audiobooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "audiobook-card";

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author ID:</strong> ${book.author_id}</p>
      <p><strong>Category ID:</strong> ${book.category_id}</p>
      <p><strong>Duration:</strong> ${book.duration_min} minutes</p>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadAudiobooks);
