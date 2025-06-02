// scripts/dom.js

/**
 * Cập nhật nội dung dropdown (select element) với danh sách tin nhắn.
 * @param {HTMLElement} selectElement - thẻ <select>
 * @param {Array} messages - danh sách { name, text }
 */
export function updateMessageDropdown(selectElement, messages) {
  selectElement.innerHTML = ""; // Xóa các option cũ

  messages.forEach((msg, index) => {
    const option = document.createElement("option");
    option.value = msg.text;
    option.textContent = `${msg.name}: ${msg.text}`;
    selectElement.appendChild(option);
  });
}

/**
 * Gán giá trị từ dropdown vào textarea mỗi khi chọn thay đổi
 * @param {HTMLSelectElement} selectElement
 * @param {HTMLTextAreaElement} inputElement
 */
export function bindDropdownToInput(selectElement, inputElement) {
  selectElement.addEventListener("change", () => {
    inputElement.value = selectElement.value;
  });
}
