function observeMessages() {
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
                        console.log("📩 Tin nhắn mới:" + messageText);
                        chrome.runtime.sendMessage({ type: "NEW_MESSAGE", text: messageText });
                    }
                }
            })
        })
    })
    observe.observe(chatContainer, {childList: true, subtree: true});
}

window.addEventListener("load", observeMessages);