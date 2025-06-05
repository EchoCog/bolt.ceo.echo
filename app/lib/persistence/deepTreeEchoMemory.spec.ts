import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Message } from 'ai';

// Mock the database first
vi.mock('./db', () => ({
  openDatabase: vi.fn().mockResolvedValue({
    objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
    transaction: vi.fn().mockReturnValue({
      objectStore: vi.fn().mockReturnValue({
        put: vi.fn().mockReturnValue({ onsuccess: null, onerror: null }),
        getAll: vi.fn().mockReturnValue({ result: [], onsuccess: null, onerror: null }),
        index: vi.fn().mockReturnValue({
          getAll: vi.fn().mockReturnValue({ result: [], onsuccess: null, onerror: null }),
        }),
      }),
    }),
  }),
  storeDeepTreeEchoMemory: vi.fn().mockResolvedValue(undefined),
  getDeepTreeEchoMemories: vi.fn().mockResolvedValue([]),
  getCriticalDeepTreeEchoMemories: vi.fn().mockResolvedValue([]),
}));

import { DeepTreeEchoMemoryService } from './deepTreeEchoMemory';

describe('DeepTreeEchoMemoryService', () => {
  let memoryService: DeepTreeEchoMemoryService;

  beforeEach(() => {
    memoryService = DeepTreeEchoMemoryService.getInstance();
  });

  it('should store a memory', async () => {
    await expect(
      memoryService.storeMemory('experience', 'Test memory content', {
        context: 'test',
        importance: 'medium',
      }),
    ).resolves.not.toThrow();
  });

  it('should extract insights from conversation', async () => {
    const messages: Message[] = [
      {
        id: '1',
        role: 'user',
        content: 'Help me understand React hooks',
      },
      {
        id: '2',
        role: 'assistant',
        content:
          'React hooks are functions that let you use state and other React features in functional components. They provide a way to reuse stateful logic.',
      },
    ];

    await expect(memoryService.extractInsightsFromConversation(messages)).resolves.not.toThrow();
  });

  it('should generate memory context', async () => {
    const context = await memoryService.generateMemoryContext();
    expect(typeof context).toBe('string');
  });

  it('should get memories for context', async () => {
    const memories = await memoryService.getMemoriesForContext({ limit: 5 });
    expect(Array.isArray(memories)).toBe(true);
  });

  it('should extract tags from content', async () => {
    const messages: Message[] = [
      {
        id: '1',
        role: 'user',
        content: 'I need help with JavaScript programming and React development',
      },
      {
        id: '2',
        role: 'assistant',
        content: 'I can help you with JavaScript and React development. Let me explain...',
      },
    ];

    // This should not throw and should process the technical content
    await expect(memoryService.extractInsightsFromConversation(messages)).resolves.not.toThrow();
  });
});
