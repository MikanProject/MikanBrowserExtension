// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

chrome.tabs.create({
    active: false,
    url: 'http://stackoveflow.com/robots.txt'
}, function(tab) {
    chrome.tabs.executeScript(tab.id, {
        code: 'localStorage.setItem("key", "value");'
    }, function() {
        chrome.tabs.remove(tab.id);
    });
});

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });