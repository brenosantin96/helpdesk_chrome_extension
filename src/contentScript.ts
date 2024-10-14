import { textToHtmlParagraph } from './utils';


type helpText = {
    id: number;
    shortcut: string;
    type_spanish: string
    type_english: string
}


let helpTexts: helpText[] = []
let counterHelpText = 0;

function firstGetTexts() {
    if (helpTexts.length === 0) {
        //sending message to background.ts to get all text Types
        chrome.runtime.sendMessage({ type: 'getHelpTexts' }, (response) => {
            if (response.error) {
                console.error('error to retrieve help texts. ', response.error);
            } else {
                helpTexts = response.helpTexts;
                console.log('HelpTexts:', helpTexts);
                renderHelpTexts();
            }
        });
    }
}

firstGetTexts();


function handleOnSearch(element: any, helptexts: helpText[]): helpText[] {

    // Filtering texts to match shortcut
    const filteredHelpTexts = helptexts.filter(helpText =>
        helpText.shortcut.toLowerCase().includes(element.value)
    );

    return filteredHelpTexts;

}

// update templates by search
function updateHelpTexts(filteredHelpTexts: helpText[]) {
    
    const templatesList = document.querySelector('.templates_list');

    if (!templatesList) return;

    templatesList.innerHTML = '';

    // Iterate in helpTexts
    filteredHelpTexts.forEach(text => {

        const li = document.createElement('li');
        li.classList.add('template_item'); 

        li.id = `${text.id}`;

        // Creating LI content
        li.innerHTML = `
            <div class="list-full-title">${text.shortcut}</div>
            <div class="list-subtitle">${text.type_spanish}</div>
        `;

        li.addEventListener('click', () => {
            console.log(`${li.id} sendo clicado`);
        });

        templatesList.appendChild(li);
    });
}


// render helpTexts dinamically
function renderHelpTexts() {

    const templatesList = document.querySelector('.templates_list');

    if (!templatesList) return; // Certificar-se que o UL existe
    templatesList.innerHTML = '';

    helpTexts.forEach(text => {

        const li = document.createElement('li');
        li.classList.add('template_item'); // Adicionar a classe

        li.id = `${text.id}`;

        li.innerHTML = `
            <div class="list-full-title">${text.shortcut}</div>
            <div class="list-subtitle">${text.type_spanish}</div>
        `;

        //adding event click on each LI that will open a new window!
        li.addEventListener('click', () => {

           
            const bodyContainer = document.querySelector("#content-body-container")
            const bodyContainerTemplate = document.querySelector("#content-body-container-template")

            //toggling classes
            bodyContainer?.classList.add("closed")
            bodyContainerTemplate?.classList.remove("closed")

            const button1toparea = document.querySelector("#button1toparea");
            const backButton = document.createElement("button")
            const imageInButton = document.createElement("img") as HTMLImageElement;


            //adding image
            if (imageInButton) {
                imageInButton.src = chrome.runtime.getURL("images/left-arrow-key.png");
                backButton.appendChild(imageInButton)
            }

            // getting button from div
            const button = button1toparea?.querySelector('button');
            if (button) {
                button.remove();
            }
            button1toparea?.appendChild(backButton)
            backButton.classList.add("button-header-container");


            //adding helpText to Text Template Area when clicked
            let triggerInput = document.querySelector(".trigger-input input") as HTMLInputElement;
            let bigTextInputTemplateTrigger = document.querySelector(".full-text-trigger");
            let textToPopulateInTemplateTrigger = helpTexts.find((item) => item.id.toString() === li.id.toString());
            if(textToPopulateInTemplateTrigger){
                if(triggerInput){
                    triggerInput.value = textToPopulateInTemplateTrigger.shortcut
                }
                if(bigTextInputTemplateTrigger){
                    bigTextInputTemplateTrigger.append(textToHtmlParagraph(textToPopulateInTemplateTrigger.type_spanish) as HTMLInputElement);
                }
            }

            //click event to go back
            backButton.addEventListener('click', () => {

                bodyContainer?.classList.remove("closed")
                bodyContainerTemplate?.classList.add("closed")
                imageInButton.src = chrome.runtime.getURL("images/home.png");

                if(triggerInput){
                    triggerInput.value = ""
                }
                if(bigTextInputTemplateTrigger){
                    bigTextInputTemplateTrigger.innerHTML = "";
                }

            })


            console.log(`${li.id} sendo clicado`);
        });

        templatesList.appendChild(li);
    });

    // updating counter
    counterHelpText = helpTexts.length;
    // updating DOM
    updateTemplateCounter();

}

