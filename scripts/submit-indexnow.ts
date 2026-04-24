/**
 * IndexNow submitter — pings Bing (and other IndexNow participants) with every
 * URL from /sitemap.xml so fresh/changed pages get crawled in minutes instead
 * of weeks.
 *
 * Usage: `npm run submit-indexnow`
 *
 * IndexNow is a single-endpoint notification protocol (https://www.indexnow.org/).
 * Google is NOT a participant — for Google, use Search Console + sitemap.
 */

const HOST = "daytripsvietnam.com";
const KEY = "56fb612cbb13b0b34ceb8884f3b0bcee";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
  if (urls.length === 0) throw new Error("No <loc> entries parsed from sitemap");
  return urls;
}

async function submit(urls: string[]): Promise<void> {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
  if (text) console.log(text);
  if (!res.ok) process.exit(1);
}

async function main() {
  console.log(`Fetching ${SITEMAP_URL} …`);
  const urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} URLs. Submitting to IndexNow …`);
  await submit(urls);
  console.log(`✓ Submitted ${urls.length} URLs.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
