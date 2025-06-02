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

        chrome.storage.local.get("processedMessages", (data) => {
            let storedMessages = data.processedMessages || [];

            messageSet.forEach((m) => {
                const exists = storedMessages.some(
                    (msg) => msg.text === m && msg.name === message.name
                );
                if (!exists) {
                    storedMessages.unshift({ name: "", text: m });
                }
            });

            chrome.storage.local.set({ processedMessages: storedMessages }, () => {
                if (chrome.runtime.lastError) {
                    sendResponse({ status: "error" });
                } else {
                    sendResponse({ status: "saved" });
                }
            });
        });
    }
    return true;
});


chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ processedMessages: [] });
});