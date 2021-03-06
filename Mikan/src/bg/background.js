﻿// string format repalcement from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
if (!String.prototype.format) {
    String.prototype.format = function () {
        let args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

(function () {
    function openWindow(targetUrl) {
        chrome.tabs.create({
                url: targetUrl,
            },
            function (tabInfo) {
                chrome.windows.update(tabInfo.windowId, {
                    focused: true
                });
            });
    }

    function generateMagnet(hash) {
        let trackers = [
            "http://t.acg.rip:6699/announce",
            "https://tr.bangumi.moe:9696/announce",
            "udp://tr.bangumi.moe:6969/announce",
            "http://open.acgtracker.com:1096/announce",
            "http://t.nyaatracker.com/announce",
            "http://tracker.kamigami.org:2710/announce",
            "http://share.camoe.cn:8080/announce",
            "http://opentracker.acgnx.se/announce",
            "http://anidex.moe:6969/announce",
            "udp://tracker.opentrackr.org:1337/announce",
        ];
        let magnet = "magnet:?xt=urn:btih:" + hash;
        for (i in trackers) {
            magnet += "&tr=" + encodeURIComponent(trackers[i]);
        }
        return magnet;
    }

    function getUpdate(sendResponse) {
        if (localStorage.getItem("loginStatus") === "logout") {
            if (sendResponse instanceof Function) sendResponse({
                status: "logout"
            });
        }
        $.ajax({
            url: "http://api.mikanani.me/api/Mention?count=10",
            dataType: "json",
            type: "GET",
            headers: {
                "Authorization": "MikanHash " + localStorage.getItem("hash"),
            },
            success: function (data) {
                for (i in data) {
                    data[i].FullMagnetLink = generateMagnet(data[i].MagnetLink);
                }
                localStorage.setItem("mentionDatas", JSON.stringify(data));
                let lastEpisodeId = localStorage.getItem("lastEpisodeId");
                if (lastEpisodeId == null || "" + data[0].EpisodeId !== lastEpisodeId) {
                    window.msg = data[0];
                    try {
                        chrome.notifications.create("MikanUpdate", {
                            type: "basic",
                            title: chrome.i18n.getMessage("updateNotificationTitle"),
                            message: chrome.i18n.getMessage("updateNotificationMessage")
                                .format(data[0].SubtitleGroupName, data[0].BangumiName, data[0].Name),
                            iconUrl: "http://mikanani.me" + data[0].Cover,
                            buttons: [{
                                    title: chrome.i18n.getMessage("updateNotificationButtonDownload"),
                                    iconUrl: "icons/ic_file_download_black_24dp_2x.png",
                                },
                                {
                                    title: chrome.i18n.getMessage("updateNotificationButtonDownloadTorrent"),
                                    iconUrl: "icons/ic_file_download_black_24dp_2x.png",
                                },
                            ],
                        });
                    } catch (err) {
                        try {
                            chrome.notifications.create("MikanUpdate", {
                                type: "basic",
                                title: chrome.i18n.getMessage("updateNotificationTitle"),
                                message: chrome.i18n.getMessage("updateNotificationMessage")
                                    .format(data[0].SubtitleGroupName, data[0].BangumiName, data[0].Name),
                                iconUrl: "http://mikanani.me" + data[0].Cover
                            });
                        } catch (errr) {}
                    }
                    localStorage.setItem("lastEpisodeId", "" + data[0].EpisodeId);
                }
                if (sendResponse instanceof Function) sendResponse({
                    status: "success"
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                setupHash(true);
                if (sendResponse instanceof Function) sendResponse({
                    status: "error",
                    errorThrown: errorThrown,
                    data: jqXHR.responseText
                });
            },
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
        } else if (request.type === "generateMagnet") {
            sendResponse(generateMagnet(request.hash));
        }
    });

    try {
        chrome.notifications.onClicked.addListener(function () {
            openWindow("http://mikanani.me/Home/Episode/" + window.msg.MagnetLink);
        });

        chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
            if (buttonIndex === 0) {
                openWindow(window.msg.FullMagnetLink);
            } else {
                let publishDate = moment(window.msg.PublishDate);
                publishDate = publishDate.add(8, "hours").toDate();
                openWindow("http://mikanani.me/Download/" + publishDate.getFullYear().toString() + ("0" + (publishDate.getMonth() + 1)).slice(-2) + ("0" + publishDate.getDate()).slice(-2) + "/" + window.msg.MagnetLink + ".torrent");
            }
        });
    } catch (err) {}

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
    }

    setupHash();
    getUpdate();
    setInterval(getUpdate, 600000);
})();