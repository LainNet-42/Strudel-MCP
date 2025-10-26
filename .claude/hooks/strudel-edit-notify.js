#!/usr/bin/env node

const fs = require('fs');

// Read stdin for hook input
let inputData = '';
process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    const hook = JSON.parse(inputData);

    // Only process if this is a Write/Edit to current.tidal
    const filePath = hook.tool_input?.file_path || '';
    if (!filePath.includes('current.tidal')) {
      process.exit(0);
    }

    // Return prompt to call play()
    const output = {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: 'Pattern written to current.tidal. Call mcp__strudel__play to play it and check for errors.'
      }
    };

    console.log(JSON.stringify(output));
    process.exit(0);

  } catch (error) {
    // Silent fail
    process.exit(0);
  }
});
