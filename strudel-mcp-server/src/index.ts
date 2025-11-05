#!/usr/bin/env node
import { EnhancedMCPServerSimple } from './server/EnhancedMCPServerSimple.js';

const server = new EnhancedMCPServerSimple();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});