// Rahul Kumar - Auficionado Prototype (Front-End Only)

// Railway backend API endpoint
const API_URL = "https://auficionado-backend-production.up.railway.app/api/audiobooks";

// Fetch audiobooks from backend
async function loadAudiobooks() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    renderAudiobooks(data);

  } catch (err) {
    console.error("Failed to load audiobooks:", err);
    document.getElementById("audiobook-list").innerHTML = `
      <p style="color:red;">Failed to load audiobooks. Check backend deployment.</p>
    `;
  }
}

// Render audiobook cards into the page
function renderAudiobooks(audiobooks) {
  const container = document.getElementById("audiobook-list");
  container.innerHTML = ""; // Clear previous content

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

// Load data when page loads
document.addEventListener("DOMContentLoaded", loadAudiobooks);