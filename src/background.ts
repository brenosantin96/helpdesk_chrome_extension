//SERVICE WORKER PAGE
import "../styles/styles.css"
import { getCaretPositionXY2 } from "./utils";

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
    if (tab.id && tab.url?.startsWith("http")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
        });
    }
});

chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: (response?: any) => void) => {
    if (message.type === 'getHelpTexts') {
        fetch('http://localhost:9000/api/inc_vs_ritm_texts')
            .then(response => {
                console.log("Response: ", response) 
                return response.json()
            })
            .then(data => {

                console.log("Data: ", data) 
                sendResponse({ helpTexts: data })
            })
            .catch(error => sendResponse({ error }));
        return true;  // Indicates that the response will be sent asynchronously
    }
});

