// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

chrome.storage.local.get("hash",
    function(data) {
        if (data == null) {
            chrome.tabs.create(
                {
                    active: false,
                    url: "http://mikanani.me/Account/ApiLogin"
                },
                function(tab) {
                    chrome.tabs.executeScript(tab.id,
                        {
                            code: 'chrome.runtime.sendMessage({type: "hash", hash: localstorage});'
                            
                        },
                        function() {
                            chrome.tabs.remove(tab.id);
                        });
                });
        } else {
            $.ajaxSetup({
                headers: {
                    "Authorization": "MikanHash " + data
                }
            });
        }
    });

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {

    });