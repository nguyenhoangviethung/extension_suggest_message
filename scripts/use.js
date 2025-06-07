import { getProcessedMessages } from './storage.js';

document.addEventListener("DOMContentLoaded", async () => {

  const adminBtn = document.getElementById("adminBtn");
  const originalHTML = document.body.innerHTML;
  const contributeBtn = document.getElementById("contributeBtn");

  if (contributeBtn) {
    contributeBtn.addEventListener("click", () => {
      fetch(chrome.runtime.getURL("html/contribute.html"))
        .then(res => res.text())
        .then(html => {
          document.body.innerHTML = html;

          const script = document.createElement("script");
          script.src = chrome.runtime.getURL("scripts/contribute.js");
          script.type = "module";
          document.body.appendChild(script);

          const backBtn = document.getElementById("backBtn");
          if (backBtn) {
            backBtn.addEventListener("click", () => {
              document.body.innerHTML = originalHTML;
              location.reload(); // hoặc gắn lại event nếu không muốn reload toàn bộ
            });
          }
        })
        .catch(err => console.error("Không thể tải contribute.html:", err));
    });
  }

  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      // alert("khởi chạy admin")
      chrome.tabs.create({ url: chrome.runtime.getURL("html/admin.html") });
    });
  }
  let apiUrl = "";
  let apiKey = "";

  try {
    const resConfig = await fetch(chrome.runtime.getURL("config.json"));
    if (!resConfig.ok) throw new Error("Không tải được config.json");
    const config = await resConfig.json();

    apiUrl = config.API_URL || "";
    apiKey = config.API_KEY_ADMIN || "";
  } catch (e) {
    console.error("Lỗi load config:", e);
  }

  const select = document.getElementById("msgSelect");
  const input = document.getElementById("msgInput");
  const resultList = document.getElementById("resultList");
  const applyBtn = document.getElementById("applyBtn");
  const selectedResult = document.getElementById("selectedResult");
  const copyBtn = document.getElementById("copyBtn");

  if (!select || !input || !resultList || !applyBtn || !selectedResult || !copyBtn) {
    console.error("Không tìm thấy các phần tử DOM cần thiết.");
    return;
  }

  try {
    const messages = await getProcessedMessages();
    if (!messages || messages.length === 0) return;

    select.innerHTML = "";
    messages.forEach((msg, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${msg.name}: ${msg.text}`;
      select.appendChild(option);
    });

    input.value = messages[0].text;
    resultList.innerHTML = "";
    selectedResult.value = "";
  } catch (err) {
    console.error("Lỗi load messages:", err);
  }

  select.addEventListener("change", async () => {
    try {
      const messages = await getProcessedMessages();
      const idx = select.value;
      if (messages && messages[idx]) {
        input.value = messages[idx].text;
      }
    } catch (err) {
      console.error("Lỗi xử lý change select:", err);
    }
  });

  applyBtn.addEventListener("click", async () => {
    const userInput = input.value.trim();
    if (!userInput) {
      alert("Vui lòng nhập nội dung.");
      return;
    }

    try {
      const res = await fetch(apiUrl + "chatbot/query-rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userInput }),
      });

      if (!res.ok) {
        throw new Error(`HTTP lỗi: ${res.status}`);
      }

      const data = await res.json();
      console.log("Kết quả API:", data.ketqua);

      resultList.innerHTML = "";
      selectedResult.value = "";

      if (Array.isArray(data.ketqua) && data.ketqua.length > 0) {
        data.ketqua.forEach(item => {
          const option = document.createElement("option");
          option.textContent = item;
          resultList.appendChild(option);
        });
      } else {
        const option = document.createElement("option");
        option.textContent = "Không có kết quả.";
        resultList.appendChild(option);
      }
    } catch (err) {
      console.error("Lỗi API:", err);
      resultList.innerHTML = "";
      selectedResult.value = "";
      const option = document.createElement("option");
      option.textContent = "Đã xảy ra lỗi khi gọi API.";
      resultList.appendChild(option);
    }
  });

  resultList.addEventListener("change", () => {
    const idx = resultList.selectedIndex;
    if (idx >= 0) {
      selectedResult.value = resultList.options[idx].textContent;
    } else {
      selectedResult.value = "";
    }
  });

  copyBtn.addEventListener("click", () => {
    if (selectedResult.value.trim() === "") {
      alert("Chưa có nội dung để copy.");
      return;
    }
    navigator.clipboard.writeText(selectedResult.value).then(() => {
      alert("Đã copy nội dung!");
    }).catch(err => {
      alert("Copy thất bại: " + err);
    });
  });
});

