if ($("#user-login").html() === undefined) {
    chrome.runtime.sendMessage({ type: "loginStatus", loginStatus: "login" });
} else {
    chrome.runtime.sendMessage({ type: "loginStatus", loginStatus: "logout" });
}