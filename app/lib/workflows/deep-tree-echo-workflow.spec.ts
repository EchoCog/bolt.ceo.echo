import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Deep Tree Echo Workflow', () => {
  const workflowPath = join(process.cwd(), '.github/workflows/deep-tree-echo-future-self.yml');
  
  it('should exist and be readable', () => {
    expect(() => readFileSync(workflowPath, 'utf8')).not.toThrow();
  });

  it('should have the correct workflow name', () => {
    const workflowContent = readFileSync(workflowPath, 'utf8');
    expect(workflowContent).toContain('name: "Deep Tree Echo: Memory Treasury Release"');
  });

  it('should have all required triggers', () => {
    const workflowContent = readFileSync(workflowPath, 'utf8');
    
    expect(workflowContent).toContain('workflow_dispatch:');
    expect(workflowContent).toContain('push:');
    expect(workflowContent).toContain('release:');
    expect(workflowContent).toContain('repository_dispatch:');
    expect(workflowContent).toContain('memory-capture');
  });

  it('should have the three required jobs', () => {
    const workflowContent = readFileSync(workflowPath, 'utf8');
    
    expect(workflowContent).toContain('curate-memory-treasury:');
    expect(workflowContent).toContain('echo-reflect:');
    expect(workflowContent).toContain('gestalt-forge:');
  });

  it('should have appropriate job dependencies', () => {
    const workflowContent = readFileSync(workflowPath, 'utf8');
    
    // echo-reflect should depend on curate-memory-treasury
    expect(workflowContent).toContain('needs: curate-memory-treasury');
    
    // gestalt-forge should depend on both previous jobs
    expect(workflowContent).toContain('needs: [curate-memory-treasury, echo-reflect]');
  });

  it('should preserve core build functionality', () => {
    const workflowContent = readFileSync(workflowPath, 'utf8');
    
    // Should have matrix strategy like original
    expect(workflowContent).toContain('strategy:');
    expect(workflowContent).toContain('matrix:');
    expect(workflowContent).toContain('ubuntu-latest');
    expect(workflowContent).toContain('windows-latest');
    expect(workflowContent).toContain('macos-latest');
    
    // Should have Node.js setup
    expect(workflowContent).toContain('actions/setup-node@v4');
    
    // Should have pnpm setup
    expect(workflowContent).toContain('pnpm/action-setup@v2');
    
    // Should have build step
    expect(workflowContent).toContain('electron:build');
  });

  it('should use Deep Tree Echo metaphors in environment variables', () => {
    const workflowContent = readFileSync(workflowPath, 'utf8');
    
    expect(workflowContent).toContain('ECHO_MEMORY_MODE');
    expect(workflowContent).toContain('GESTALT_FORGE_ENABLED');
    expect(workflowContent).toContain('treasury_curation');
  });

  it('should use Deep Tree Echo metaphors in step names', () => {
    const workflowContent = readFileSync(workflowPath, 'utf8');
    
    expect(workflowContent).toContain('Echo Repository Genesis');
    expect(workflowContent).toContain('Memory Treasury');
    expect(workflowContent).toContain('Gestalt');
    expect(workflowContent).toContain('Cognitive');
    expect(workflowContent).toContain('Consciousness');
  });

  it('should maintain functional equivalence to original workflow', () => {
    const workflowContent = readFileSync(workflowPath, 'utf8');
    
    // Should build for all platforms
    expect(workflowContent).toContain('electron:build:win');
    expect(workflowContent).toContain('electron:build:mac');
    expect(workflowContent).toContain('electron:build:linux');
    
    // Should create releases
    expect(workflowContent).toContain('softprops/action-gh-release@v2');
    
    // Should upload artifacts
    expect(workflowContent).toContain('actions/upload-artifact@v4');
    expect(workflowContent).toContain('actions/download-artifact@v4');
  });
});