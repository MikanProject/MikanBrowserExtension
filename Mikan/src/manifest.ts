import type { Manifest } from 'webextension-polyfill';
import fs from 'fs/promises';
import type PkgType from '../package.json';

async function getManifest() {
  const pkg = JSON.parse(await fs.readFile('package.json', 'utf-8')) as typeof PkgType;

  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: 'Mikan',
    version: pkg.version,
    description: 'Enhance your mikanani.me experience',
    homepage_url: 'https://mikanani.me',
    browser_action: {
      default_icon: './assets/icon128.png',
      default_popup: './src/popup/index.html',
    },
    background: {
      page: './src/background/index.html',
      persistent: true,
    },
    icons: {
      16: './assets/icon16.png',
      32: './assets/icon32.png',
      48: './assets/icon48.png',
      128: './assets/icon128.png',
    },
    permissions: ['http://*.mikanani.me/', 'http://mikanani.me/', 'https://*.mikanani.me/', 'https://mikanani.me/'],
  };

  return manifest;
}

async function main() {
  const manifest = await getManifest();
  await fs.writeFile('dist/manifest.json', JSON.stringify(manifest, null, 2));
}

void main();
