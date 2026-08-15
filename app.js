// Rahul Kumar - Auficionado Prototype (Front-End Only)

async function loadAudiobooks() {
  const grid = document.getElementById("audiobook-grid");

  try {
    const res = await fetch("https://yourapp.up.railway.app/api/audiobooks");
    const data = await res.json();

    grid.innerHTML = "";

    data.forEach(book => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>Author ID:</strong> ${book.author_id}</p>
        <p><strong>Category ID:</strong> ${book.category_id}</p>
        <p><strong>Duration:</strong> ${book.duration_min} min</p>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    grid.innerHTML = "<p>Unable to load audiobooks. Check API connection.</p>";
  }
}

loadAudiobooks();