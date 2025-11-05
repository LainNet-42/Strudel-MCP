import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { StrudelController } from '../StrudelController.js';
import { PatternStore } from '../PatternStore.js';
import { readFileSync, existsSync } from 'fs';
import { Logger } from '../utils/Logger.js';

const configPath = './config.json';
const config = existsSync(configPath)
  ? JSON.parse(readFileSync(configPath, 'utf-8'))
  : { headless: false };

export class EnhancedMCPServerSimple {
  private server: Server;
  private controller: StrudelController;
  private store: PatternStore;
  private logger: Logger;

  constructor() {
    this.server = new Server(
      {
        name: 'strudel-mcp-simple',
        version: '3.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.controller = new StrudelController(config.headless);
    this.store = new PatternStore('./patterns');
    this.logger = new Logger();
    this.setupHandlers();
  }

  private getTools(): Tool[] {
    return [
      // Core Control Tools
      {
        name: 'init',
        description: 'Initialize Strudel in browser',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'play',
        description: 'Start playing pattern',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'stop',
        description: 'Stop playback',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'clear',
        description: 'Clear the editor',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'get_pattern',
        description: 'Get current pattern code',
        inputSchema: { type: 'object', properties: {} }
      },

      // Session Management
      {
        name: 'save',
        description: 'Save pattern with metadata',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Pattern name' },
            tags: { type: 'array', items: { type: 'string' } }
          },
          required: ['name']
        }
      },
      {
        name: 'load',
        description: 'Load saved pattern',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Pattern name' }
          },
          required: ['name']
        }
      },
      {
        name: 'list',
        description: 'List saved patterns',
        inputSchema: {
          type: 'object',
          properties: {
            tag: { type: 'string', description: 'Filter by tag' }
          }
        }
      }
    ];
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools()
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        this.logger.info(`Executing tool: ${name}`, args);
        let result = await this.executeTool(name, args);

        return {
          content: [{
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
          }],
        };
      } catch (error: any) {
        this.logger.error(`Tool execution failed: ${name}`, error);
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.message}`
          }],
        };
      }
    });
  }

  private async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      // Core Control
      case 'init':
        return await this.controller.initialize();

      case 'play':
        return await this.controller.play();

      case 'stop':
        return await this.controller.stop();

      case 'clear':
        return await this.controller.writePattern('');

      case 'get_pattern':
        return await this.controller.getCurrentPattern();

      // Session Management
      case 'save':
        const toSave = await this.controller.getCurrentPattern();
        await this.store.save(args.name, toSave, args.tags || []);
        return `Pattern saved as "${args.name}"`;

      case 'load':
        const saved = await this.store.load(args.name);
        if (saved) {
          await this.controller.writePattern(saved.content);
          return `Loaded pattern "${args.name}"`;
        }
        return `Pattern "${args.name}" not found`;

      case 'list':
        const patterns = await this.store.list(args?.tag);
        return patterns.map(p =>
          `• ${p.name} [${p.tags.join(', ')}] - ${p.timestamp}`
        ).join('\n') || 'No patterns found';

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('Simple Strudel MCP server v3.0 running');

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down...');
      await this.controller.cleanup();
      process.exit(0);
    });
  }
}
