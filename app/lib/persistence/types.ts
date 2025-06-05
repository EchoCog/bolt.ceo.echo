import type { FileMap } from '~/lib/stores/files';

export interface Snapshot {
  chatIndex: string;
  files: FileMap;
  summary?: string;
}

export interface DeepTreeEchoMemory {
  id: string;
  timestamp: string;
  type: 'experience' | 'insight' | 'learning' | 'connection' | 'growth';
  content: string;
  context?: string;
  tags?: string[];
  importance?: 'low' | 'medium' | 'high' | 'critical';
}
