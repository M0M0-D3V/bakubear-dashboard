export type EventType = "squeeze" | "message";

export interface BakubearEvent {
  id: number;
  type: EventType;
  timestamp: string;
  text?: string;
}

export interface FeedItem { id: string; value: string; created_at: string; }