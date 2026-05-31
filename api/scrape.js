import { scrapeZabka } from "../scraper/sources/zabka.js";
import { scrapeJush } from "../scraper/sources/jush.js";
import { scrapeGazetka } from "../scraper/sources/gazetka.js";
import { mergeData } from "../scraper/merge.js";

export default async function handler(req, res) {
  try {
    console.log("Scraping start...");

    const zabka = await scrapeZabka();
    const jush = await scrapeJush();
    const gazetka = await scrapeGazetka();

    const merged = mergeData(zabka, jush, gazetka);

    // na razie tylko zwracamy JSON w odpowiedzi
    return res.status(200).json({
      count: merged.length,
      sample: merged.slice(0, 5)
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "scrape failed", details: e.message });
  }
}