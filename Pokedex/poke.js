let pokemonArray = [];
let artArray = [];

const getPokeData = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const pokemonData = {
            id: data.id,
            name: data.name,
            types: data.types, 
            height: data.height,
            weight: data.weight,
            sprite: data.sprites.front_default,
            artwork : data.sprites.other['official-artwork'].front_default
        }
        pokemonArray.push(pokemonData);
        return pokemonData;

    } catch (error) {
        console.error('Error:', error);
    }
}


const getPokemons = async (limit) => {
    let promises = [];
    for (let i = 1; i <= limit; i++) {
        promises.push(getPokeData(i));
    }
    await Promise.all(promises);
    pokemonArray.sort((a, b) => a.id - b.id);
    console.log(pokemonArray);
    console.log(pokemonArray[1].name); // This should work now
}

const createImages = () => {
    pokemonArray.forEach(pokemon => {
        let img = document.createElement("img");
        img.setAttribute("src",pokemon.artwork);
        img.setAttribute("class", "pokemon")
        artArray.push(img);
    });
}
const addImages = () => {
    artArray.forEach(element => {
        document.body.append(element)
    });
}

const whosThat = () => {
    try {
        document.getElementById("hiddenPoke").remove();
        document.getElementById("answer").value = "";
    }
    catch (error) {
        console.log(error)
    }
    let random = Math.floor(Math.random() * pokemonArray.length);
    let pick = pokemonArray[random].artwork;
    let hiddenPoke = document.createElement("img");
    hiddenPoke.src = pick
    hiddenPoke.id = "hiddenPoke"
    hiddenPoke.classList.add("pokemon", "hidden-pokemon")
    document.getElementById("pokemon").append(hiddenPoke)
    let answer = document.getElementById("answer")
    answer.addEventListener("keyup", (e) => {
        let typed = document.getElementById("answer").value;
        console.log(typed)
        if (typed == pokemonArray[random].name) {
            document.getElementById("hiddenPoke").classList.remove("hidden-pokemon");
        }
    })
}

const addControls = () => {
    let button = document.createElement("button")
    button.setAttribute("id", "play")
    button.setAttribute("class", "controls")
    document.getElementById("controls").append(button)
    button = document.getElementById("play")
    button.innerHTML = "Play"
    button.addEventListener("click", whosThat)
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "text");
    input.setAttribute("id", "answer");
    document.getElementById("input").append(input);

}

getPokemons(151).then(() => {
}).then(() => {
    let load = document.getElementById("loading");
    load.remove();
    addControls();
    addImages();
})