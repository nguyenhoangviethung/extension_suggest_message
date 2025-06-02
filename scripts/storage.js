// scripts/storage.js

/**
 * Trả về mảng processedMessages từ storage (hoặc mảng rỗng nếu không có).
 * @returns {Promise<Array>}
 */
export async function getProcessedMessages() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("processedMessages", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Lỗi lấy dữ liệu từ storage:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        const messages = data.processedMessages || [];
        resolve(Array.isArray(messages) ? messages : []);
      }
    });
  });
}
