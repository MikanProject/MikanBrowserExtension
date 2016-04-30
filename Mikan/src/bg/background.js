// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

window.msg = {};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "hash") {
        if (typeof request.hash == "string") {
            chrome.storage.local.set({ "hash": request.hash },
                function() {
                    setupHash();
                });
        }
    }
});

setupHash();

function setupHash(forceRefresh) {
    chrome.storage.local.get("hash",
        function(data) {
            if (forceRefresh || data.hash == undefined) {
                /* error */
                chrome.tabs.create(
                    {
                        active: false,
                        url: "http://mikanani.me/Account/ApiLogin"
                    },
                    function(tab) {
                        chrome.tabs.executeScript(tab.id,
                            {
                                code:
                                    'chrome.runtime.sendMessage({type: "hash", hash: localStorage.getItem("apihash")});'
                            },
                            function() {
                                chrome.tabs.remove(tab.id);
                            });
                    });
            } else {
                $.ajaxSetup({
                    headers: {
                        "Authorization": "MikanHash " + data.hash
                    }
                });
            }
        });
}

function getUpdate() {
    chrome.storage.local.get("hash",
        function(data) {
            if (data.hash == undefined) {
                return;
            }
        });
    $.ajax({
        url: "http://api.mikanani.me/api/Mention",
        dataType: "json",
        type: "GET",
        success: function(data) {
            chrome.storage.local.get("lastEpisodeId",
                function(storageData) {
                    if (storageData.lastEpisodeId == undefined || data[0].EpisodeId !== storageData.lastEpisodeId) {
                        window.msg[data[0].EpisodeId] = data[0];
                        chrome.notifications.create(window.msg.length,
                            {
                                type: "basic",
                                title: "蜜柑酱发现了新番更新",
                                message: data[0].SubtitleGroupName + "的" + data[0].BangumiName + "更新了！\n" + data[0].Name,
                                iconUrl: "http://mikanani.me" + data[0].Cover
                            },
                            function() {
                                console.log(window.msg[data[0].EpisodeId]);
                            });
                        chrome.storage.local.set({ "lastEpisodeId": data.EpisodeId });
                    }
                });
        },
        error: function() {
            setupHash(true);
        }
    });
}

setInterval(getUpdate, 60000);