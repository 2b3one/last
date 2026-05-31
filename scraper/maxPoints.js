import { PRESET_BUDGETS } from "./budgets.js";

export function calculateMaxPoints(products, budget, selectedCategories = []) {
  let filtered = products.filter(
    p => selectedCategories.length === 0 || selectedCategories.includes(p.category)
  );

  filtered = filtered
    .filter(p => p.price > 0 && p.points > 0)
    .map(p => ({ ...p, ratio: p.points / p.price }))
    .sort((a, b) => b.ratio - a.ratio);

  let remaining = budget;
  let totalPoints = 0;
  let cart = [];

  for (const p of filtered) {
    if (p.price > remaining) continue;

    const qty = Math.floor(remaining / p.price);
    if (qty <= 0) continue;

    const cost = qty * p.price;
    const pts = qty * p.points;

    cart.push({ ...p, qty, totalCost: cost, totalPoints: pts });

    remaining -= cost;
    totalPoints += pts;
  }

  return { budget, used: budget - remaining, remaining, totalPoints, cart };
}

export function calculateForAllBudgets(products, categories) {
  const results = {};
  for (const b of PRESET_BUDGETS)
    results[b] = calculateMaxPoints(products, b, categories);
  return results;
}