//SERVICE WORKER PAGE
import axios from "axios";
import "../styles/styles.css"

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {

    if (tab.id && tab.url?.startsWith("http")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
        });
    }
});

//esse codigo vai ser executado pelo sendMessage enviado desde o contentStcript
chrome.runtime.onMessage.addListener(async (request: any, sender: any, sendResponse: (response?: any) => void) => {
    console.log("ENTROU NO runtime.onMessage.addListener");
    if (request.action === "getPokemonData") {

        axios.get("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=20")
            .then((response) => {
                console.log("Response: ", response.data)
                sendResponse({ success: true, data: response.data });
            })
            .catch((error: any) => {
                console.error("Erro ao buscar dados dos Pokémons:", error);
                sendResponse({ success: false, error: error.message });
            })

        // Retornar true garante que o canal de comunicação permaneça aberto para respostas assíncronas
        return true;
    }

    return true;
});













/*
Ele funciona como o cérebro da extensão,
gerenciando eventos como cliques no ícone da extensão,
mensagens, e até mesmo interações com outras partes da extensão (como content scripts).
}); */

//essa pagina nao tem acesso a DOM
//Executa em segundo plano
//Esse script é acionado por evento, requisicoes de rede, cliques etc.


//chrome.action: Use a API chrome.action para controlar o ícone da extensão na barra de ferramentas do Google Chrome
//chrome.runtime para recuperar o service worker, retornar detalhes sobre o manifesto, além de detectar e responder a eventos no ciclo de vida da extensão