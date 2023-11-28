// // background.js
let maxChars = 100; // Set the maximum number of characters

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    // let tabsByWindow = tabs.reduce((acc, tab) => {
    //   // Group tabs by windowId
    //   if (!acc[tab.windowId]) {
    //     acc[tab.windowId] = [];
    //   }
    //   let trimmedTitle = tab.title.length > maxChars ? tab.title.substring(0, maxChars) + "..." : tab.title;
    //   acc[tab.windowId].push({ title: encodeURIComponent(trimmedTitle), url: encodeURIComponent(tab.url), windowId: encodeURIComponent(tab.windowId) }); 
    //   return acc;
    // }, {});

    let tabsByWindow = tabs.reduce((acc, tab) => {
      if (!acc[tab.windowId]) {
        acc[tab.windowId] = { tabs: [], windowId: tab.windowId };
      }
      let trimmedTitle = tab.title.length > maxChars ? tab.title.substring(0, maxChars) + "..." : tab.title;
      acc[tab.windowId].tabs.push({ title: encodeURIComponent(trimmedTitle), url: encodeURIComponent(tab.url) });
      return acc;
    }, {});

    let window = 1;

    let tabData = Object.keys(tabsByWindow).map(windowId => {
      // let titles = tabsByWindow[windowId].join('\n');
      let links = tabsByWindow[windowId].tabs.map(tabInfo => `<a href="${decodeURIComponent(tabInfo.url)}" target="_blank">${decodeURIComponent(tabInfo.title)}</a>`).join('<br>');
      let closeAllButton = `<button class='close-all' data-window='${tabsByWindow[windowId].windowId}'>Close All</button>`;
      // let res = `Window ${window}:\n${links}`;
      // let res = `Window ${window}:\n${links}\n${closeAllButton}`;
      let res = `Window ${window}:\n${links}\n${closeAllButton}`;
      window += 1;
      return res;
    }).join('\n\n');

    // chrome.tabs.create({ url: "data:text/plain," + encodeURIComponent(tabData) });

    chrome.storage.local.set({ tabData: tabData }, () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("tabs.html") });
    });

  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "closeTabs") {
    chrome.tabs.query({ windowId: request.windowId }, (tabs) => {
      let tabIds = tabs.map(tab => tab.id);
      chrome.tabs.remove(tabIds);
    });
  }
});


