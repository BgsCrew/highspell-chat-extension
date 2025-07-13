chrome.action.onClicked.addListener((tab) => {

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["jquery-3.7.1.slim.min.js"]
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});
