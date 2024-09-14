import "../styles/styles.css"

chrome.action.onClicked.addListener((tab : chrome.tabs.Tab) => {

    if (tab.id && tab.url?.startsWith("http")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
        });
    }
});


/* let active = false;

function makeOrange(color: string): void {
    document.body.style.backgroundColor = color;
}

chrome.action.onClicked.addListener((tab : chrome.tabs.Tab) => {
    active = !active;
    const color = active ? 'orange' : 'white';
    chrome.scripting.executeScript({
        target: {tabId: tab.id ? tab.id : -1},
        func: makeOrange,
        args: [color]
    }).then();
}); */