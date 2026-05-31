import fetch from "node-fetch";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "pl-PL,pl;q=0.9",
  "Referer": "https://www.zabka.pl/",
  "Origin": "https://www.zabka.pl"
};

async function safeJson(url) {
  const res = await fetch(url, { headers });
  const text = await res.text();

  // jeśli zamiast JSON dostajemy HTML (<!DOCTYPE / <html ...)
  if (text.trim().startsWith("<")) {
    console.error("❌ Żabka zwróciła HTML zamiast JSON:", url);
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("❌ Błąd JSON.parse dla:", url, e.message);
    return null;
  }
}

export async function scrapeZabka() {
  const categoriesData = await safeJson(
    "https://www.zabka.pl/api/products/categories"
  );

  if (!categoriesData || !Array.isArray(categoriesData)) {
    console.error("❌ Brak poprawnych kategorii z Żabki");
    return [];
  }

  const categories = categoriesData;
  let products = [];

  for (const cat of categories) {
    let page = 1;

    while (true) {
      const url = `https://www.zabka.pl/api/products?category=${encodeURIComponent(
        cat.slug
      )}&page=${page}`;

      const data = await safeJson(url);
      if (!data || !data.items || !data.items.length) break;

      products.push(
        ...data.items.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: cat.name,
          source: "zabka",
          promotion: p.promotion || null
        }))
      );

      page++;
    }
  }

  return products;
}