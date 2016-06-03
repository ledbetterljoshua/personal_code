chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    chrome.tabs.executeScript(null, {file: "app.js"});
  });
});

