import express from "express";
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

async function getTimeline(): Promise<BakubearEvent[]> {
  const items = await fetchMessages();
  const liveEvents = items.map((item, i) => toEvent(item, events.length + i + 1));
  const allEvents = [...events, ...liveEvents];
  allEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return allEvents;
}

const app = express();
app.use(express.static("public"));
const PORT = 3000;
app.get("/api/events", async (req, res) => {
  try {
    res.json(await getTimeline());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load events" });
  }
  });
  app.listen(PORT, () => {
    console.log(`Bakubear dashboard on http://localhost:${PORT}`);
});