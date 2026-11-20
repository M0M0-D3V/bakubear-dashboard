import { readFileSync } from "node:fs";
import type { BakubearEvent, FeedItem } from "./types.js";

const raw = readFileSync("data/events.jsonl", "utf-8");
const events: BakubearEvent[] = [];
for (const line of raw.split("\n")) {
  if (line.trim() === "") continue;
  try {
    events.push(JSON.parse(line) as BakubearEvent);
  } catch {
    console.warn("Skipping bad line:", line);
  }
}

function summarize(events: BakubearEvent[]): { squeezes: number; messages: number } {
  const squeezes = events.filter((e) => e.type === "squeeze").length;
  const messages = events.filter((e) => e.type === "message").length;
  return { squeezes, messages };
}

function toEvent(item: FeedItem, id: number): BakubearEvent {
  return { id, type: "message", timestamp: item.created_at, text: item.value };
}

async function fetchMessages(): Promise<FeedItem[]> {
  const url = `https://io.adafruit.com/api/v2/${process.env.ADAFRUIT_IO_USERNAME}/feeds/bakubear-messages/data?limit=5`;
  const response = await fetch(url, { headers: { "X-AIO-Key": process.env.ADAFRUIT_IO_KEY ?? "" } });
  if (!response.ok) throw new Error(`Adafruit error: ${response.status}`);
  const items: FeedItem[] = await response.json();
  return items;
}

const items = await fetchMessages();
const liveEvents = items.map((item, i) => toEvent(item, events.length + i + 1));
const allEvents = [...events, ...liveEvents];
allEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

console.log(summarize(allEvents));

for (const e of allEvents) {
  if (e.type === "message") {
    console.log(`[${e.timestamp}] message: ${e.text}`);
  } else {
    console.log(`[${e.timestamp}] squeeze`);
  }
}