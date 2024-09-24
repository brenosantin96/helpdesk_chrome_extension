let helpTexts = [
    { id: 1, shortcut: 'Pendiente', description: 'Texto bem legal e bem interessante sobre pendiente' },
    { id: 2, shortcut: 'Onboard', description: 'Texto bem legal e bem interessante sobre Onboarding' },
    { id: 3, shortcut: 'Pencierre', description: 'Texto bem legal e bem interessante sobre Pencierre' },
    { id: 4, shortcut: 'Citrix', description: 'Texto bem legal e bem interessante sobre Citrix' },
    { id: 5, shortcut: 'O365', description: 'Texto bem legal e bem interessante sobre O365' },
    { id: 6, shortcut: '53011', description: 'Texto bem legal e bem interessante sobre error 53011' },
    { id: 7, shortcut: 'Intunazo', description: 'Texto bem legal e bem interessante sobre Intunazo' }
];

// Função para criar e adicionar os templates dinamicamente
function renderHelpTexts() {
    // Selecionar o elemento UL onde os itens serão inseridos
    const templatesList = document.querySelector('.templates_list');

    if (!templatesList) return; // Certificar-se que o UL existe

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
            <div class="list-subtitle">${text.description}</div>
        `;

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

                    console.log("helpTexts: ", helpTexts)


                    //Adding button to expand extension
                    const toggleButton = document.getElementById("desk-container-toggle-button");
                    toggleButton?.addEventListener("click", () => {
                        desk_container.classList.toggle("open"); // Alterna a classe 'open'
                    });

                    const closeButton = document.getElementById("closeButton");
                    closeButton?.addEventListener("click", () => {
                        desk_container.remove();
                    });

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

                    // Adicionar os templates dinamicamente
                    renderHelpTexts();

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