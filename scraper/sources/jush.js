import fetch from "node-fetch";

export async function scrapeJush() {
  const categories = await fetch("https://jush.pl/api/v1/categories")
    .then(r => r.json());

  let products = [];

  for (const cat of categories) {
    const url = `https://jush.pl/api/v1/products?category_id=${cat.id}`;
    const data = await fetch(url).then(r => r.json());

    if (!data?.products) continue;

    products.push(
      ...data.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image_url,
        category: cat.name,
        source: "jush",
        bonus_points: p.bonus_points || 0
      }))
    );
  }

  return products;
}