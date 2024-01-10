import browser from 'webextension-polyfill';
import { onMessage } from 'webext-bridge/background';
import { Episode } from '../types/episode';

async function openWindow(targetUrl: string) {
  const tabInfo = await browser.tabs.create({
    url: targetUrl,
  });
  if (tabInfo.windowId) {
    await browser.windows.update(tabInfo.windowId, {
      focused: true,
    });
  }
}

function generateMagnet(hash: string) {
  const trackers = [
    'http://t.acg.rip:6699/announce',
    'https://tr.bangumi.moe:9696/announce',
    'udp://tr.bangumi.moe:6969/announce',
    'http://open.acgtracker.com:1096/announce',
    'http://t.nyaatracker.com/announce',
    'http://tracker.kamigami.org:2710/announce',
    'http://share.camoe.cn:8080/announce',
    'http://opentracker.acgnx.se/announce',
    'http://anidex.moe:6969/announce',
    'udp://tracker.opentrackr.org:1337/announce',
  ];
  let magnet = `magnet:?xt=urn:btih:${hash}`;
  magnet += trackers.map((tracker) => `&tr=${encodeURIComponent(tracker)}`).join('');
  return magnet;
}

async function setupHash(forceRefresh?: boolean) {
  if (forceRefresh || (localStorage.getItem('hash') ?? '') === '') {
    try {
      const response = await fetch('https://mikanani.me/Account/ApiLogin');
      const { Message: hash } = (await response.json()) as { Message: string };
      localStorage.setItem('hash', hash);
    } catch (error) {
      console.error(error);
      localStorage.setItem('hash', '');
      throw new Error('Failed to login');
    }
  }
}

async function getUpdate() {
  try {
    if ((localStorage.getItem('hash') ?? '') === '') await setupHash();
    const response = await fetch('https://api.mikanani.me/api/Mention?count=10', {
      headers: { Authorization: `MikanHash ${localStorage.getItem('hash')}` },
    });
    let data = (await response.json()) as Episode[];
    data = data.map((t) => ({ ...t, FullMagnetLink: generateMagnet(t.MagnetLink) }));
    localStorage.setItem('mentionDatas', JSON.stringify(data));
    return { status: 'success' };
  } catch (error) {
    if (error instanceof Error) {
      return { status: 'error', error: error.message };
    }
    return { status: 'error' };
  }
}

onMessage('openWindow', async ({ data }) => {
  const { targetUrl } = data;
  await openWindow(targetUrl);
});

onMessage('refresh', async () => {
  const result = await getUpdate();
  return result;
});

onMessage('generateMagnet', ({ data }) => {
  const { hash } = data;
  return generateMagnet(hash);
});

void (async () => {
  try {
    await setupHash();
    await getUpdate();
    setInterval(() => void getUpdate(), 600000);
  } catch (error) {
    console.error(error);
  }
})();
