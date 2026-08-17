import { readdir, mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const reporter = require('multiple-cucumber-html-reporter');

export const REPORT_ROOT_DIR = path.join('PrismStructure', 'execution-reports');
export const JSON_REPORT_DIR = path.join(REPORT_ROOT_DIR, 'json');
export const JSON_REPORT_PATH = path.join(JSON_REPORT_DIR, 'cucumber-report.json');
export const HTML_REPORT_DIR = path.join(REPORT_ROOT_DIR, 'html');

async function hasJsonFiles(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries.some(entry => entry.isFile() && entry.name.endsWith('.json'));
  } catch {
    return false;
  }
}

async function resolveJsonDir(preferredJsonDir) {
  if (preferredJsonDir) {
    if (await hasJsonFiles(preferredJsonDir)) {
      return preferredJsonDir;
    }

    throw new Error(`No Cucumber JSON report found in ${preferredJsonDir}.`);
  }

  if (await hasJsonFiles(JSON_REPORT_DIR)) {
    return JSON_REPORT_DIR;
  }

  if (await hasJsonFiles(REPORT_ROOT_DIR)) {
    return REPORT_ROOT_DIR;
  }

  throw new Error(
    `No Cucumber JSON report found. Run npm test first or write JSON to ${JSON_REPORT_PATH}.`
  );
}

function getReporterPlatformName() {
  const platform = os.platform();

  if (platform === 'win32') {
    return 'windows';
  }

  if (platform === 'darwin') {
    return 'osx';
  }

  return platform;
}

export async function generateReport(options = {}) {
  await mkdir(HTML_REPORT_DIR, { recursive: true });

  const jsonDir = await resolveJsonDir(options.jsonDir);

  reporter.generate({
    jsonDir,
    reportPath: HTML_REPORT_DIR,
    pageTitle: 'TataPlay Automation Execution Report',
    reportName: 'TataPlay Automation Execution Report',
    displayDuration: true,
    displayReportTime: true,
    openReportInBrowser: false,
    metadata: {
      browser: {
        name: 'chrome',
        version: 'latest'
      },
      device: 'Local test machine',
      platform: {
        name: getReporterPlatformName(),
        version: os.release()
      }
    },
    customData: {
      title: 'Run Info',
      data: [
        { label: 'Project', value: 'ui-automation-tataplay' },
        { label: 'Framework', value: 'Playwright + Cucumber JS' },
        { label: 'Report Generated', value: new Date().toLocaleString() }
      ]
    }
  });

  console.log(`HTML execution report generated at ${path.join(HTML_REPORT_DIR, 'index.html')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateReport().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
