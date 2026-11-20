import { readFileSync } from "node:fs";
import type { BakubearEvent, FeedItem } from "./types.js";

const raw = readFileSync("data/events.jsonl", "utf-8");
const events: BakubearEvent[] = raw
  .split("\n")
  .filter((line) => line.trim() !== "")
  .map((line) => JSON.parse(line) as BakubearEvent);

function summarize(events: BakubearEvent[]): { squeezes: number; messages: number } {
  const squeezes = events.filter((e) => e.type === "squeeze").length;
  const messages = events.filter((e) => e.type === "message").length;
  return { squeezes, messages };
}

console.log(summarize(events));

for (const e of events) {
  if (e.type === "message") {
    console.log(`[${e.timestamp}] message: ${e.text}`);
  } else {
    console.log(`[${e.timestamp}] squeeze`);
  }
}

async function fetchMessages(): Promise<FeedItem[]> {
  const url = `https://io.adafruit.com/api/v2/${process.env.ADAFRUIT_IO_USERNAME}/feeds/bakubear-messages/data?limit=5`;
  const response = await fetch(url, { headers: { "X-AIO-Key": process.env.ADAFRUIT_IO_KEY ?? "" } });
  if (!response.ok) throw new Error(`Adafruit error: ${response.status}`);
  const items: FeedItem[] = await response.json();
  return items;
}

const items = await fetchMessages();
for (const item of items) console.log(`[${item.created_at}] ${item.value}`);