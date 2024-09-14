import axios from "axios"

export const consoleLogPokemon = async () => {
 
    console.log("Chamando a funcao")
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=20");
    if(response){
        console.log(response);
    } else {
        console.log("Nao foi possivel realizar a requisicao.")
    }

}