function updateTemplateCounter() {
    const templateCounter = document.querySelector(".templateCounter");
    if (templateCounter) {
        templateCounter.innerHTML = `Templates (${counterHelpText})`;
    }
}


function toggleExtension() {

    const existing_desk_container = document.querySelector("#desk-container");


    if (existing_desk_container) {
        existing_desk_container.remove();

    } else {
        fetch(chrome.runtime.getURL("side_extension.html"))
            .then(response => {
                console.log(response);
                return response.text()
            })
            .then(html => {

                console.log("HTML: ", html)
                const container = document.createElement("div");
                container.innerHTML = html;
                document.body.appendChild(container);


                //adding css to the file
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = chrome.runtime.getURL('styles.css')
                document.head.appendChild(link);

                //getting main container
                const desk_container = document.querySelector("#desk-container");
                if (desk_container) {
                    desk_container.id = "desk-container";



                    //Adding button to expand extension
                    const toggleButton = document.getElementById("desk-container-toggle-button");
                    toggleButton?.addEventListener("click", () => {
                        desk_container.classList.toggle("open"); // Alterna a classe 'open'
                    });

                    const closeButton = document.getElementById("closeButton");
                    closeButton?.addEventListener("click", () => {
                        desk_container.remove();
                    });

                    // Alteração na função de busca para disparar com o evento 'input'
                    const searchbox = desk_container.querySelector(".searchbox-body-container-text");
                    if (searchbox) {
                        searchbox.addEventListener("input", (event) => {
                            const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
                            const filteredHelpTexts = handleOnSearch(searchbox, helpTexts);
                            updateHelpTexts(filteredHelpTexts);
                        });
                    }

                    //Button to toggle Templates
                    const arrowKeyTemplateButton = desk_container.querySelector(".arrowKeyTemplate");
                    if (arrowKeyTemplateButton) {

                        const templates_expanded = document.querySelector("#templatesDiv") as HTMLElement;
                        arrowKeyTemplateButton.addEventListener("click", () => {
                            if(templates_expanded){

                                templates_expanded.classList.toggle("templates_closed"); // Alterna a classe 'templates_closed' e "templates_expanded"
                    
                                

                                const iconToggler = document.querySelector(".templates_closed")
                                if(iconToggler){
                                    imageElementArrowKey.src = chrome.runtime.getURL("images/right-arrow-key.png");
                                    templates_expanded.style.right = "-900px";  // Modifica o estilo inline
                                } else {
                                    imageElementArrowKey.src = chrome.runtime.getURL("images/left-arrow-key.png");
                                    templates_expanded.style.right = "0px";  // Modifica o estilo inline

                                }
                            }
                        })
                    }

                    //Adding button to footer
                    const footerButton = desk_container.querySelector(".footer-body-container button")
                    if(footerButton){
                        footerButton.addEventListener("click", () => {
                            chrome.commands.onCommand("pressButton")
                        })
                    }

                    //Adding images
                    // Corrige o caminho da imagem dinamicamente
                    const imageElement = document.querySelector(".svgLupa img") as HTMLImageElement;
                    if (imageElement) {
                        imageElement.src = chrome.runtime.getURL("images/search_icon_png.png");
                    }

                    //Arrow key image button
                    const imageElementArrowKey = document.querySelector(".arrowKeyTemplate img") as HTMLImageElement;
                    if (imageElementArrowKey) {
                        imageElementArrowKey.src = chrome.runtime.getURL("images/left-arrow-key.png");
                    }

                    //Arrow key image button
                    const buttonHeaderContainerImg = document.querySelector(".button-header-container img") as HTMLImageElement;
                    if (buttonHeaderContainerImg) {
                        buttonHeaderContainerImg.src = chrome.runtime.getURL("images/home.png");
                    }


                }



            })
            .catch(err => console.error("Erro ao carregar o sidebar.html", err));
    }
}

toggleExtension();


//shortCutToggle

document.addEventListener('keydown', (event) => {
    // Verifica se o usuário está digitando em um input ou textarea
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === "DIV") {
        // Captura o valor digitado
        if (event.key === '/') {
            const currentInput = activeElement as HTMLInputElement | HTMLTextAreaElement;
            
            // Verifica se o valor anterior também era uma barra "/"
            if (currentInput.value.endsWith('/')) {
                // Aqui você pode exibir o shortcut-box
                const shortcutBox = document.querySelector('.shortcut-box') as HTMLElement;
                if (shortcutBox) {
                    shortcutBox.style.display = 'block';  // Exibe a caixa de atalhos
                }
            }
        }
    }
});


