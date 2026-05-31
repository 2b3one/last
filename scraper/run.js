import { scrapeZabka } from "./sources/zabka.js";
import { scrapeJush } from "./sources/jush.js";
import { scrapeGazetka } from "./sources/gazetka.js";
import { mergeData } from "./merge.js";
import fs from "fs";

async function run() {
  console.log("Scraping Żabka...");
  const zabka = await scrapeZabka();

  console.log("Scraping Jush...");
  const jush = await scrapeJush();

  console.log("Scraping Gazetka...");
  const gazetka = await scrapeGazetka();

  console.log("Merging...");
  const merged = mergeData(zabka, jush, gazetka);

  fs.writeFileSync("products.json", JSON.stringify(merged, null, 2));

  console.log("Done.");
}

run();