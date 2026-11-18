export type EventType = "squeeze" | "message";

export interface BakubearEvent {
  id: number;
  type: EventType;
  timestamp: string;
  text?: string;
}