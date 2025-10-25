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
    const logFile = path.join(process.cwd(), 'strudel-debug.log');

    const log = (msg: string) => {
      const timestamp = new Date().toISOString();
      const logMsg = `[${timestamp}] ${msg}\n`;
      try {
        fs.appendFileSync(logFile, logMsg);
      } catch (e) {
        console.error('Failed to write log:', e);
      }
      console.log(msg);
    };

    log(`[DEBUG] Starting file watcher...`);
    log(`[DEBUG] Current working directory: ${process.cwd()}`);
    log(`[DEBUG] Pattern file path: ${this.patternFilePath}`);
    log(`[DEBUG] Patterns directory: ${patternsDir}`);

    if (!fs.existsSync(patternsDir)) {
      log(`[DEBUG] Creating patterns directory...`);
      fs.mkdirSync(patternsDir, { recursive: true });
    }

    if (!fs.existsSync(this.patternFilePath)) {
      log(`[DEBUG] Creating empty pattern file...`);
      fs.writeFileSync(this.patternFilePath, '');
    }

    this.watcher = fs.watch(this.patternFilePath, async (eventType) => {
      log(`[DEBUG] File event detected: ${eventType}`);
      if (eventType === 'change' || eventType === 'rename') {
        try {
          if (!fs.existsSync(this.patternFilePath)) {
            log('[DEBUG] File does not exist yet, waiting...');
            return;
          }
          const content = fs.readFileSync(this.patternFilePath, 'utf8');
          log(`[DEBUG] File content read (${content.length} chars): ${content.substring(0, 50)}...`);
          if (content.trim()) {
            log(`[DEBUG] Writing pattern to browser...`);
            await this.writePattern(content);
            log(`[DEBUG] Pattern written successfully`);
          }
        } catch (error) {
          log('[ERROR] File watch error: ' + error);
          console.error('[ERROR] File watch error:', error);
        }
      }
    });

    log(`[SUCCESS] Watching pattern file: ${this.patternFilePath}`);
  }

  async writePattern(pattern: string): Promise<string> {
    if (!this.page) throw new Error('Not initialized');

    await this.page.evaluate((code) => {
      const editorElement = document.querySelector('.cm-content');
      if (!editorElement) {
        throw new Error('Editor not found');
      }

      const view = (editorElement as any).cmView?.view;
      if (view) {
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: code
          }
        });
      } else {
        throw new Error('CodeMirror view not found');
      }
    }, pattern);

    return `Pattern written (${pattern.length} chars)`;
  }

  async getCurrentPattern(): Promise<string> {
    if (!this.page) throw new Error('Not initialized');

    return await this.page.evaluate(() => {
      const editor = document.querySelector('.cm-content');
      return editor?.textContent || '';
    });
  }

  getDebugInfo(): any {
    return {
      initialized: !!this.browser,
      watching: !!this.watcher,
      cwd: process.cwd(),
      patternFilePath: this.patternFilePath,
      fileExists: fs.existsSync(this.patternFilePath),
      fileContent: fs.existsSync(this.patternFilePath)
        ? fs.readFileSync(this.patternFilePath, 'utf8').substring(0, 100)
        : 'N/A'
    };
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
