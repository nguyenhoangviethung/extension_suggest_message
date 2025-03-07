import { shouldIgnoreMessage, removeIgnoreWords } from './domUtlis.js';
export function processMessage(messageArray, name) {
    let messageSet = new Set();
    
    messageArray.forEach((message) => {
        if(!shouldIgnoreMessage(message)) {
            message = removeIgnoreWords(message);
            message = message.replace(/^(Today|Yesterday|\w+ \d{1,2}) at \d{1,2}:\d{2}\s?[APM]{2}\n?(\w{3} \d{1,2}:\d{2}\s?[APM]{2}\n?)?/m, "").trim();
            message = message.replace(/\b\d{1,2}:\d{2}\s?[APM]{2}\b\n*/i, "").trim();

            if(message.includes(name) === true) {
                message = message.replace(name, "");
                return messageSet;
            }
            let messagePattern = message.split("\n");
            let removedString = "";
            const nameParts = name.split(" ");
            // console.log(messagePattern + "       ")
            // console.log(name.includes(messagePattern[0]))
            for(let i = 0; i < messagePattern.length && i < nameParts.length; i++){
            if(name.includes(messagePattern[i]) && removedString.includes(messagePattern[i]) === false)
                removedString += messagePattern[i] + " ";
                // console.log(removedString);
            }
            message = message.replace(removedString.trim(), "").trim();
            // console.log(message);
            if(!(message === ""))
                messageSet.add(message);
        }
    })
    return messageSet;
}   