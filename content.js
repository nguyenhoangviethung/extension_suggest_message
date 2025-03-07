function observeMessages() {
    console.log(document.readyState);
    let name = document.querySelector('.xxymvpz.x1dyh7pn');
    if(!name){
        name = document.querySelector('.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft.x1j85h84');
    }
    console.log(name);
    const chatContainers = document.querySelectorAll('.x78zum5.xdt5ytf.x1iyjqo2.x5yr21d');
    if(!chatContainers) {
        setTimeout(observeMessages, 1000);
        return;
    }
    const chatContainer = chatContainers[1];
    if(!chatContainer){
        setTimeout(observeMessages, 1000);
        return;
    }
    console.log('✅ found chat container, starting observe');
    console.log(chatContainer)
    const observe = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if(node.nodeType === 1) {
                    const messageText = node.innerText?.trim();
                    if(messageText){
                        console.log("Tên người gửi:" + name.innerText?.trim());
                        console.log("📩 Tin nhắn mới:" + messageText);
                        chrome.runtime.sendMessage({ type: "NEW_MESSAGE", text: messageText, name: name.innerText?.trim() });
                    }
                }
            })
        })
    })
    observe.observe(chatContainer, {childList: true, subtree: true});
}

window.addEventListener("load", observeMessages);