export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  message: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}