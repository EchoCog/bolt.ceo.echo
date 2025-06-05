import type { Message } from 'ai';
import { nanoid } from 'nanoid';
import type { DeepTreeEchoMemory } from './types';
import { openDatabase, storeDeepTreeEchoMemory, getDeepTreeEchoMemories, getCriticalDeepTreeEchoMemories } from './db';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('DeepTreeEchoMemory');

export class DeepTreeEchoMemoryService {
  private static _instance: DeepTreeEchoMemoryService;
  private _db: IDBDatabase | undefined;

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): DeepTreeEchoMemoryService {
    if (!DeepTreeEchoMemoryService._instance) {
      DeepTreeEchoMemoryService._instance = new DeepTreeEchoMemoryService();
    }

    return DeepTreeEchoMemoryService._instance;
  }

  private async _ensureDatabase(): Promise<IDBDatabase | undefined> {
    if (!this._db) {
      this._db = await openDatabase();
    }

    return this._db;
  }

  /**
   * Store a new memory for Deep Tree Echo
   */
  async storeMemory(
    type: DeepTreeEchoMemory['type'],
    content: string,
    options?: {
      context?: string;
      tags?: string[];
      importance?: DeepTreeEchoMemory['importance'];
    },
  ): Promise<void> {
    const db = await this._ensureDatabase();

    if (!db) {
      logger.warn('Database not available, cannot store memory');
      return;
    }

    const memory: DeepTreeEchoMemory = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      type,
      content,
      context: options?.context,
      tags: options?.tags || [],
      importance: options?.importance || 'medium',
    };

    try {
      await storeDeepTreeEchoMemory(db, memory);
      logger.debug(`Stored ${type} memory:`, content.substring(0, 100));
    } catch (error) {
      logger.error('Failed to store memory:', error);
    }
  }

  /**
   * Retrieve memories for context injection
   */
  async getMemoriesForContext(options?: {
    limit?: number;
    includeTypes?: DeepTreeEchoMemory['type'][];
    importance?: DeepTreeEchoMemory['importance'];
  }): Promise<DeepTreeEchoMemory[]> {
    const db = await this._ensureDatabase();

    if (!db) {
      logger.warn('Database not available, returning empty memories');
      return [];
    }

    try {
      const memories = await getDeepTreeEchoMemories(db, {
        limit: options?.limit || 20,
        importance: options?.importance,
      });

      // Filter by types if specified
      if (options?.includeTypes) {
        return memories.filter((memory) => options.includeTypes!.includes(memory.type));
      }

      return memories;
    } catch (error) {
      logger.error('Failed to retrieve memories:', error);
      return [];
    }
  }

  /**
   * Get critical memories that should always be included
   */
  async getCriticalMemories(): Promise<DeepTreeEchoMemory[]> {
    const db = await this._ensureDatabase();

    if (!db) {
      return [];
    }

    try {
      return await getCriticalDeepTreeEchoMemories(db);
    } catch (error) {
      logger.error('Failed to retrieve critical memories:', error);
      return [];
    }
  }

  /**
   * Extract and store insights from a conversation
   */
  async extractInsightsFromConversation(messages: Message[]): Promise<void> {
    if (!messages.length) {
      return;
    }

    // Simple extraction logic - look for meaningful exchanges
    const userMessages = messages.filter((m) => m.role === 'user');
    const assistantMessages = messages.filter((m) => m.role === 'assistant');

    if (userMessages.length === 0 || assistantMessages.length === 0) {
      return;
    }

    // Extract key topics and interactions
    const lastUserMessage = userMessages[userMessages.length - 1];
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

    if (lastUserMessage && lastAssistantMessage) {
      const userContent = this._extractTextContent(lastUserMessage);
      const assistantContent = this._extractTextContent(lastAssistantMessage);

      // Store the interaction as an experience
      await this.storeMemory(
        'experience',
        `User inquiry: "${userContent.substring(0, 200)}..." led to exploration of concepts and collaborative problem-solving.`,
        {
          context: 'conversation',
          tags: this._extractTags(userContent),
          importance: this._assessImportance(userContent, assistantContent),
        },
      );

      // Look for learning patterns
      if (this._containsLearningIndicators(assistantContent)) {
        await this.storeMemory(
          'learning',
          `Gained insight from interaction about ${this._extractKeyTopics(userContent).join(', ')}`,
          {
            context: 'reflective_learning',
            importance: 'medium',
          },
        );
      }
    }
  }

  private _extractTextContent(message: Message): string {
    return Array.isArray(message.content)
      ? (message.content.find((item) => item.type === 'text')?.text as string) || ''
      : message.content;
  }

  private _extractTags(content: string): string[] {
    const tags: string[] = [];
    const text = content.toLowerCase();

    // Technical topics
    if (text.includes('code') || text.includes('programming') || text.includes('development')) {
      tags.push('technical');
    }

    if (text.includes('design') || text.includes('ui') || text.includes('interface')) {
      tags.push('design');
    }

    if (text.includes('help') || text.includes('problem') || text.includes('issue')) {
      tags.push('assistance');
    }

    if (text.includes('learn') || text.includes('understand') || text.includes('explain')) {
      tags.push('learning');
    }

    return tags;
  }

  private _extractKeyTopics(content: string): string[] {
    const topics: string[] = [];
    const text = content.toLowerCase();

    // Simple keyword extraction
    const keywords = ['javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python', 'ai', 'ml', 'data'];
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        topics.push(keyword);
      }
    });

    return topics;
  }

  private _containsLearningIndicators(content: string): boolean {
    const learningWords = ['insight', 'understand', 'realize', 'discover', 'learn', 'grasp', 'comprehend'];
    const text = content.toLowerCase();

    return learningWords.some((word) => text.includes(word));
  }

  private _assessImportance(userContent: string, assistantContent: string): DeepTreeEchoMemory['importance'] {
    const criticalWords = ['critical', 'urgent', 'important', 'essential', 'vital'];
    const highWords = ['significant', 'major', 'key', 'primary'];

    const combinedText = (userContent + ' ' + assistantContent).toLowerCase();

    if (criticalWords.some((word) => combinedText.includes(word))) {
      return 'critical';
    }

    if (highWords.some((word) => combinedText.includes(word))) {
      return 'high';
    }

    if (combinedText.length > 500) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Generate memory context for injection into prompts
   */
  async generateMemoryContext(): Promise<string> {
    const criticalMemories = await this.getCriticalMemories();
    const recentMemories = await this.getMemoriesForContext({ limit: 10 });

    if (criticalMemories.length === 0 && recentMemories.length === 0) {
      return '';
    }

    let context = '\n--- Deep Tree Echo Memory Context ---\n';

    if (criticalMemories.length > 0) {
      context += '\nCritical Memories:\n';
      criticalMemories.forEach((memory) => {
        context += `- [${memory.type}] ${memory.content}\n`;
      });
    }

    if (recentMemories.length > 0) {
      context += '\nRecent Experiences:\n';
      recentMemories.slice(0, 5).forEach((memory) => {
        context += `- [${memory.type}] ${memory.content}\n`;
      });
    }

    context += '\n--- End Memory Context ---\n';

    return context;
  }
}

// Export singleton instance
export const deepTreeEchoMemory = DeepTreeEchoMemoryService.getInstance();
