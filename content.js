if (!window.__observerInjected__) {
  window.__observerInjected__ = true;

  let currentUrl = location.href;
  let observer = null;

  function observeMessages() {
    console.log("[Extension] ⏳ Waiting for DOM...");

    let name = document.querySelector('.xxymvpz.x1dyh7pn') ||
               document.querySelector('.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft.x1j85h84');

    const chatContainers = document.querySelectorAll('.x78zum5.xdt5ytf.x1iyjqo2.x5yr21d');
    const chatContainer = chatContainers[1]; 

    if (!name || !chatContainer) {
      setTimeout(observeMessages, 1000);
      return;
    }

    if (observer) observer.disconnect(); 

    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            const messageText = node.innerText?.trim();
            const senderName = name?.innerText?.trim();
            if (messageText && senderName) {
              try {
                chrome.runtime.sendMessage({
                  type: "NEW_MESSAGE",
                  text: messageText,
                  name: senderName
                });
              } catch (err) {
                console.warn("[Extension] 🛑 Gửi message lỗi:", err.message);
              }
            }
          }
        }
      }
    });

    observer.observe(chatContainer, { childList: true, subtree: true });
    console.log("[Extension] ✅ Observer attached to chat.");
  }

  observeMessages();

  const urlObserver = new MutationObserver(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      console.log("[Extension] 🔄 URL changed, reinitializing observer...");
      setTimeout(observeMessages, 1000);
    }
  });

  urlObserver.observe(document.body, { childList: true, subtree: true });
}
