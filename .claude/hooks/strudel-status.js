#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read stdin for hook input
let inputData = '';
process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', async () => {
  try {
    const hook = JSON.parse(inputData);

    // Only process if this is a Write/Edit to current.tidal
    const filePath = hook.tool_input?.file_path || '';
    if (!filePath.includes('current.tidal')) {
      process.exit(0);
    }

    // Wait for auto-play to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Read strudel-debug.log
    const logPath = path.join(process.cwd(), 'strudel-debug.log');

    if (!fs.existsSync(logPath)) {
      process.exit(0);
    }

    const logContent = fs.readFileSync(logPath, 'utf8');
    const lines = logContent.split('\n');

    // Find the latest PLAY_SUCCESS or PLAY_FAILED
    let latestStatus = null;
    let latestTime = null;

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];

      if (line.includes('[PLAY_SUCCESS]')) {
        const match = line.match(/\[(.*?)\]/);
        if (match && match[1]) {
          latestTime = new Date(match[1]);
          latestStatus = {
            type: 'success',
            message: line.split('[PLAY_SUCCESS]')[1].trim()
          };
          break;
        }
      } else if (line.includes('[PLAY_FAILED]')) {
        const match = line.match(/\[(.*?)\]/);
        if (match && match[1]) {
          latestTime = new Date(match[1]);
          const errorMsg = line.split('[PLAY_FAILED]')[1].trim();
          latestStatus = {
            type: 'failed',
            message: errorMsg
          };
          break;
        }
      }
    }

    // If we found a status within last 15 seconds, report it
    if (latestStatus && latestTime) {
      const now = new Date();
      const diff = now - latestTime;

      if (diff < 15000) {  // Within 15 seconds
        if (latestStatus.type === 'failed') {
          // Return error to Claude
          const output = {
            hookSpecificOutput: {
              hookEventName: 'PostToolUse',
              additionalContext: `⚠️ Strudel pattern failed to play:\n${latestStatus.message}`
            }
          };
          console.log(JSON.stringify(output));
        }
        // For success, we can be silent or optionally report
      }
    }

    process.exit(0);

  } catch (error) {
    // Silent fail
    process.exit(0);
  }
});
