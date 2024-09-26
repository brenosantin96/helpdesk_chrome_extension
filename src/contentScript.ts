type helpText = {
    id: number;
    shortcut: string;
    type_spanish: string
    type_english: string
}


let helpTexts: helpText[] = []

function firstGetTexts() {
    if (helpTexts.length === 0) {
        //sending message to background.ts to get all text Types
        chrome.runtime.sendMessage({ type: 'getHelpTexts' }, (response) => {
            if (response.error) {
                console.error('error to retrieve help texts. ', response.error);
            } else {
                helpTexts = response.helpTexts;
                console.log('HelpTexts:', helpTexts);

                // Aqui você chama renderHelpTexts depois que os textos são recebidos
                renderHelpTexts();
            }
        });
    }
}

firstGetTexts();


function handleOnSearch(element: any, helptexts: helpText[]): helpText[] {

    // Filtra os textos que correspondem ao shortcut
    const filteredHelpTexts = helptexts.filter(helpText =>
        helpText.shortcut.toLowerCase().includes(element.value)
    );

    return filteredHelpTexts;

}

// Função para atualizar os templates dinamicamente com base nos resultados da busca
function updateHelpTexts(filteredHelpTexts: helpText[]) {
    // Selecionar o elemento UL onde os itens serão inseridos
    const templatesList = document.querySelector('.templates_list');

    if (!templatesList) return; // Certificar-se que o UL existe

    // Limpar os itens anteriores
    templatesList.innerHTML = '';

    // Iterar sobre os helpTexts filtrados e criar os itens da lista
    filteredHelpTexts.forEach(text => {
        // Criar o elemento LI
        const li = document.createElement('li');
        li.classList.add('template_item'); // Adicionar a classe

        // Adicionar o ID ao LI
        li.id = `helpText-${text.id}`;

        //li.onclick = () => (console.log(`${li.id} sendo clicado`))

        // Criar o conteúdo HTML do LI
        li.innerHTML = `
            <div class="list-full-title">${text.shortcut}</div>
            <div class="list-subtitle">${text.type_spanish}</div>
        `;

        li.addEventListener('click', () => {
            console.log(`${li.id} sendo clicado`);
        });

        // Inserir o LI na lista
        templatesList.appendChild(li);
    });
}

//Devo ter um toggle se tem algum LI selecionado.
//Se tem algum LI selecionado, a content-body-container-template vai ser visivel


// Função para criar e adicionar os templates dinamicamente
function renderHelpTexts() {
    // Selecionar o elemento UL onde os itens serão inseridos
    const templatesList = document.querySelector('.templates_list');

    if (!templatesList) return; // Certificar-se que o UL existe

    //limpando lista atual
    templatesList.innerHTML = '';


    console.log("HelpTexts dentro de renderHelpTexts:", helpTexts)
    // Iterar sobre os helpTexts e criar os itens da lista
    helpTexts.forEach(text => {
        // Criar o elemento LI
        const li = document.createElement('li');
        li.classList.add('template_item'); // Adicionar a classe

        // Adicionar o ID ao LI
        li.id = `helpText-${text.id}`;

        // Criar o conteúdo HTML do LI
        li.innerHTML = `
            <div class="list-full-title">${text.shortcut}</div>
            <div class="list-subtitle">${text.type_spanish}</div>
        `;

        li.addEventListener('click', () => {
            //open a new WINDOW in TEMPLATE!
            const bodyContainer = document.querySelector("#content-body-container")
            const bodyContainerTemplate = document.querySelector("#content-body-container-template")
            const button1toparea = document.querySelector("#button1toparea");
            const backButton = document.createElement("button")
            const imageInButton = document.createElement("img") as HTMLImageElement;


            //adding image
            if (imageInButton) {
                imageInButton.src = chrome.runtime.getURL("images/left-arrow-key.png");
                backButton.appendChild(imageInButton)
            }


            // Localiza o botão dentro da div
            const button = button1toparea?.querySelector('button');
            if(button){
                button.remove();
            }
            button1toparea?.appendChild(backButton)
            backButton.classList.add("button-header-container-with-image");



            console.log(`${li.id} sendo clicado`);
        });

        // Inserir o LI na lista
        templatesList.appendChild(li);
    });
}

//Essa funcao é para ativar a extensao no navegador, em principio vai abrir a extensao deixando apenas o botao
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

                        const templates_expanded = document.querySelector("#templatesDiv")
                        console.log("templates_expanded:", templates_expanded)
                        arrowKeyTemplateButton.addEventListener("click", () => {
                            templates_expanded?.classList.toggle("templates_closed"); // Alterna a classe 'templates_closed' e "templates_expanded"
                        })
                    }

                    //Adding images
                    // Corrige o caminho da imagem dinamicamente
                    const imageElement = document.querySelector(".svgLupa img") as HTMLImageElement;
                    if (imageElement) {
                        imageElement.src = chrome.runtime.getURL("images/search_icon_png.png");
                    }

                    const imageElementArrowKey = document.querySelector(".arrowKeyTemplate img") as HTMLImageElement;
                    if (imageElementArrowKey) {
                        imageElementArrowKey.src = chrome.runtime.getURL("images/down-arrow-key.png");
                    }

                    //templateCounter
                    let templateCounter = desk_container.querySelector(".templateCounter")
                    if (templateCounter) {
                        templateCounter.innerHTML = `Templates (${helpTexts.length})`
                    }


                }





            })
            .catch(err => console.error("Erro ao carregar o sidebar.html", err));
    }
}

toggleExtension();





/* 
function toggleExtension() {

    const existingSidebar = document.querySelector("#sidebar-container");
    
    if (existingSidebar) {
        existingSidebar.remove();
        
    } else {
        fetch(chrome.runtime.getURL("src/side_extension.html"))
            .then(response => {
                console.log(response);
                return response.text()})
            .then(html => {
                console.log("HTML: ", html)
                
                //const sidebarContainer = document.createElement("div");
                //sidebarContainer.id = "sidebar-container";
                //sidebarContainer.innerHTML = html;
                //document.body.appendChild(sidebarContainer);
                //
                //const closeButton = document.getElementById("closeButton");
                //closeButton?.addEventListener("click", () => {
                //   sidebarContainer.remove();
                //});
            })
            .catch(err => console.error("Erro ao carregar o sidebar.html", err));
    }
}

toggleExtension(); 
*/



/*
function toggleSquare(): void {
    const existingSquare = document.querySelector("#bigSquareID");

    if (existingSquare) {
        existingSquare.remove();
        console.log("Quadrado removido");
    } else {
        // Cria o quadrado vermelho se não existir
        const newDiv = document.createElement("div");
        newDiv.classList.add("big_square");
        newDiv.id = "bigSquareID";
        document.body.appendChild(newDiv);
        console.log("Quadrado criado");
        
        const poke_button = document.createElement("button");
        poke_button.classList.add("pokeButton");
        poke_button.innerHTML = "CONSULTAR POKEMONS";
        newDiv.appendChild(poke_button);

        // Ao clicar no botão, envia a mensagem para o background
        poke_button.onclick = () => {
            console.log("ENTROU NO poke_button.onclick");
            
            chrome.runtime.sendMessage({ action: "getPokemonData" }, (response) => {
                // Verifica se a resposta foi recebida
                console.log("Response recebida: ", response);

                if (response && response.success) {
                    console.log("Dados dos Pokémons:", response.data);
                } else {
                    console.log("Erro ao buscar dados dos Pokémons");
                }
            });
        };
    }
}
*/