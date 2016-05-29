// string format repalcement from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
// First, checks if it isn't implemented yet.

if (!String.prototype.format) {
    String.prototype.format = function () {
        let args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

function openWindow(targetUrl) {
    chrome.tabs.create({
        url: targetUrl,
    },
        function (tabInfo) {
            chrome.windows.update(tabInfo.windowId, { focused: true });
        });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "loginStatus") {
        if (request.loginStatus === "login") {
            localStorage.setItem("loginStatus", "login");
            setupHash();
        } else {
            localStorage.setItem("loginStatus", "logout");
            localStorage.setItem("hash", null);
        }
    } else if (request.type === "openWindow") {
        openWindow(request.targetUrl);
    }
});

chrome.notifications.onClicked.addListener(function () {
    openWindow("http://mikanani.me/Home/Bangumi/" + window.msg.BangumiId + "#" + window.msg.SubtitleGroupId);
});

chrome.notifications.onButtonClicked.addListener(function () {
    openWindow("magnet:?xt=urn:btih:" + window.msg.MagnetLink);
});

function setupHash(forceRefresh) {
    if (forceRefresh || localStorage.getItem("hash") == null) {
        $.ajax({
            url: "http://mikanani.me/Account/ApiLogin",
            dataType: "json",
            type: "GET",
            success: function (data) {
                localStorage.setItem("hash", data.Message);
            },
        });
    }
    $.ajaxSetup({
        headers: {
            "Authorization": "MikanHash " + localStorage.getItem("hash")
        },
    });
}

function getUpdate() {
    if (localStorage.getItem("loginStatus") === "logout") return;
    $.ajax({
        url: "http://api.mikanani.me/api/Mention?count=10",
        dataType: "json",
        type: "GET",
        success: function (data) {
            localStorage.setItem("mentionDatas", JSON.stringify(data));
            let lastEpisodeId = localStorage.getItem("lastEpisodeId");
            if (lastEpisodeId == null || "" + data[0].EpisodeId !== lastEpisodeId) {
                window.msg = data[0];
                chrome.notifications.create("MikanUpdate",
                    {
                        type: "basic",
                        title: chrome.i18n.getMessage("updateNotificationTitle"),
                        message: chrome.i18n.getMessage("updateNotificationMessage")
                            .format(data[0].SubtitleGroupName, data[0].BangumiName, data[0].Name),
                        iconUrl: "http://mikanani.me" + data[0].Cover,
                        buttons: [
                            {
                                title: chrome.i18n.getMessage("updateNotificationButtonDownload"),
                                iconUrl: "icons/ic_file_download_black_24dp_2x.png",
                            }, /*,
                            {
                                title: chrome.i18n.getMessage("updateNotificationButtonCopy"),
                                iconUrl: "icons/ic_content_copy_black_24dp_2x.png",
                            }*/
                        ],
                    });
                localStorage.setItem("lastEpisodeId", "" + data[0].EpisodeId);
            }
        },
        error: function () {
            setupHash(true);
        },
    });
}

setupHash();
getUpdate();
setInterval(getUpdate, 600000);