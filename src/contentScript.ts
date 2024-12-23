//this will create an iframe in webpage, then side_extension.ts will handle it.
//Act as a bridge between the iframe and the host page


// Listening for messages from the iframe
window.addEventListener("message", (event) => {

    if (event.data.action === "toggleExtension") {

        const iframeExtensionWindow = document.querySelector(".iframe_extension");

        if (event.data.data.key === "extensionOppened") {
            iframeExtensionWindow?.classList.add("open")
        } else {
            iframeExtensionWindow?.classList.remove("open")
        }
    }

});

//injecting .css file in host page
document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = chrome.runtime.getURL("contentScript.css");
    document.head.appendChild(style); // Append the stylesheet after DOM is ready
});

function createIframe() {

    // Executa somente após o DOM estar completamente carregado
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => appendIframe());
    } else {
        appendIframe();
    }

}

function appendIframe() {

    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("side_extension.html");

    iframe.classList.add("iframe_extension")

    //adding iframe to website!
    document.body.appendChild(iframe);

    //when iframe loads, we should be able to manipulate inside content
    // sending message to iframe after creation
    iframe.onload = () => {
        iframe.contentWindow?.postMessage({ action: "init", message: "Hello from parent!", token: "150296" }, "*");
        notifyIframeOnActiveElementChange(iframe);
    };
}

// Call createIframe function
createIframe();

//function to send activeElement in hostPage to side_extension iframe
function notifyIframeOnActiveElementChange(iframe: HTMLIFrameElement) {
    const notifyIframe = () => {
        const element = document.activeElement;
        if (
            element instanceof HTMLDivElement ||
            element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement
        ) {
            // Send the active element data to the iframe
            iframe.contentWindow?.postMessage(
                {
                    action: "activeElementChanged",
                    tagName: element.tagName,
                    value: element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
                        ? element.value
                        : element.innerText,
                },
                "*"
            );
        }
    };

    // Immediately check and notify iframe of the current active element
    notifyIframe();

    // Attach listeners for focus changes
    document.addEventListener("focusin", notifyIframe);
    document.addEventListener("focusout", notifyIframe);
}