import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const binary = resolve('.tools', process.platform === 'win32' ? 'gitleaks.exe' : 'gitleaks');
const result = spawnSync(binary, ['dir', '.', '--config', '.gitleaks.toml', '--redact=100', '--no-banner', '--exit-code', '1'], { stdio: 'inherit' });
if (result.error) console.error('Gitleaks est introuvable. Exécuter npm run setup:scanner.');
process.exit(result.status ?? 1);
