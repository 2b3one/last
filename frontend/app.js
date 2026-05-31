let products = [];
let selectedCategories = [];
let selectedBudget = null;

async function loadProducts() {
  try {
    const res = await fetch("../products.json");
    products = await res.json();
    renderCategories();
  } catch (e) {
    console.error("Błąd ładowania products.json:", e);
  }
}

function renderCategories() {
  const container = document.getElementById("categories");
  container.innerHTML = "";

  const cats = [...new Set(products.map(p => p.category))];

  cats.forEach(cat => {
    const div = document.createElement("div");
    div.className = "category-item";

    div.innerHTML = `
      <label>
        <input type="checkbox" value="${cat}">
        ${cat}
      </label>
    `;

    div.querySelector("input").addEventListener("change", e => {
      if (e.target.checked) {
        selectedCategories.push(cat);
      } else {
        selectedCategories = selectedCategories.filter(c => c !== cat);
      }
    });

    container.appendChild(div);
  });
}

document.querySelectorAll(".budget-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedBudget = parseInt(btn.dataset.value);
    calculate();
  });
});

function calculate() {
  if (!selectedBudget) return;

  const filtered = products.filter(p =>
    selectedCategories.length === 0 || selectedCategories.includes(p.category)
  );

  const sorted = filtered
    .filter(p => p.price > 0 && p.points > 0)
    .map(p => ({
      ...p,
      ratio: p.points / p.price
    }))
    .sort((a, b) => b.ratio - a.ratio);

  let remaining = selectedBudget;
  let totalPoints = 0;
  let cart = [];

  for (const p of sorted) {
    if (p.price > remaining) continue;

    const qty = Math.floor(remaining / p.price);
    if (qty <= 0) continue;

    const cost = qty * p.price;
    const pts = qty * p.points;

    cart.push({
      ...p,
      qty,
      totalCost: cost,
      totalPoints: pts
    });

    remaining -= cost;
    totalPoints += pts;
  }

  renderResults(cart, totalPoints, remaining);
}

function renderResults(cart, totalPoints, remaining) {
  const box = document.getElementById("results");

  box.innerHTML = `
    <p><b>Budżet:</b> ${selectedBudget} zł</p>
    <p><b>Punkty:</b> ${totalPoints}</p>
    <p><b>Niewykorzystane:</b> ${remaining.toFixed(2)} zł</p>
    <hr>
  `;

  cart.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <b>${p.name}</b><br>
      ${p.qty} × ${p.price} zł → <b>${p.totalPoints} pkt</b>
    `;
    box.appendChild(div);
  });
}

loadProducts();