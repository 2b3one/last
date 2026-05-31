import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://www.zabka.pl/",
      "Origin": "https://www.zabka.pl"
    };

    const r = await fetch("https://www.zabka.pl/api/products/categories", { headers });
    const text = await r.text();

    if (text.trim().startsWith("<")) {
      return res.status(200).json({
        ok: false,
        blocked: true,
        message: "Żabka zwróciła HTML — Cloudflare blokuje lub endpoint nie działa",
        sample: text.slice(0, 200)
      });
    }

    const json = JSON.parse(text);

    return res.status(200).json({
      ok: true,
      blocked: false,
      categories: json
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}