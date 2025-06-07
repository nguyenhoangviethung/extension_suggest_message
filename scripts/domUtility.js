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

export function updateLabelMessage(labelEl, message, color = "black", duration = 2000) {
  if (!labelEl) return;

  labelEl.textContent = message;
  labelEl.style.color = color;
  labelEl.classList.remove("hidden-msg");

  setTimeout(() => {
    labelEl.classList.add("hidden-msg");
  }, duration);
}