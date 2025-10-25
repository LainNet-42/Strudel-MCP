import { chromium, Browser, Page } from 'playwright';
import { AudioAnalyzer } from './AudioAnalyzer.js';
import * as fs from 'fs';
import * as path from 'path';

export class StrudelController {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private analyzer: AudioAnalyzer;
  private isHeadless: boolean;
  private watcher: fs.FSWatcher | null = null;
  private patternFilePath: string;

  constructor(headless: boolean = false) {
    this.isHeadless = headless;
    this.analyzer = new AudioAnalyzer();
    this.patternFilePath = path.join(process.cwd(), 'patterns', 'current.tidal');
  }

  async initialize(): Promise<string> {
    if (this.browser) {
      return 'Already initialized';
    }

    this.browser = await chromium.launch({
      headless: this.isHeadless,
      args: ['--use-fake-ui-for-media-stream'],
    });

    const context = await this.browser.newContext({
      permissions: ['microphone'],
    });

    this.page = await context.newPage();

    await this.page.goto('https://strudel.cc/', {
      waitUntil: 'networkidle',
    });

    await this.page.waitForSelector('.cm-content', { timeout: 10000 });

    await this.analyzer.inject(this.page);

    this.startFileWatcher();

    return 'Strudel initialized successfully';
  }

  private startFileWatcher(): void {
    const patternsDir = path.dirname(this.patternFilePath);

    if (!fs.existsSync(patternsDir)) {
      fs.mkdirSync(patternsDir, { recursive: true });
    }

    if (!fs.existsSync(this.patternFilePath)) {
      fs.writeFileSync(this.patternFilePath, '');
    }

    this.watcher = fs.watch(this.patternFilePath, async (eventType) => {
      if (eventType === 'change') {
        try {
          const content = fs.readFileSync(this.patternFilePath, 'utf8');
          if (content.trim()) {
            await this.writePattern(content);
          }
        } catch (error) {
          console.error('File watch error:', error);
        }
      }
    });

    console.log(`Watching pattern file: ${this.patternFilePath}`);
  }

  async writePattern(pattern: string): Promise<string> {
    if (!this.page) throw new Error('Not initialized');

    await this.page.click('.cm-content');
    await this.page.keyboard.press('ControlOrMeta+A');
    await this.page.keyboard.type(pattern);

    return `Pattern written (${pattern.length} chars)`;
  }

  async getCurrentPattern(): Promise<string> {
    if (!this.page) throw new Error('Not initialized');

    return await this.page.evaluate(() => {
      const editor = document.querySelector('.cm-content');
      return editor?.textContent || '';
    });
  }

  async play(): Promise<string> {
    if (!this.page) throw new Error('Not initialized');

    try {
      await this.page.click('button[title*="play" i]', { timeout: 1000 });
    } catch {
      await this.page.keyboard.press('ControlOrMeta+Enter');
    }

    await this.page.waitForTimeout(500);

    return 'Playing';
  }

  async stop(): Promise<string> {
    if (!this.page) throw new Error('Not initialized');

    try {
      await this.page.click('button[title*="stop" i]', { timeout: 1000 });
    } catch {
      await this.page.keyboard.press('ControlOrMeta+Period');
    }

    return 'Stopped';
  }

  async analyzeAudio(): Promise<any> {
    if (!this.page) throw new Error('Not initialized');

    return await this.analyzer.getAnalysis(this.page);
  }

  async cleanup() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}
