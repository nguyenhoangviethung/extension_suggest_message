document.addEventListener("DOMContentLoaded", async () => {
  const { updateLabelMessage } = await import(chrome.runtime.getURL("scripts/domUtility.js"));

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

  const buildBtn = document.getElementById("buildIndexBtn");
  const preBtn = document.getElementById("preDataBtn");
  const messagesTableBody = document.querySelector("#pendingMessages tbody");
  const imagesTableBody = document.querySelector("#pendingImages tbody");

  const buildIndexLabel = document.getElementById("buildIndexStatus");
  const preDataLabel = document.getElementById("preDataStatus");
  const approveMLabel = document.getElementById("messageStatus");
  const approveILabel = document.getElementById("imageStatus");

  if (!buildBtn || !messagesTableBody || !imagesTableBody || !preBtn || !preDataLabel || !buildIndexLabel || !approveILabel || !approveMLabel) {
    console.error("Thiếu phần tử DOM cần thiết.");
    return;
  }

  preBtn.addEventListener("click", async () => {
    try {
      updateLabelMessage(preDataLabel, "Pending .................", "Blue", 10000000);
      const res = await fetch(apiUrl + "sentence/pre-data", {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
      });
      if (res.ok) {
        updateLabelMessage(preDataLabel, "Đã load xong dữ liệu", "Green", 10000);
        alert("Đã load xong dữ liệu");
      }
    } catch {}
  });

  buildBtn.addEventListener("click", async () => {
    try {
      updateLabelMessage(buildIndexLabel, "Pending ..........", "Blue", 10000000);
      const res = await fetch(apiUrl + "chatbot/build-index", {
        method: "PUT",
        headers: {
          Authorization: apiKey,
        },
      });
      if (res.ok) {
        updateLabelMessage(buildIndexLabel, "Đã build index thành công!", "Green", 10000);
        alert("Đã build index thành công!");
      } else {
        alert("Build index thất bại.");
      }
    } catch (err) {
      alert("Lỗi khi gọi API build index");
      console.error(err);
    }
  });

  async function fetchPendingMessages() {
    try {
      const res = await fetch(apiUrl + "sentence/pending", {
        headers: { Authorization: apiKey },
      });

      if (!res.ok) throw new Error("Lỗi response");

      const data = await res.json();
      messagesTableBody.innerHTML = "";

      data.forEach((msg) => {
        const tr = document.createElement("tr");

        // Nội dung câu nói cell
        const contentTd = document.createElement("td");
        contentTd.className = "content-cell";
        contentTd.innerHTML = `
          <p><strong>Keyword:</strong> ${String(msg.keyword + '\n'|| '').replace(/\n/g, "<br>")}</p>
          <p><strong>Text:</strong> ${String(msg.text || '').replace(/\n/g, "<br>")}</p>
        `;

        // Nút duyệt + từ chối cell
        const actionTd = document.createElement("td");
        actionTd.className = "action-cell";

        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Duyệt";
        approveBtn.style.color = "white";
        approveBtn.style.border = "none";
        approveBtn.style.padding = "6px 12px";
        approveBtn.style.borderRadius = "4px";
        approveBtn.style.cursor = "pointer";
        approveBtn.onmouseenter = () => approveBtn.style.opacity = "0.8";
        approveBtn.onmouseleave = () => approveBtn.style.opacity = "1";
        approveBtn.onclick = async () => {
          await approveMessage(msg._id);
        };

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Từ chối";
        rejectBtn.style.marginTop = "8px";
        rejectBtn.style.backgroundColor = "#e74c3c";   // đỏ tươi
        rejectBtn.style.color = "white";
        rejectBtn.style.border = "none";
        rejectBtn.style.padding = "6px 12px";
        rejectBtn.style.borderRadius = "4px";
        rejectBtn.style.cursor = "pointer";
        rejectBtn.onmouseenter = () => rejectBtn.style.opacity = "0.8";
        rejectBtn.onmouseleave = () => rejectBtn.style.opacity = "1";

        rejectBtn.onclick = async () => {
          await rejectMessage(msg._id);
        };

        actionTd.appendChild(approveBtn);
        actionTd.appendChild(document.createElement("br"));
        actionTd.appendChild(rejectBtn);

        tr.appendChild(contentTd);
        tr.appendChild(actionTd);
        messagesTableBody.appendChild(tr);
      });
    } catch (e) {
      console.error("Lỗi khi tải câu nói:", e);
      messagesTableBody.innerHTML = '<tr><td colspan="2">Lỗi khi tải câu nói.</td></tr>';
    }
  }

  async function approveMessage(_id) {
    try {
      updateLabelMessage(approveMLabel, "Pending ...........", "Blue", 10000000);
      const res = await fetch(apiUrl + "sentence/approve", {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: _id }),
      });

      if (res.ok) {
        await fetchPendingMessages();
        updateLabelMessage(approveMLabel, "Câu nói đã được duyệt", "green");
      } else {
        const err = await res.json();
        alert("Lỗi duyệt câu: " + (err.message || "Không rõ lỗi"));
      }
    } catch (err) {
      console.error("Lỗi duyệt câu nói:", err);
    }
  }

  async function rejectMessage(_id) {
    try {
      updateLabelMessage(approveMLabel, "Đang từ chối...", "Blue", 10000000);
      const res = await fetch(apiUrl + "sentence/deny", {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });

      if (res.ok) {
        await fetchPendingMessages();
        updateLabelMessage(approveMLabel, "Câu nói đã bị từ chối", "red");
      } else {
        const err = await res.json();
        alert("Lỗi từ chối câu: " + (err.message || "Không rõ lỗi"));
      }
    } catch (err) {
      console.error("Lỗi từ chối câu nói:", err);
    }
  }

  async function fetchPendingImages() {
    try {
      const res = await fetch(apiUrl + "cloudinary/pending", {
        headers: { Authorization: apiKey },
      });

      if (!res.ok) throw new Error("Lỗi response");

      const data = await res.json();
      imagesTableBody.innerHTML = "";

      data.images.forEach((img) => {
        const tr = document.createElement("tr");

        // Ảnh cell
        const contentTd = document.createElement("td");
        contentTd.className = "content-cell";

        const image = document.createElement("img");
        image.src = img.url;
        image.alt = "Ảnh cần duyệt";
        image.style.width = "320px";   
        image.style.height = "320px";
        image.style.objectFit = "cover";
        image.style.borderRadius = "6px";
        image.style.marginRight = "12px";

        contentTd.appendChild(image);

        // Nút duyệt + từ chối cell
        const actionTd = document.createElement("td");
        actionTd.className = "action-cell";

        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Duyệt";
        approveBtn.style.color = "white";
        approveBtn.style.border = "none";
        approveBtn.style.padding = "6px 12px";
        approveBtn.style.borderRadius = "4px";
        approveBtn.style.cursor = "pointer";
        approveBtn.onmouseenter = () => approveBtn.style.opacity = "0.8";
        approveBtn.onmouseleave = () => approveBtn.style.opacity = "1";
        approveBtn.onclick = async () => {
          await approveImage(img.secure_url || img.url);
        };

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Từ chối";
        rejectBtn.style.marginTop = "8px";
        rejectBtn.style.backgroundColor = "#e74c3c";   // đỏ tươi
        rejectBtn.style.color = "white";
        rejectBtn.style.border = "none";
        rejectBtn.style.padding = "6px 12px";
        rejectBtn.style.borderRadius = "4px";
        rejectBtn.style.cursor = "pointer";
        rejectBtn.onmouseenter = () => rejectBtn.style.opacity = "0.8";
        rejectBtn.onmouseleave = () => rejectBtn.style.opacity = "1";

        rejectBtn.onclick = async () => {
          await rejectImage(img.secure_url || img.url);
        };

        actionTd.appendChild(approveBtn);
        actionTd.appendChild(document.createElement("br"));
        actionTd.appendChild(rejectBtn);

        tr.appendChild(contentTd);
        tr.appendChild(actionTd);
        imagesTableBody.appendChild(tr);
      });
    } catch (e) {
      console.error("Lỗi khi tải ảnh:", e);
      imagesTableBody.innerHTML = '<tr><td colspan="2">Lỗi khi tải ảnh.</td></tr>';
    }
  }

  async function approveImage(url) {
    try {
      updateLabelMessage(approveILabel, "Pending ..........", "Blue", 10000000);
      const res = await fetch(apiUrl + "cloudinary/approve", {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: url }),
      });

      if (res.ok) {
        updateLabelMessage(approveILabel, "Ảnh đã được duyệt", "Green");
        await fetchPendingImages();
      } else {
        const err = await res.json();
        alert("Lỗi duyệt ảnh: " + (err.message || "Không rõ lỗi"));
      }
    } catch (err) {
      console.error("Lỗi duyệt ảnh:", err);
    }
  }

  async function rejectImage(url) {
    try {
      updateLabelMessage(approveILabel, "Đang từ chối...", "Blue", 10000000);
      const res = await fetch(apiUrl + "cloudinary/deny", {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: url }),
      });

      if (res.ok) {
        updateLabelMessage(approveILabel, "Ảnh đã bị từ chối", "red");
        await fetchPendingImages();
      } else {
        const err = await res.json();
        alert("Lỗi từ chối ảnh: " + (err.message || "Không rõ lỗi"));
      }
    } catch (err) {
      console.error("Lỗi từ chối ảnh:", err);
    }
  }

  // Gọi khi load trang
  await fetchPendingMessages();
  await fetchPendingImages();
});
