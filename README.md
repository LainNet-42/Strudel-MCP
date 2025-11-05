# Strudel MCP Server

<div align="center">

**AI-Powered Live Coding Music Creation**

Control [Strudel.cc](https://strudel.cc/) directly from Claude Code for seamless AI-assisted music generation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

</div>

---

## Overview

Strudel MCP Server is a [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that enables Claude Code to control Strudel.cc in real-time. Create algorithmic music patterns, live code beats, and explore generative composition with AI.

---

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Claude Code CLI

### From Source

```bash
# Clone repository
git clone https://github.com/LainNet-42/Strudel-MCP.git
cd Strudel-MCP/strudel-mcp-server

# Install dependencies
npm install

# Install Chromium for browser automation
npx playwright install chromium

# Build the project
npm run build
```

---

## Quick Start

### 1. Add to Claude Code

```bash
# Add the MCP server to Claude
claude mcp add strudel node /path/to/Strudel-MCP/strudel-mcp-server/dist/index.js
```

---

This project is based on [williamzujkowski/strudel-mcp-server](https://github.com/williamzujkowski/strudel-mcp-server) - thanks to the original author for the creative foundation.
