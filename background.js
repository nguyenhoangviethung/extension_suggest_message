import { processMessage } from "./scripts/messageProcessor.js";
console.log("🎯 Background script đang chạy!");
var messageArray = [];
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "NEW_MESSAGE") {
        console.log("📩 Tin nhắn từ content script:", message.text);
        messageArray.push(message.text);
        console.log(message.name);
        const messageSet = processMessage(messageArray, message.name);
        console.log("✅ Danh sách tin nhắn sau xử lý:", messageSet);
        sendResponse({ status: "received" });
    }
    return true; 
});
