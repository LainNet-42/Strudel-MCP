#!/usr/bin/env python3

import json
import sys
import time
import os
from datetime import datetime, timedelta

# Read stdin for hook input
input_data = sys.stdin.read()

try:
    hook = json.loads(input_data)

    # Only process mcp__strudel__play
    tool_name = hook.get('tool_name', '')
    if tool_name != 'mcp__strudel__play':
        sys.exit(0)

    # Wait for play to complete evaluation
    time.sleep(1)

    # Read strudel-debug.log
    log_path = os.path.join(os.getcwd(), 'strudel-debug.log')

    if not os.path.exists(log_path):
        sys.exit(0)

    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find the latest PLAY_SUCCESS or PLAY_FAILED
    latest_status = None
    latest_time = None

    for line in reversed(lines):
        if '[PLAY_SUCCESS]' in line:
            # Extract timestamp
            if line.startswith('['):
                timestamp_str = line[1:line.index(']')]
                try:
                    latest_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
                    message = line.split('[PLAY_SUCCESS]')[1].strip()
                    latest_status = {'type': 'success', 'message': message}
                    break
                except:
                    pass
        elif '[PLAY_FAILED]' in line:
            # Extract timestamp
            if line.startswith('['):
                timestamp_str = line[1:line.index(']')]
                try:
                    latest_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
                    error_msg = line.split('[PLAY_FAILED]')[1].strip()
                    latest_status = {'type': 'failed', 'message': error_msg}
                    break
                except:
                    pass

    # If we found a status within last 5 seconds, report it
    if latest_status and latest_time:
        now = datetime.now(latest_time.tzinfo)
        diff = (now - latest_time).total_seconds()

        if diff < 5:
            if latest_status['type'] == 'failed':
                # Return error to Claude
                output = {
                    'hookSpecificOutput': {
                        'hookEventName': 'PostToolUse',
                        'additionalContext': f"Pattern failed to play:\n{latest_status['message']}"
                    }
                }
                print(json.dumps(output))
            # For success, silent exit

    sys.exit(0)

except Exception:
    # Silent fail
    sys.exit(0)
