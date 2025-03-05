console.log("🎯 Background script đang chạy!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "NEW_MESSAGE") {
        console.log("📩 Tin nhắn từ content script:", message.text);
        sendResponse({ status: "received" }); // Gửi phản hồi để giữ service worker hoạt động
    }
    return true; // Giữ service worker hoạt động
});
