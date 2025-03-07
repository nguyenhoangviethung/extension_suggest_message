import { configData } from "../config.js";

let CONFIG = configData
console.log(CONFIG)

// Hàm kiểm tra tin nhắn có bị bỏ qua không
export function shouldIgnoreMessage(message) {
    return CONFIG.NON_MESSAGE.some(nonMsg => message.includes(nonMsg));
}

// Hàm xóa từ cần bỏ qua
export function removeIgnoreWords(message) {
    CONFIG.IGNORE_WORD.forEach(word => {
        message = message.replace(new RegExp(`\\b${word}\\b`, "gi"), "").trim();
    });
    return message;
}

