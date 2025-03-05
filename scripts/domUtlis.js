export function getLastMessage() {
    const messageElements = document.querySelectorAll('[data-testid="message-container"]');
    if (messageElements.length === 0) return null;

    const lastMessage = messageElements[messageElements.length - 1];
    const textElement = lastMessage.querySelector('[data-testid="messenger_outgoing_text"]') ||
                        lastMessage.querySelector('[data-testid="messenger_incoming_text"]');

    return textElement ? textElement.innerText : null;
}
