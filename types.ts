export interface Source {
  title: string;
  url: string;
}

export interface AnalysisResult {
  markdownContent: string;
  sources: Source[];
  sentiment: 'BUY' | 'SELL' | 'HOLD' | 'WAIT' | 'NEUTRAL';
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}