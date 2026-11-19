import { readFileSync } from "node:fs";
import type { BakubearEvent } from "./types.js";

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