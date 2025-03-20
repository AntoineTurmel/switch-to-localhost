async function getLocalhostConfig() {
  const { protocol, host, port } = await browser.storage.local.get(['protocol', 'host', 'port']);
  return {
    protocol: protocol || 'http',
    host: host || 'localhost',
    port: port || 3000
  };
}

async function openInLocalhost(url, tabId = null, newTab = false) {
  const config = await getLocalhostConfig();
  const modifiedUrl = new URL(url);

  modifiedUrl.protocol = config.protocol;
  modifiedUrl.host = config.host;
  modifiedUrl.port = config.port;

  if (newTab) {
    browser.tabs.create({ url: modifiedUrl.href });
  } else {
    browser.tabs.update(tabId, { url: modifiedUrl.href });
  }
}

browser.browserAction.onClicked.addListener(async function (tab) {
  await openInLocalhost(tab.url, tab.id);
});

chrome.contextMenus.create({
  id: "openInLocal",
  title: "Switch to localhost",
  contexts: ["link"]
});

chrome.contextMenus.onClicked.addListener(async function(info, tab) {
  if (info.menuItemId === "openInLocal") {
    await openInLocalhost(info.linkUrl, null, true);
  }
});
