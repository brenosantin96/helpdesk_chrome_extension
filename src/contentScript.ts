import { consoleLogPokemon } from "./api";

function toggleSquare(): void {
    const existingSquare = document.querySelector("#bigSquareID");

    if (existingSquare) {
        // Se o quadrado já existe, removê-lo
        existingSquare.remove();
        console.log("Quadrado removido");
    } else {
        // Se o quadrado não existe, criá-lo
        const newDiv = document.createElement("div");
        newDiv.classList.add("big_square");
        newDiv.id = "bigSquareID";
        document.body.appendChild(newDiv);
        console.log("Quadrado criado");
        
        const poke_button = document.createElement("button");
        poke_button.classList.add("pokeButton");
        poke_button.innerHTML = "CONSULTAR POKEMONS"
        newDiv.appendChild(poke_button)
        poke_button.onclick = consoleLogPokemon;
    }
}

// Chame a função para alternar a criação e remoção do quadrado
toggleSquare();

