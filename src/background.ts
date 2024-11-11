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
                console.log("Response: ", response) //ESSE CONSOLE.LOG aparece com normalidade
                return response.json()
            })
            .then(data => {

                console.log("Data: ", data) //ESSE CONSOLE.LOG aparece com normalidade
                sendResponse({ helpTexts: data })
            })
            .catch(error => sendResponse({ error }));
        return true;  // Indica que a resposta será enviada de forma assíncrona
    }
});

// Função para obter o ID da aba ativa
function getTabId(): Promise<number> {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab?.id && tab.url?.startsWith("http")) {
                console.log("TAB ID: ", tab.id) //ESSE CONSOLE.LOG NAO APARECE
                resolve(tab.id);

            } else {
                reject("URL não é http ou https");
            }
        });
    });
}

// Função para injetar o script na aba ativa
function injectScript() {
    getTabId()
        .then((tabId) => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    // Função injetada na aba para capturar as teclas pressionadas
                    document.addEventListener('keydown', (event) => {
                        console.log("Tecla pressionada:", event.key); //ESSE CONSOLE.LOG NAO APARECE
                    });
                }
            });
        })
        .catch((error) => {
            console.error("Erro ao obter o ID da aba:", error);
        });
}

// Chama a função para injetar o script
injectScript();

export function toggleShortcutBox(isActive: boolean) {


    console.log("Entrou no toggleShortcutBox")
    const shortcutBox = document.querySelector('.shortcut-box') as HTMLElement;
    console.log("shortcutBox: ", shortcutBox)

    if (shortcutBox) {
        if (isActive) {
            const activeElement = document.activeElement as HTMLElement;

            const caretPosition = getCaretPositionXY2(activeElement)

            if (caretPosition) {
                shortcutBox.classList.remove("hiddenShortcutBox");
                shortcutBox.classList.add("showedShortcutBox");
                shortcutBox.style.display = 'block';  // Exibe a shortcut box
                shortcutBox.style.position = 'absolute';
                shortcutBox.style.top = `${caretPosition.y + 60}px`;  // 60 pixels abaixo do caret
                shortcutBox.style.left = `${caretPosition.x}px`;     // Posiciona horizontalmente baseado no caret
            }
        } else {
            shortcutBox.style.display = 'none';    // Esconde a shortcut box

        }
    } else {
        console.log("not in if of shortcutBox")
    }
}


//
//1 executar comando de atalho
//pegar a localizacao do input atual
//apresentar uma pequena caixa com um search e nesse search 