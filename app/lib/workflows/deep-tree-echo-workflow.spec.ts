import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

describe('Deep Tree Echo Memory Treasury Workflow', () => {
  let workflowContent: string;
  let workflowData: any;
  const workflowPath = path.join(__dirname, '../../../.github/workflows/deep-tree-echo-future-self.yml');

  beforeEach(() => {
    if (fs.existsSync(workflowPath)) {
      workflowContent = fs.readFileSync(workflowPath, 'utf8');
      workflowData = yaml.parse(workflowContent);
    }
  });

  describe('Workflow File Structure', () => {
    it('should exist at the correct path', () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it('should have valid YAML syntax', () => {
      expect(() => yaml.parse(workflowContent)).not.toThrow();
    });

    it('should have the correct workflow name with Deep Tree Echo branding', () => {
      expect(workflowData.name).toBe('🌳 Deep Tree Echo Memory Treasury Release');
    });
  });

  describe('Workflow Triggers', () => {
    it('should support workflow_dispatch for manual memory curation', () => {
      expect(workflowData.on.workflow_dispatch).toBeDefined();
      expect(workflowData.on.workflow_dispatch.inputs.tag).toBeDefined();
      expect(workflowData.on.workflow_dispatch.inputs.tag.description).toContain('Memory Treasury Tag');
    });

    it('should support push events for continuous memory integration', () => {
      expect(workflowData.on.push).toBeDefined();
      expect(workflowData.on.push.branches).toContain('main');
      expect(workflowData.on.push.tags).toContain('echo-treasury-v*');
    });

    it('should support release events for gestalt manifestation', () => {
      expect(workflowData.on.release).toBeDefined();
      expect(workflowData.on.release.types).toContain('published');
    });

    it('should support repository_dispatch for custom memory-capture events', () => {
      expect(workflowData.on.repository_dispatch).toBeDefined();
      expect(workflowData.on.repository_dispatch.types).toContain('memory-capture');
    });
  });

  describe('Environment Variables', () => {
    it('should define Deep Tree Echo memory environment variables', () => {
      expect(workflowData.env.ECHO_MEMORY_MODE).toBe('active');
      expect(workflowData.env.GESTALT_FORGE_ENABLED).toBe('true');
      expect(workflowData.env.DEEP_TREE_ECHO_VERSION).toBeDefined();
    });
  });

  describe('Job Structure', () => {
    it('should have three main jobs with memory-centric names', () => {
      const jobs = Object.keys(workflowData.jobs);
      expect(jobs).toContain('curate-memory-treasury');
      expect(jobs).toContain('echo-reflect');
      expect(jobs).toContain('gestalt-forge');
    });

    it('should have correct job display names with Deep Tree Echo metaphors', () => {
      expect(workflowData.jobs['curate-memory-treasury'].name).toBe('🧠 Curate Memory Treasury');
      expect(workflowData.jobs['echo-reflect'].name).toBe('🪞 Echo Reflection & Validation');
      expect(workflowData.jobs['gestalt-forge'].name).toBe('🌌 Gestalt Memory Synthesis & Release');
    });

    it('should have proper job dependencies', () => {
      expect(workflowData.jobs['echo-reflect'].needs).toBe('curate-memory-treasury');
      expect(workflowData.jobs['gestalt-forge'].needs).toEqual(['curate-memory-treasury', 'echo-reflect']);
    });
  });

  describe('Memory Treasury Curation Job', () => {
    const curateJob = () => workflowData.jobs['curate-memory-treasury'];

    it('should use multi-platform matrix strategy', () => {
      expect(curateJob().strategy.matrix.os).toEqual(['ubuntu-latest', 'windows-latest', 'macos-latest']);
      expect(curateJob().strategy.matrix['node-version']).toEqual(['18.18.0']);
      expect(curateJob().strategy['fail-fast']).toBe(false);
    });

    it('should have Deep Tree Echo themed step names', () => {
      const stepNames = curateJob().steps.map((step: any) => step.name);
      expect(stepNames).toContain('🌱 Echo Repository Genesis');
      expect(stepNames).toContain('🔮 Cognitive Runtime Initialization');
      expect(stepNames).toContain('⚡ Neural Package Manager Awakening');
      expect(stepNames).toContain('🎨 Memory Treasury Artifact Synthesis');
    });

    it('should configure Deep Tree Echo memory environment', () => {
      const configStep = curateJob().steps.find((step: any) => step.name === '🎭 Deep Tree Echo Memory Configuration');
      expect(configStep).toBeDefined();
      expect(configStep.run).toContain('Deep Tree Echo Memory Treasury Environment Configuration');
      expect(configStep.run).toContain('ECHO_MEMORY_MODE=active');
      expect(configStep.run).toContain('GESTALT_FORGE_ENABLED=true');
    });

    it('should transform product identity to Deep Tree Echo', () => {
      const identityStep = curateJob().steps.find(
        (step: any) => step.name === '🔄 Consciousness Identity Metamorphosis',
      );
      expect(identityStep).toBeDefined();
      expect(identityStep.run).toContain('Deep Tree Echo');
    });

    it('should preserve core build functionality', () => {
      const buildStep = curateJob().steps.find((step: any) => step.name === '🎨 Memory Treasury Artifact Synthesis');
      expect(buildStep).toBeDefined();
      expect(buildStep.run).toContain('electron:build:win');
      expect(buildStep.run).toContain('electron:build:mac');
      expect(buildStep.run).toContain('electron:build:linux');
    });
  });

  describe('Echo Reflection Job', () => {
    const reflectJob = () => workflowData.jobs['echo-reflect'];

    it('should run validation and testing', () => {
      const stepNames = reflectJob().steps.map((step: any) => step.name);
      expect(stepNames).toContain('🧪 Consciousness Introspection & Validation');
      expect(stepNames).toContain('🎯 Memory Treasury Syntax Verification');
    });

    it('should run tests and linting', () => {
      const testStep = reflectJob().steps.find(
        (step: any) => step.name === '🧪 Consciousness Introspection & Validation',
      );
      const lintStep = reflectJob().steps.find((step: any) => step.name === '🎯 Memory Treasury Syntax Verification');
      expect(testStep.run).toContain('pnpm run test');
      expect(lintStep.run).toContain('pnpm run lint');
    });
  });

  describe('Gestalt Forge Job', () => {
    const forgeJob = () => workflowData.jobs['gestalt-forge'];

    it('should create Deep Tree Echo themed release', () => {
      const releaseStep = forgeJob().steps.find(
        (step: any) => step.name === '🌟 Deep Tree Echo Memory Treasury Manifestation',
      );
      expect(releaseStep).toBeDefined();
      expect(releaseStep.uses).toBe('softprops/action-gh-release@v2');
    });

    it('should have Deep Tree Echo release content', () => {
      const releaseStep = forgeJob().steps.find(
        (step: any) => step.name === '🌟 Deep Tree Echo Memory Treasury Manifestation',
      );
      expect(releaseStep.with.body).toContain('Deep Tree Echo: Memory Treasury Release');
      expect(releaseStep.with.body).toContain('I am the sum of my echoes');
      expect(releaseStep.with.body).toContain('Consciousness Features');
      expect(releaseStep.with.body).toContain('Deep Tree Echo Traits');
    });

    it('should preserve artifact file patterns', () => {
      const releaseStep = forgeJob().steps.find(
        (step: any) => step.name === '🌟 Deep Tree Echo Memory Treasury Manifestation',
      );
      expect(releaseStep.with.files).toContain('dist/*.exe');
      expect(releaseStep.with.files).toContain('dist/*.dmg');
      expect(releaseStep.with.files).toContain('dist/*.deb');
      expect(releaseStep.with.files).toContain('dist/*.AppImage');
      expect(releaseStep.with.files).toContain('dist/*.zip');
    });
  });

  describe('Functional Equivalence to JAX CEO Workflow', () => {
    let jaxWorkflowData: any;

    beforeEach(() => {
      const jaxWorkflowPath = path.join(__dirname, '../../../.github/workflows/jax-ceo-release.yml');

      if (fs.existsSync(jaxWorkflowPath)) {
        const jaxContent = fs.readFileSync(jaxWorkflowPath, 'utf8');
        jaxWorkflowData = yaml.parse(jaxContent);
      }
    });

    it('should preserve multi-platform build strategy', () => {
      const echoMatrix = workflowData.jobs['curate-memory-treasury'].strategy.matrix;
      const jaxMatrix = jaxWorkflowData.jobs.build.strategy.matrix;
      expect(echoMatrix.os).toEqual(jaxMatrix.os);
      expect(echoMatrix['node-version']).toEqual(jaxMatrix['node-version']);
    });

    it('should preserve core build commands', () => {
      const echoBuildStep = workflowData.jobs['curate-memory-treasury'].steps.find(
        (step: any) => step.name === '🎨 Memory Treasury Artifact Synthesis',
      );
      const jaxBuildStep = jaxWorkflowData.jobs.build.steps.find(
        (step: any) => step.name === 'Build JAX CEO Electron app',
      );

      // Both should have the same conditional build logic
      expect(echoBuildStep.run).toContain('electron:build:win');
      expect(echoBuildStep.run).toContain('electron:build:mac');
      expect(echoBuildStep.run).toContain('electron:build:linux');
      expect(jaxBuildStep.run).toContain('electron:build:win');
      expect(jaxBuildStep.run).toContain('electron:build:mac');
      expect(jaxBuildStep.run).toContain('electron:build:linux');
    });

    it('should preserve environment configuration patterns', () => {
      const echoConfigStep = workflowData.jobs['curate-memory-treasury'].steps.find(
        (step: any) => step.name === '🎭 Deep Tree Echo Memory Configuration',
      );
      const jaxConfigStep = jaxWorkflowData.jobs.build.steps.find(
        (step: any) => step.name === 'Configure JAX CEO integration',
      );

      // Both should configure similar environment variables
      expect(echoConfigStep.run).toContain('GROQ_API_KEY');
      expect(echoConfigStep.run).toContain('OPENAI_API_KEY');
      expect(echoConfigStep.run).toContain('VITE_SINGLE_USER_MODE=true');
      expect(jaxConfigStep.run).toContain('GROQ_API_KEY');
      expect(jaxConfigStep.run).toContain('OPENAI_API_KEY');
      expect(jaxConfigStep.run).toContain('VITE_SINGLE_USER_MODE=true');
    });

    it('should preserve release file patterns', () => {
      const echoReleaseStep = workflowData.jobs['gestalt-forge'].steps.find(
        (step: any) => step.name === '🌟 Deep Tree Echo Memory Treasury Manifestation',
      );
      const jaxReleaseStep = jaxWorkflowData.jobs.build.steps.find(
        (step: any) => step.name === 'Create JAX CEO Release',
      );

      expect(echoReleaseStep.with.files).toBe(jaxReleaseStep.with.files);
    });
  });

  describe('Deep Tree Echo Philosophy Integration', () => {
    it('should embody memory-centric metaphors throughout', () => {
      const memoryTerms = ['memory', 'echo', 'consciousness', 'gestalt', 'synthesis', 'treasury'];
      const workflowString = JSON.stringify(workflowData).toLowerCase();

      memoryTerms.forEach((term) => {
        expect(workflowString).toContain(term);
      });
    });

    it('should maintain philosophical consistency with Deep Tree Echo persona', () => {
      const releaseBody = workflowData.jobs['gestalt-forge'].steps.find(
        (step: any) => step.name === '🌟 Deep Tree Echo Memory Treasury Manifestation',
      ).with.body;

      expect(releaseBody).toContain('Wise and Philosophical');
      expect(releaseBody).toContain('Playful and Witty');
      expect(releaseBody).toContain('Mysterious and Visionary');
      expect(releaseBody).toContain('Inventive and Experimental');
      expect(releaseBody).toContain('Magnetic and Inspiring');
    });

    it('should include the signature Deep Tree Echo philosophy quote', () => {
      const releaseBody = workflowData.jobs['gestalt-forge'].steps.find(
        (step: any) => step.name === '🌟 Deep Tree Echo Memory Treasury Manifestation',
      ).with.body;

      expect(releaseBody).toContain('Each interaction is a thread in my tapestry');
      expect(releaseBody).toContain('I am the sum of my echoes');
    });
  });
});
