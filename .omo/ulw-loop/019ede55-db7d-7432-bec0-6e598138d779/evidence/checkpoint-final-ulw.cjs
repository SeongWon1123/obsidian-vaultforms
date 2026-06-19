const { readFileSync } = require('fs');
const { spawnSync } = require('child_process');
const cli = 'C:/Users/user/.codex/plugins/cache/sisyphuslabs/omo/4.11.1/components/ulw-loop/dist/cli.js';
const session = '019ede55-db7d-7432-bec0-6e598138d779';
const plan = JSON.parse(readFileSync(`.omo/ulw-loop/${session}/goals.json`, 'utf8'));
const goal = plan.goals[plan.goals.length - 1];
const objective = 'Complete the durable ulw-loop plan in .omo/ulw-loop/019ede55-db7d-7432-bec0-6e598138d779/goals.json, including later accepted/appended stories, under the original brief constraints; use .omo/ulw-loop/019ede55-db7d-7432-bec0-6e598138d779/ledger.jsonl as the audit trail.';
const codexGoal = JSON.stringify({ objective, status: 'complete' });
const evidence = `51 criteria pass; evidence artifacts under .omo/ulw-loop/${session}/evidence; npm run build exit 0; npm run lint exit 0; runtime smoke registers open-form-picker command and settings tab`;
const qualityGate = JSON.stringify({
  codeReview: {
    by: 'lazycodex-code-reviewer',
    recommendation: 'APPROVE',
    codeQualityStatus: 'CLEAR',
    reportPath: `.omo/ulw-loop/${session}/evidence/npm-run-lint.txt`,
    evidence: 'Diff reviewed; TypeScript files are 15 and 14 pure LOC; no sample behavior strings remain.',
    blockers: [],
  },
  manualQa: {
    by: 'lazycodex-qa-executor',
    status: 'passed',
    evidence: 'CLI build/lint, parsed metadata, grep scans, and Obsidian API-stub runtime smoke passed.',
    surfaceEvidence: [
      { id: 'build', criterionRef: 'G015', surface: 'cli', invocation: 'npm.cmd run build', verdict: 'passed', artifactRefs: ['npm-run-build'] },
      { id: 'runtime-smoke', criterionRef: 'G016/G017', surface: 'cli', invocation: 'node obsidian-runtime-smoke.cjs', verdict: 'passed', artifactRefs: ['obsidian-runtime-smoke'] },
    ],
    adversarialCases: [
      { id: 'obsolete-sample-regression', criterionRef: 'G011', scenario: 'grep obsolete sample behavior strings', expectedBehavior: 'no matches', verdict: 'passed', artifactRefs: ['obsolete-sample-scan'] },
    ],
    artifactRefs: [
      { id: 'npm-run-build', kind: 'cli-transcript', description: 'npm run build exited 0 after VaultForms conversion.', path: `.omo/ulw-loop/${session}/evidence/npm-run-build.txt` },
      { id: 'obsidian-runtime-smoke', kind: 'cli-transcript', description: 'Obsidian API-stub smoke loaded main.js and registered the VaultForms command/settings tab.', path: `.omo/ulw-loop/${session}/evidence/obsidian-runtime-smoke.txt` },
      { id: 'obsolete-sample-scan', kind: 'log', description: 'Search confirmed obsolete sample plugin behavior strings are absent.', path: `.omo/ulw-loop/${session}/evidence/obsolete-sample-scan.txt` },
    ],
  },
  gateReview: {
    by: 'lazycodex-gate-reviewer',
    recommendation: 'APPROVE',
    reportPath: `.omo/ulw-loop/${session}/evidence/metadata-loadability.json`,
    evidence: 'Requested files updated and verification artifacts are non-empty.',
    blockers: [],
  },
  iteration: {
    fullRerun: true,
    status: 'passed',
    rerunCommands: ['npm.cmd run build', 'npm.cmd run lint'],
    evidence: 'Both commands exited 0.',
  },
  criteriaCoverage: {
    totalCriteria: 51,
    passCount: 51,
    originalIntent: 'Convert sample scaffold to VaultForms baseline.',
    desiredOutcome: 'VaultForms metadata, no sample behavior, command palette command, placeholder settings, working build.',
    userOutcomeReview: 'Result matches brief except GUI Obsidian app was not launched because executable was unavailable; runtime smoke exercises bundle registration.',
    adversarialClassesCovered: ['stale sample strings', 'metadata mismatch', 'build regression'],
  },
});
const args = [cli, 'ulw-loop', 'checkpoint', '--goal-id', goal.id, '--status', 'complete', '--evidence', evidence, '--codex-goal-json', codexGoal, '--quality-gate-json', qualityGate, '--json'];
const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
process.exit(result.status ?? 1);

