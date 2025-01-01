//this will create an iframe in webpage, then side_extension.ts will handle it.
//Act as a bridge between the iframe and the host page


// Listening for messages from the iframe
window.addEventListener("message", (event) => {

    //to toggle extension in button B
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

//appending my iframe to Host Page
function appendIframe() {

    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("side_extension.html");

    iframe.classList.add("iframe_extension")

    //adding iframe to website!
    document.body.appendChild(iframe);

    //when iframe loads, we should be able to manipulate inside content
    // sending message to our iframe after creation
    iframe.onload = () => {
        iframe.contentWindow?.postMessage({ action: "init", message: "Hello from parent!", token: "150296" }, "*");
        getIframeInPage();  //function to get data in third iframe
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

function notifyIframeOnActiveElementChangez(iframe: HTMLIFrameElement) {

    const notifyIframe = (element: Element | null, parentIframePath: string[] = []) => {
        if (
            element instanceof HTMLDivElement ||
            element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement
        ) {
            iframe.contentWindow?.postMessage(
                {
                    action: "activeElementChanged",
                    tagName: element.tagName,
                    value: element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
                        ? element.value
                        : element.innerText,
                    iframePath: parentIframePath, // To identify the nested iframe hierarchy
                },
                "*"
            );
        }
    };

    const checkActiveElementRecursively = (currentDocument: Document, iframePath: string[] = []) => {
        const activeElement = currentDocument.activeElement;

        console.log("active Element inside checkActiveElementRecursively: ", activeElement)

        if (activeElement?.tagName === "IFRAME") {

            console.log("entered in if");

            // If the active element is an iframe, traverse into it
            try {
                const childDocument = (activeElement as HTMLIFrameElement).contentDocument;
                if (childDocument) {
                    checkActiveElementRecursively(childDocument, [...iframePath, activeElement.tagName]);
                }
            } catch (error) {
                console.warn("Cannot access iframe due to cross-origin restrictions:", error);
            }
        } else {
            // Notify the active element in the current document
            notifyIframe(activeElement, iframePath);
        }
    };

    const handleFocusChange = () => {
        checkActiveElementRecursively(document);
    };

    // Immediately check and notify iframe of the current active element
    handleFocusChange();

    // Attach listeners for focus changes
    document.addEventListener("focusin", handleFocusChange);
    document.addEventListener("focusout", handleFocusChange);
}

function getIframeInPage() {

    const iFrameForm = document.getElementById("wufooFormmj7mvqg1jie1d2") as HTMLIFrameElement;

    if (iFrameForm) {
        console.log("Third-party iframe found");

        // Adding onload listener for the third-party iframe
        iFrameForm.onload = () => {
            console.log("Third-party iframe has loaded");

            if (iFrameForm.contentWindow) {


                //i want to send activeElement from the iframe to the main page, but contentDocument returns me null

                console.log("iFrameForm.contentDocument: ", iFrameForm.contentDocument)
                iFrameForm.contentWindow.top?.postMessage({ status: "success", action: "cu" }, "*");
                console.log("Message sent to the third-party iframe");
            }
        };

        // If the iframe is already loaded, `onload` may not trigger.
        // In that case, handle it immediately.
        if (iFrameForm.contentDocument?.readyState === "complete") {
            console.log("Third-party iframe already loaded, sending message directly");
            iFrameForm.contentWindow?.top?.postMessage({ status: "success", action: "cu" }, "*");
        }
    } else {
        console.warn("Third-party iframe not found");
    }
}


window.addEventListener("message", (event) => {
    console.log("Message received in parent:", event); //it is logging the MessageEvent that the iframe wufooFormmj7mvqg1jie1d2 is sending to mainPage
});


//console.log("iframeTest.contentWindow?.location.href: ", iframeTest.contentWindow.location.href);
//iframeTest.contentWindow.postMessage({ action: "changeBackground", color: "#ff0000" }, "*");


/*

1 - Identificar quando foi digitado "barra barra" dentro do input,div DENTRO DO IFRAME. 
2 - Verificar que foi digitado "barra barra" dentro desse input e abrir uma nova janela no navegador
3 - selecionar o shortcut que aparecer na nova janela, ao selecionar, vai preencher a div/input do iframe da pagina host com o texto selecionado
*/


/* 
Notas do dia 01 Janeiro 2025:
Na pagina PRINCIPAL devo colocar um listenning para escutar o que o iframe terceirizado vai dizer: window.addEventListener("message", function(event){console.log(event.data)});
No IFRAME TERCEIRIZADO QUE NAO É MEU, devo adicionar para que ele realize um postMessage para a pagina TOP: iFrameForm.contentWindow.window.top?.postMessage({ status: "success", action: "cu" }, "*");
dessa maneira desde o iframe terceirizado vamos enviar uma mensagem para a pagina PAI.
recebendo essa resposta da pagina pai, podemos tratarla com nosso iframe

Ex de execucao:
Na primeira execucao da pagina, vai executar o window.addEventListener, e vai encontrar mensagens do IFRAME TERCEIRO para a MAIN PAGE,
passado 3 segundos, a pagina principal vai receber um message direeto do componente terceiro e vai executar mais uma vez a window.addEventListener

*/

/* 

Executei desde o Magical, para fazer um teste.... funciona normal... como eles fazem, nao sabemos


*/