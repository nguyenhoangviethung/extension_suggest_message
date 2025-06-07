
import {updateLabelMessage} from "./domUtility.js"

(async () => {
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

    const backBtn = document.getElementById("backBtn");
    const keywordInput = document.getElementById("keywords");
    const flirtInput = document.getElementById("flirtText");
    const submitFlirtBtn = document.getElementById("submitFlirt");

    const imageInput = document.getElementById("imageFile");
    const imageLinkInput = document.getElementById("imageLink");
    const submitImageBtn = document.getElementById("submitImage");

    const flirtMsg = document.getElementById("flirtMsg");
    const flirtImg = document.getElementById("flirtImg");

    const previewImage = document.getElementById("previewImage");
    const previewBtn = document.getElementById("previewBtn");

    if (!previewBtn || !previewImage || !backBtn || !keywordInput || !flirtInput || !submitFlirtBtn || !imageInput || !imageLinkInput || !submitImageBtn || !flirtMsg || !flirtImg) {
        console.error("Không tìm thấy các phần tử DOM cần thiết.");
        return;
    }

    // backBtn.addEventListener("click", () => {
    //     window.location.href = "popup.html";
    // });

    submitFlirtBtn.addEventListener("click", async() => {
        const keywords = keywordInput.value.trim();
        const text = flirtInput.value.trim();

        if (!keywords || !text) {
            updateLabelMessage(flirtMsg, "Vui lòng nhập đủ các trường", "red");
            return;
        }
        const keyword = keywords.split(",");
        try{
            const res = await fetch(apiUrl + "sentence/add-sentence",{
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                keyword: keyword,
                text: text
                })
            });
            if(res.status == 202){
                updateLabelMessage(flirtMsg, "Đã đóng góp thành công", "green");
            }
            else{
                updateLabelMessage(flirtMsg, "Sai định dạng", "red");
            }
        }catch(err){
            updateLabelMessage(flirtMsg, "Lỗi hệ thống", "red");
        }
        keywordInput.value = "";
        flirtInput.value = "";
    });

    submitImageBtn.addEventListener("click", async() => {
        const file = imageInput.files[0];
        const link = imageLinkInput.value.trim();

        if (!file && !link) {
            updateLabelMessage("Vui lòng chọn một ảnh hoặc nhập một link")
            return;
        }

        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                const res = await fetch(apiUrl + "cloudinary/upload-image", {
                    method: "POST",
                    body: formData
                });

                const data = await res.json();
                if (res.status == 202) {
                    updateLabelMessage(flirtImg, "Đã đóng góp thàng công", "green");
                } else {
                    updateLabelMessage(flirtImg, "Sai định dạng", "red");
                }
            } catch (err) {
                updateLabelMessage(flirtImg, "Lỗi hệ thống", "red");
            }

        } else {
            alert(link);
            try {
                const res = await fetch(apiUrl+"cloudinary/upload-image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        path: link
                    })
                });
                if(res.status == 202){
                    updateLabelMessage(flirtImg, "Đã đóng góp thành công", "green");
                }
                else{
                    updateLabelMessage(flirtImg, "Sai định dạng", "red");
                }
            } catch (error) {
                alert(err)
                updateLabelMessage(flirtImg, "Lỗi hệ thống", "red");
            }
        }

        imageInput.value = "";
        imageLinkInput.value = "";
    });
    previewBtn.addEventListener("click", () => {
        const file = imageInput.files[0];
        const link = imageLinkInput.value.trim();
        
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
                previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        } else if (link) {
            previewImage.src = link;
            previewImage.style.display = "block";
        } else {
            previewImage.style.display = "none";
            alert("Vui lòng chọn file hoặc nhập link ảnh.");
        }
    });
})();
