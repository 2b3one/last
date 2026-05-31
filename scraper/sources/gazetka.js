import fetch from "node-fetch";

export async function scrapeGazetka() {
  const leaflets = await fetch("https://www.zabka.pl/api/leaflets")
    .then(r => r.json());

  let products = [];

  for (const lf of leaflets) {
    const data = await fetch(`https://www.zabka.pl/api/leaflets/${lf.id}`)
      .then(r => r.json());

    if (!data?.products) continue;

    products.push(
      ...data.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: "Gazetka",
        source: "gazetka",
        bonus_points: p.bonus_points || 0
      }))
    );
  }

  return products;
}