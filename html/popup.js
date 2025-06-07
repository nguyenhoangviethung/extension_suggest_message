chrome.storage.local.get("processedMessages", async (data) => {
    console.log(data)
})
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Popup loaded");

    const messageDropdown = document.getElementById("messageDropdown");
    const outputText = document.getElementById("outputText");

    if (!messageDropdown || !outputText) {
        return;
    }

    chrome.storage.local.get("processedMessages", (data) => {
        console.log("Dữ liệu lấy từ storage:", data);

        if (chrome.runtime.lastError) {
            console.error("Lỗi lấy dữ liệu từ storage:", chrome.runtime.lastError);
        }

        if (data.processedMessages && Array.isArray(data.processedMessages) && data.processedMessages.length > 0) {
            updateDropdown(data.processedMessages);
        } else {
            console.warn("Không có tin nhắn nào được lưu trong storage.");
        }
    });

    function updateDropdown(messages) {
        console.log("Cập nhật dropdown với tin nhắn:", messages);

        messageDropdown.innerHTML = ""; 

        messages.forEach((msg, index) => {
            let option = document.createElement("option");
            option.value = index;
            option.textContent = `${msg.name}: ${msg.text}`;
            messageDropdown.appendChild(option);
        });

        if (messages.length > 0) {
            outputText.textContent = messages[0].text;
        }
    }

    messageDropdown.addEventListener("change", function () {

        chrome.storage.local.get("processedMessages", (data) => {

            if (!data.processedMessages || !Array.isArray(data.processedMessages)) {
                return;
            }

            const selectedMessage = data.processedMessages[this.value];
            if (selectedMessage) {
                outputText.textContent = selectedMessage.text;
            } else {
                console.warn("Không tìm thấy tin nhắn cho index:", this.value);
            }
        });
    });
});
