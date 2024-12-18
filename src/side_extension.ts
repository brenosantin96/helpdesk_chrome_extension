//this .tsfile deals with the logic and behavior inside the iframe (side_extension.html)
//Code here is sandboxed and cannot directly access the host page's DOM or JavaScript.
//Communicates with the host page via postMessage.

// Receiving the message in the iframe:
window.addEventListener("message", (event) => {

    console.log("event: ", event);
    console.log("logging");

    if (event.data.token === "150296") {

        console.log("Received mesage:", event.data);

        if (event.data.action === "init") {

            // Path to the styles.css file
            const stylesPath = chrome.runtime.getURL("iframe.css");

            // Create a <link> element for the stylesheet
            const linkElement = document.createElement("link");
            linkElement.rel = "stylesheet";
            linkElement.type = "text/css";
            linkElement.href = stylesPath;

            // Append the <link> element to the <head>
            document.head.appendChild(linkElement);

            console.log("Stylesheet applied from:", stylesPath);
        }
    }

});



/* 

How They Work Together contentScript.ts and side_extension.ts

Adds the iframe (side_extension.html) to the page.
Sends a message to the iframe to initialize or update its content.
Acts as a middleman if you need data from the background script, storage, or APIs.
side_extension.ts:

Receives the message sent by contentScript.ts (e.g., initialization data).
Handles all functionality and interactions inside the iframe.

*/