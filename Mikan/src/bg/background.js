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
    } else if (request.type === "refresh") {
        getUpdate(sendResponse);
        return true;
    }
});

chrome.notifications.onClicked.addListener(function () {
    openWindow("http://mikanani.me/Home/Episode/" + window.msg.MagnetLink);
});

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
    if (buttonIndex === 0) {
        openWindow("magnet:?xt=urn:btih:" + window.msg.MagnetLink);
    } else {
        openWindow("http://dl.mikanani.me/file/" + new Date(window.msg.PublishDate).getFullYear().toString() + ("0" + (new Date(window.msg.PublishDate).getMonth() + 1)).slice(-2) + ("0" + new Date(window.msg.PublishDate).getDate()).slice(-2) + "/?" + window.msg.MagnetLink + ".torrent");
    }
});

function setupHash(forceRefresh) {
    if (forceRefresh || localStorage.getItem("hash") == null) {
        $.ajax({
            url: "http://mikanani.me/Account/ApiLogin",
            dataType: "json",
            type: "GET",
            success: function (data) {
                localStorage.setItem("hash", data.Message);
                $.ajaxSetup({
                    headers: {
                        "Authorization": "MikanHash " + localStorage.getItem("hash"),
                    },
                });
            },
        });
    }
    $.ajaxSetup({
        headers: {
            "Authorization": "MikanHash " + localStorage.getItem("hash"),
        },
    });
}

function getUpdate(sendResponse) {
    if (localStorage.getItem("loginStatus") === "logout") {
        if (sendResponse instanceof Function) sendResponse({ status: "logout" });
    }
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
                            },
                            {
                                title: chrome.i18n.getMessage("updateNotificationButtonDownloadTorrent"),
                                iconUrl: "icons/ic_file_download_black_24dp_2x.png",
                            },
                        ],
                    });
                localStorage.setItem("lastEpisodeId", "" + data[0].EpisodeId);
            }
            if (sendResponse instanceof Function) sendResponse({ status: "success" });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            setupHash(true);
            if (sendResponse instanceof Function) sendResponse({ status: "error", errorThrown: errorThrown, data: jqXHR.responseText });
        },
    });
}

setupHash();
getUpdate();
setInterval(getUpdate, 600000);