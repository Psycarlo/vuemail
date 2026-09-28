#!/usr/bin/env node
// Committed, unlike the build, so that package managers can link the commands
// before the package is built, which a fresh install of the workspace needs
import '../dist/cli/index.mjs';
