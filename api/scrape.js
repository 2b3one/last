import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  try {
    const executablePath = await chromium.executablePath;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
    );

    // 1. Wejście na stronę Żabki (przejście challenge)
    await page.goto("https://www.zabka.pl/produkty", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const cookies = await page.cookies();

    // 2. Pobranie JSON z API Żabki z cookies
    const response = await page.evaluate(async (cookies) => {
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

      const r = await fetch("https://www.zabka.pl/api/products/categories", {
        headers: {
          "User-Agent": navigator.userAgent,
          "Cookie": cookieHeader,
          "Accept": "application/json"
        }
      });

      return await r.json();
    }, cookies);

    await browser.close();

    return res.status(200).json({
      ok: true,
      categories: response
    });

  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: e.message
    });
  }
}