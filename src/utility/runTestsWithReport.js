import { spawn } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import {
  generateReport,
  JSON_REPORT_DIR,
  JSON_REPORT_PATH
} from './ReportGenerator.js';

const cucumberBin = path.join(
  process.cwd(),
  'node_modules',
  '@cucumber',
  'cucumber',
  'bin',
  'cucumber.js'
);

function runCucumber(extraArgs) {
  const cucumberArgs = [
    cucumberBin,
    'src/feature/**/*.feature',
    '--import',
    'src/steps/**/*.js',
    '--import',
    'src/hooks/**/*.js',
    '--format',
    'progress',
    '--format',
    `json:${JSON_REPORT_PATH}`,
    ...extraArgs
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, cucumberArgs, {
      shell: false,
      stdio: 'inherit'
    });

    child.on('error', reject);
    child.on('close', code => resolve(code ?? 1));
  });
}

async function main() {
  await rm(JSON_REPORT_DIR, { recursive: true, force: true });
  await mkdir(JSON_REPORT_DIR, { recursive: true });

  const cucumberExitCode = await runCucumber(process.argv.slice(2));

  try {
    await generateReport({ jsonDir: JSON_REPORT_DIR });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = cucumberExitCode || 1;
    return;
  }

  process.exitCode = cucumberExitCode;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
