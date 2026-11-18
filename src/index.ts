import type { BakubearEvent } from "./types";

const events: BakubearEvent[] = [
  { id: 1, type: "squeeze", timestamp: "2026-11-17T20:00:00Z" },
  { id: 2, type: "message", timestamp: "2026-11-17T20:05:00Z", text: "hi bear" },
  { id: 3, type: "squeeze", timestamp: "2026-11-17T20:10:00Z" },
  { id: 4, type: "message", timestamp: "2026-11-17T20:15:00Z", text: "goodnight" },
];

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