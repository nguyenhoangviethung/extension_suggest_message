import { getProcessedMessages } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("msgSelect");
  const input = document.getElementById("msgInput");
  const result = document.getElementById("result");

  if (!select || !input || !result) return;

  getProcessedMessages().then(messages => {
    if (!messages || messages.length === 0) return;

    select.innerHTML = "";
    messages.forEach((msg, i) => {
      const option = document.createElement("option");
      option.value = i; // dùng index làm value
      option.textContent = `${msg.name}: ${msg.text}`;
      select.appendChild(option);
    });

    // Auto-fill textarea với tin nhắn đầu tiên
    input.value = messages[0].text;
    result.textContent = ""; // hoặc reset result
  });

  select.addEventListener("change", () => {
    getProcessedMessages().then(messages => {
      const idx = select.value;
      if (messages && messages[idx]) {
        input.value = messages[idx].text;
      }
    });
  });
});
  // Khi bấm áp dụng: Gửi API và hiển thị kết quả
  applyBtn.addEventListener("click", async () => {
    const userInput = input.value.trim();
    if (!userInput) return alert("Vui lòng nhập nội dung.");

    try {
      const res = await fetch("https://api.example.com/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userInput })
      });
      const data = await res.json();
      result.textContent = data.result || "Không có kết quả.";
    } catch (err) {
      console.error("Lỗi API:", err);
      result.textContent = "Đã xảy ra lỗi khi gọi API.";
    }
  });

