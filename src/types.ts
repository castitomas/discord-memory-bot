export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface UserMemory {
  user_id: string;
  username: string;
  facts: string[];
  history: ChatMessage[];
  updated_at?: string;
}

export interface GenerateReplyParams {
  username: string;
  facts: string[];
  history: ChatMessage[];
  userMessage: string;
}