import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const apiDir = path.join(root, 'app', 'api');
const backupDir = path.join(os.tmpdir(), 'critical-dummy-api-pages-backup');
const outDir = path.join(root, 'out');
const nextDir = path.join(root, '.next');

if (fs.existsSync(backupDir)) {
  fs.rmSync(backupDir, { recursive: true, force: true });
}

const hadApiDir = fs.existsSync(apiDir);

try {
  if (hadApiDir) {
    fs.cpSync(apiDir, backupDir, { recursive: true });
    fs.rmSync(apiDir, { recursive: true, force: true });
  }

  // Clear stale Next type/build artifacts referencing /api/github before static export.
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
  }

  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      STATIC_EXPORT: 'true',
      NEXT_PUBLIC_STATIC_EXPORT: 'true',
    },
  });

  if (fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
  }
} finally {
  if (hadApiDir && fs.existsSync(backupDir) && !fs.existsSync(apiDir)) {
    fs.cpSync(backupDir, apiDir, { recursive: true });
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
}
