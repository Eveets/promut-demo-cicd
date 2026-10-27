import { mkdir, mkdtemp, readFile, writeFile, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const version = '8.30.1';
const os = { win32: 'windows', linux: 'linux', darwin: 'darwin' }[process.platform];
const arch = { x64: 'x64', arm64: 'arm64' }[process.arch];
if (!os || !arch) throw new Error('Plateforme non prise en charge pour cette démonstration.');
const extension = os === 'windows' ? 'zip' : 'tar.gz';
const archive = `gitleaks_${version}_${os}_${arch}.${extension}`;
const base = `https://github.com/gitleaks/gitleaks/releases/download/v${version}`;
const target = resolve('.tools');
const binary = join(target, os === 'windows' ? 'gitleaks.exe' : 'gitleaks');
const temporary = await mkdtemp(join(tmpdir(), 'boreale-gitleaks-'));
async function download(name) {
  const response = await fetch(`${base}/${name}`);
  if (!response.ok) throw new Error(`Téléchargement impossible : HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}
try {
  const [bytes, sums] = await Promise.all([download(archive), download(`gitleaks_${version}_checksums.txt`)]);
  const line = sums.toString('utf8').split('\n').find((entry) => entry.trim().endsWith(` ${archive}`));
  const expected = line?.trim().split(/\s+/)[0];
  if (!expected || createHash('sha256').update(bytes).digest('hex') !== expected) {
    throw new Error('La somme SHA-256 de Gitleaks ne correspond pas.');
  }
  const path = join(temporary, archive);
  await writeFile(path, bytes);
  await mkdir(target, { recursive: true });
  if (os === 'windows') {
    const literal = (value) => `'${value.replaceAll("'", "''")}'`;
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `Expand-Archive -LiteralPath ${literal(path)} -DestinationPath ${literal(target)} -Force`], { stdio: 'inherit' });
  } else {
    execFileSync('tar', ['-xzf', path, '-C', target, 'gitleaks'], { stdio: 'inherit' });
    await chmod(binary, 0o755);
  }
  await readFile(binary);
  const actual = execFileSync(binary, ['version'], { encoding: 'utf8' }).trim();
  if (actual !== version) throw new Error(`Version inattendue : ${actual}`);
  console.log(`Gitleaks ${version} installé; somme SHA-256 vérifiée.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
