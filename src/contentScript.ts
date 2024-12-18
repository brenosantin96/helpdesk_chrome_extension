//this will create an iframe in webpage, then side_extension.ts that handles 
//Act as a bridge between the iframe and the host page


//injecting .css file in host page
document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = chrome.runtime.getURL("contentScript.css");

    console.log("DOCUMENT: ", document);
    document.head.appendChild(style); // Append the stylesheet after DOM is ready
});

function createIframe() {

    console.log("Current document.readyState:", document.readyState);
    console.log("Iframe source location:", chrome.runtime.getURL("side_extension.html"));

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
    iframe.style.position = "fixed";
    iframe.style.width = "400px";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    iframe.style.zIndex = "10000";
    iframe.style.right = "0";
    iframe.style.top = "0";
    iframe.style.backgroundColor = "white";

    //adding iframe to website!
    document.body.appendChild(iframe);


    console.log("Iframe source location:", chrome.runtime.getURL("side_extension.html"));
    console.log("Iframe source: ", iframe.src);
    console.log("Iframe itself: ", iframe);

    //when iframe loads, we should be able to manipulate inside content
    // sending message to iframe after creation
    iframe.onload = () => {
        console.log("iframe contentWindow: ", iframe.contentWindow)
        iframe.contentWindow?.postMessage({ action: "init", message: "Hello from parent!", token: "150296" }, "*");
    };
}

// Call createIframe function
createIframe();
