// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// string format repalcement from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}

/*chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "hash") {
        if (typeof request.hash == "string") {
            chrome.storage.local.set({ "hash": request.hash },
                function() {
                    setupHash();
                });
        }
    }
});*/

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttionIndex) {
    chrome.tabs.create({
        url: "magnet:?xt=urn:btih:" + window.msg.MagnetLink
    });
});

setupHash();

function setupHash(forceRefresh) {
    if (forceRefresh || localStorage.getItem("hash") == null) {
        $.ajax({
            url: "http://mikanani.me/Account/ApiLogin",
            dataType: "json",
            type: "GET",
            success: function(data) {
                localStorage.setItem("hash", data.Message);
            }
        });
    }
    $.ajaxSetup({
        headers: {
            "Authorization": "MikanHash " + localStorage.getItem("hash")
        }
    });
}

function getUpdate() {
    if (localStorage.getItem("hash") == null) return;
    $.ajax({
        url: "http://api.mikanani.me/api/Mention",
        dataType: "json",
        type: "GET",
        success: function(data) {
            var lastEpisodeId = localStorage.getItem("lastEpisodeId");
            if (lastEpisodeId != null) {
                lastEpisodeId = +lastEpisodeId;
                if (data[0].EpisodeId !== lastEpisodeId) {
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
                                iconUrl: "icons/ic_file_download_black_24dp_2x.png"
                            }/*,
                            {
                                title: chrome.i18n.getMessage("updateNotificationButtonCopy"),
                                iconUrl: "icons/ic_content_copy_black_24dp_2x.png"
                            }*/
                        ]
                    });
                    localStorage.setItem("lastEpisodeId", data[0].EpisodeId);
                }
            }
        },
        error: function() {
            setupHash(true);
        }
    });
}

setInterval(getUpdate, 60000);