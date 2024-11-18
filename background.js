let currentProxy = null;

// Apply proxy settings
const applyProxy = (proxy) => {
  const proxyConfig = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: 'http',
        host: proxy.host,
        port: proxy.port,
      },
      bypassList: [],
    },
  };

  chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, () => {
    console.log(`Proxy applied: ${proxy.host}:${proxy.port}`);
    currentProxy = proxy;
  });
};

// Disconnect proxy
const disconnectProxy = () => {
  currentProxy = null;
  chrome.proxy.settings.clear({ scope: 'regular' }, () => {
    console.log('Proxy disconnected.');
  });
};

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startProxy') {
    const proxy = message.proxy;
    if (!proxy) {
      sendResponse({ error: 'No proxy provided.' });
      return;
    }
    applyProxy(proxy);
    sendResponse({ status: 'connected', proxy });
  }

  if (message.action === 'disconnectProxy') {
    disconnectProxy();
    sendResponse({ status: 'disconnected' });
  }

  if (message.action === 'getCurrentProxy') {
    sendResponse({ proxy: currentProxy });
  }

  return true;
});
