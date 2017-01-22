if ($("#user-login").html() === undefined) {
    chrome.runtime.sendMessage({ type: "loginStatus", loginStatus: "login" });
} else {
    chrome.runtime.sendMessage({ type: "loginStatus", loginStatus: "logout" });
}

$(".js-magnet.w-other-c").after(' <a class="mikanex-xunlei magnet-link w-other-c rss-episode-name">[添加至迅雷离线]</a>');
$(".js-magnet:not(.w-other-c)").after(' <a class="mikanex-xunlei magnet-link rss-episode-name">[添加至迅雷离线]</a>');

(function () {
    function TestDisplay() {
        if ($("#an-list").length !== 0 && $("#an-list").find(".mikanex-xunlei").length === 0) {
            $(".js-magnet.w-other-c").after(' <a class="mikanex-xunlei magnet-link w-other-c rss-episode-name">[添加至迅雷离线]</a>');
        }
        if ($(".sk-bangumi").length !== 0 && $(".sk-bangumi").find(".mikanex-xunlei:visible").length === 0) {
            $(".js-magnet:not(.w-other-c)").after(' <a class="mikanex-xunlei magnet-link rss-episode-name">[添加至迅雷离线]</a>');
        }
    }

    let target = document.querySelector("body");
    let observer = new MutationObserver(function (mutations) {
        TestDisplay();
        setTimeout(TestDisplay, 1000);
    });
    let config = { attributes: true, childList: true, characterData: true }
    observer.observe(target, config);

})();

$(".mikanex-xunlei").on("click", function () {
    let clickObj = this;
    chrome.runtime.sendMessage(
        {
            type: "xunlei",
            targetUrl: $(clickObj).prev().data("clipboardText"),
        }, (response) => {
            //https://bugzilla.mozilla.org/show_bug.cgi?id=1228044
            if (response == null) {
                $(clickObj).addClass("tooltipped");
                $(clickObj).attr("aria-label", chrome.i18n.getMessage("xunleiFirefoxUnknown"));
                setTimeout(function () {
                    $(clickObj).removeClass("tooltipped");
                    $(clickObj).removeAttr("aria-label");
                }, 1000);
            }
            let message;
            if (response.status) {
                message = chrome.i18n.getMessage("xunleiSuccess");
            } else {
                switch (response.message) {
                    case "notLogin":
                        message = chrome.i18n.getMessage("xunleiNotLogin");
                        break;
                    case "noMagnet":
                        message = chrome.i18n.getMessage("xunleiNoMagnet");
                        break;
                    default:
                        message = chrome.i18n.getMessage("xunleiUnknownError");
                        break;
                }
            }
            $(clickObj).addClass("tooltipped");
            $(clickObj).attr("aria-label", message);
            setTimeout(function () {
                $(clickObj).removeClass("tooltipped");
                $(clickObj).removeAttr("aria-label");
            }, 1000);
        });
});