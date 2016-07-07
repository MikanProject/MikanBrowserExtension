// string format repalcement from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
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

//Xunlei API adapted from https://github.com/binux/lixian.xunlei/blob/master/libs/lixian_api.py
let XunleiApi = (function () {
    let BTTaskCheckUrl = "http://dynamic.cloud.vip.xunlei.com/interface/url_query?callback=queryUrl&u={0}&random={1}&tcache={2}";
    let BTTaskCommitUrl = "http://dynamic.cloud.vip.xunlei.com/interface/bt_task_commit?callback=jsonp1234567890";

    function _now() {
        return Date.now();
    }
    function _random() {
        return _now() + "" + Math.round(Math.random() * (2000000 - 10) + 10)
    }
    function changeRefererCallback(details) {
        let newRef = "http://lixian.vip.xunlei.com/";
        let gotRef = false;
        for (let n in details.requestHeaders) {
            gotRef = details.requestHeaders[n].name.toLowerCase() === "referer";
            if (gotRef) {
                details.requestHeaders[n].value = newRef;
                break;
            }
        }
        if (!gotRef) {
            details.requestHeaders.push({ name: "Referer", value: newRef });
        }
        return { requestHeaders: details.requestHeaders };
    }
    function changeReferer() {
        chrome.webRequest.onBeforeSendHeaders.addListener(
            changeRefererCallback,
            {
                urls: ["http://dynamic.cloud.vip.xunlei.com/*"],
            },
            [
                "requestHeaders",
                "blocking",
            ]);
    }
    function requestChangeReferer() {
        chrome.permissions.contains({
            permissions: ["webRequest", "webRequestBlocking"],
        }, function (result) {
            if (!result) {
                chrome.permissions.request({
                    permissions: ["webRequest", "webRequestBlocking"],
                }, function (granted) {
                    if (!granted) {
                        return false;
                    } else if (!chrome.webRequest.onBeforeSendHeaders.hasListener(changeRefererCallback)) {
                        changeReferer();
                    }
                });
            } else if (!chrome.webRequest.onBeforeSendHeaders.hasListener(changeRefererCallback)) {
                changeReferer();
            }
        });
    }
    function getUid(callback) {
        chrome.permissions.contains({
            permissions: ["cookies"],
        }, function (result) {
            if (!result) {
                chrome.permissions.request({
                    permissions: ["cookies"],
                }, function (granted) {
                    if (!granted) {
                        callback(false);
                    } else {
                        chrome.cookies.get({ url: "http://dynamic.cloud.vip.xunlei.com/", name: "userid" }, function (cookie) {
                            if (cookie == null) callback(false);
                            callback(cookie.value);
                        });
                    }
                });
            } else {
                chrome.cookies.get({ url: "http://dynamic.cloud.vip.xunlei.com/", name: "userid" }, function (cookie) {
                    if (cookie == null) callback(false);
                    callback(cookie.value);
                });
            }
        });
    }

    return {
        AddBTTask: function (url, callback) {
            //requestChangeReferer();
            $.ajax({
                url: BTTaskCheckUrl.format(url, _random(), _now()),
                type: "GET",
                success: function (data) {
                    //queryUrl(flag,infohash,fsize,bt_title,is_full,subtitle,subformatsize,size_list,valid_list,file_icon,findex,random)
                    if (!data.match(/^queryUrl\(/)) callback({ status: false, message: "notLogin" });
                    data = JSON.parse(data.replace(/^queryUrl\(/, "[")
                        .replace(/\)$/, "]").replace(/new Array\('/g, "['")
                        .replace(/'\)/g, "']").replace(/'/g, "\""));
                    if (data[0] === 0) callback({ status: false, message: "noMagnet" });
                    let postData = {
                        cid: data[1],
                        goldbean: 0,
                        silverbean: 0,
                        tsize: data[2],
                        findex: data[10].join("_"),
                        size: data[7].join("_"),
                        btname: data[3],
                        o_taskid: 0,
                        o_page: "task",
                        class_id: 0,
                        from: 0,
                    };
                    getUid(function (value) {
                        if (value) {
                            postData.uid = value;
                            console.log(postData);
                            $.ajax({
                                type: "POST",
                                url: BTTaskCommitUrl,
                                data: postData,
                                success: function (commitData) {
                                    if (commitData.match(/jsonp1234567890/)) {
                                        callback({ status: true });
                                    } else {
                                        callback({ status: false, message: "unknownError" });
                                    }
                                },
                            });
                        } else {
                            callback({ status: false, message: "notLogin" });
                        }
                    });
                },
            });
        },
    };
})();