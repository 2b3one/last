import fetch from "node-fetch";
import { randomUA } from "../userAgents.js";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function safeJson(url) {
  const headers = {
    "User-Agent": randomUA(),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "pl-PL,pl;q=0.9",
    "Referer": "https://www.zabka.pl/",
    "Origin": "https://www.zabka.pl",
    "Cache-Control": "no-cache"
  };

  const res = await fetch(url, { headers });
  const text = await res.text();

  if (text.trim().startsWith("<")) {
    console.error("❌ HTML zamiast JSON:", url);
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("❌ JSON parse error:", url);
    return null;
  }
}

export async function scrapeZabka() {
  console.log("Scraping Żabka (rotacja UA + opóźnienia)...");

  const categories = await safeJson(
    "https://www.zabka.pl/api/products/categories"
  );

  if (!categories) {
    console.error("❌ Brak kategorii — Żabka zablokowała request");
    return [];
  }

  let products = [];

  for (const cat of categories) {
    let page = 1;

    while (true) {
      const url = `https://www.zabka.pl/api/products?category=${encodeURIComponent(
        cat.slug
      )}&page=${page}`;

      const data = await safeJson(url);

      if (!data?.items?.length) break;

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

      // opóźnienie 1–3 sekundy
      await sleep(1000 + Math.random() * 2000);
    }
  }

  return products;
}