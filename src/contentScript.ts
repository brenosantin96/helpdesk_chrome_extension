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
