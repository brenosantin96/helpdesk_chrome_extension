//SERVICE WORKER PAGE
import "../styles/styles.css"

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
    if (tab.id && tab.url?.startsWith("http")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
        });
    }
});


/*
// esse código será executado pelo sendMessage enviado desde o contentScript
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: (response?: any) => void) => {
    console.log("ENTROU NO runtime.onMessage.addListener");

    if (request.action === "getPokemonData") {
        // Fazendo a requisição à PokeAPI
        axios.get("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=20")
            .then((response) => {
                console.log("Response recebido da PokeAPI: ", response.data); // Aqui a resposta aparece corretamente
                // Envia a resposta de volta ao contentScript
                sendResponse({ success: true, data: response.data });
            })
            .catch((error: any) => {
                console.error("Erro ao buscar dados dos Pokémons:", error);
                sendResponse({ success: false, error: error.message });
            });

        // Retorna true para garantir que o canal de comunicação assíncrona permaneça aberto
        return true;
    }
});

*/