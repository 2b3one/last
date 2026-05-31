import fetch from "node-fetch";

export async function scrapeZabka() {
  const categories = await fetch("https://www.zabka.pl/api/products/categories")
    .then(r => r.json());

  let products = [];

  for (const cat of categories) {
    let page = 1;

    while (true) {
      const url = `https://www.zabka.pl/api/products?category=${cat.slug}&page=${page}`;
      const data = await fetch(url).then(r => r.json());

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
    }
  }

  return products;
}