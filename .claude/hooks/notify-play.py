#!/usr/bin/env python3

import json
import sys

# Read stdin for hook input
input_data = sys.stdin.read()

try:
    hook = json.loads(input_data)

    # Check if this is a Write/Edit to current.tidal
    file_path = hook.get('tool_input', {}).get('file_path', '')
    if 'current.tidal' not in file_path:
        sys.exit(0)

    # Return prompt to call play()
    output = {
        'hookSpecificOutput': {
            'hookEventName': 'PostToolUse',
            'additionalContext': 'If you modified the pattern file (current.tidal), you should immediately call mcp__strudel__play tool'
        }
    }

    print(json.dumps(output))
    sys.exit(0)

except Exception:
    # Silent fail
    sys.exit(0)
