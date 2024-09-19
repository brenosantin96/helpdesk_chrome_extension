
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

// Chama a função para alternar a criação e remoção do quadrado
toggleSquare();

*/

//Essa funcao é para ativar a extensao no navegador, em principio vai abrir a extensao deixando apenas o botao
//no meio verticalmente no canto direito da tela
function toggleExtension() {

    const existing_desk_container = document.querySelector("#desk-container");
    
    if (existing_desk_container) {
        existing_desk_container.remove();
        
    } else {
        fetch(chrome.runtime.getURL("side_extension.html"))
            .then(response => {
                console.log(response);
                return response.text()})
            .then(html => {
                console.log("HTML: ", html)

                const desk_container = document.createElement("div");
                desk_container.id = "desk-container";
                desk_container.innerHTML = html;

                //adding css to the file
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = chrome.runtime.getURL('styles.css')
                document.head.appendChild(link);

                //adding div to body
                document.body.appendChild(desk_container);

                //Adding button to expand extension
                const toggleButton = document.getElementById("desk-container-toggle-button");
                toggleButton?.addEventListener("click", () => {
                    desk_container.classList.toggle("open"); // Alterna a classe 'open'
                });
                

                const closeButton = document.getElementById("closeButton");

                closeButton?.addEventListener("click", () => {
                    desk_container.remove();
                });
                
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