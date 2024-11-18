console.log('Popup script loaded');

// Elements
const statusDiv = document.getElementById('status-main');
const subStatusDiv = document.getElementById('status-subtext');
const proxyListDiv = document.getElementById('proxyList');

// Functions
const updateStatus = (mainText, subText) => {
  statusDiv.innerText = mainText;
  subStatusDiv.innerText = subText;
};

const displayProxies = (proxies) => {
  proxyListDiv.innerHTML = '';
  proxies.forEach((proxy, index) => {
    const proxyElement = document.createElement('div');
    proxyElement.innerText = `${index + 1}. ${proxy.host}:${proxy.port}`;
    proxyElement.classList.add('proxy-item');
    proxyListDiv.appendChild(proxyElement);
  });
};

// Update the current proxy in the status box
const updateCurrentProxy = () => {
  chrome.runtime.sendMessage({ action: 'getCurrentProxy' }, (response) => {
    if (response.proxy) {
      const { host, port } = response.proxy;
      updateStatus('Connected to Proxy:', `${host}:${port}`);
    } else {
      updateStatus('No Proxy Connected', 'Please start a proxy.');
    }
  });
};

// Restore proxies and status on popup load
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['proxies'], (data) => {
    if (data.proxies && data.proxies.length > 0) {
      displayProxies(data.proxies);
      updateStatus('Proxy list loaded.', `${data.proxies.length} proxies available.`);
    } else {
      updateStatus('No proxies available.', 'Please fetch or load a default proxy list.');
    }
    updateCurrentProxy();
  });
});

// Fetch latest proxies
document.getElementById('scrapeProxies').addEventListener('click', async () => {
  updateStatus('Fetching latest proxy list...', 'Please wait.');

  try {
    const response = await fetch(
      'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch proxy list');
    }

    const data = await response.text();
    const proxies = data.split('\n').filter(line => line.trim()).map(line => {
      const [host, port] = line.split(':');
      return { host, port: parseInt(port) };
    });

    chrome.storage.local.set({ proxies }, () => {
      displayProxies(proxies);
      updateStatus('Latest proxy list loaded.', `${proxies.length} proxies available.`);
    });
  } catch (error) {
    console.error('Error fetching proxies:', error);
    updateStatus('Error', 'Failed to fetch latest proxy list.');
  }
});

// Start Proxy
document.getElementById('startProxy').addEventListener('click', () => {
  chrome.storage.local.get(['proxies'], (data) => {
    if (!data.proxies || data.proxies.length === 0) {
      updateStatus('No proxies available.', 'Please fetch a proxy list first.');
      return;
    }

    const randomProxy = data.proxies[Math.floor(Math.random() * data.proxies.length)];
    chrome.runtime.sendMessage({ action: 'startProxy', proxy: randomProxy }, (response) => {
      if (response.error) {
        updateStatus('Failed to connect.', response.error);
      } else {
        const { host, port } = response.proxy;
        updateStatus('Connected to Proxy:', `${host}:${port}`);
      }
    });
  });
});

// Disconnect Proxy
document.getElementById('disconnectProxy').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'disconnectProxy' }, (response) => {
    if (response.status === 'disconnected') {
      updateStatus('No Proxy Connected', 'Disconnected successfully.');
    }
  });
});
