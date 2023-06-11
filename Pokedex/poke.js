let pokemonArray = [];
let artArray = [];
let catched = [];

document.querySelector('img').ondragstart = function() { return false; };

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

let audio = new Audio('wtpsound.mp3');
function playAudio() {
    audio.play();
}
let count = 0;

const whosThat = () => {
    try {
        document.getElementById("hiddenPoke").remove();
        document.getElementById("answer").value = "";
        audio.pause();
    }
    catch (error) {
        console.log(error);
    }

    if (pokemonArray.length === 0) {
        console.log('No more pokemons left!');
        return;  // If no more pokemons, exit the function
    }

    let randomIndex = Math.floor(Math.random() * pokemonArray.length);
    let currentPokemon = pokemonArray[randomIndex];
    let pick = currentPokemon.artwork;

    let hiddenPoke = document.createElement("img");
    hiddenPoke.src = pick;
    hiddenPoke.id = "hiddenPoke";
    hiddenPoke.classList.add("pokemon", "hidden-pokemon");
    document.getElementById("pokemon").append(hiddenPoke);
    checkAnswer = (e) => {
        let typed = document.getElementById("answer").value;
        console.log(typed);

        if (pokemonArray.length === 0) {
            console.log('No more pokemons left!');
            return;  // If no more pokemons, exit the function
        }

        if (typed.toLowerCase() == currentPokemon.name) {
            document.getElementById("hiddenPoke").classList.remove("hidden-pokemon");
            count++;
            document.getElementById("counter").innerHTML = count;
            catched.push(currentPokemon.id);

            // Find the pokemon in the array and remove it
            let index = pokemonArray.findIndex(p => p.id === currentPokemon.id);
            if (index > -1) {
                pokemonArray.splice(index, 1);
            }
            console.log(pokemonArray);
            setTimeout(() => {
                document.getElementById("hiddenPoke").classList.add("captured");
            }, 1000);
            setTimeout(whosThat, 1000);
        }
    };
}

let checkAnswer = () => {};

const addControls = () => {
    let button = document.createElement("button")
    button.setAttribute("id", "play")
    button.setAttribute("class", "controls")
    document.getElementById("controls").append(button)
    button = document.getElementById("play")
    button.innerHTML = "Skip"
    button.addEventListener("click", whosThat)
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "text");
    input.setAttribute("id", "answer");
    document.getElementById("input").append(input);
    document.getElementById("counter").innerHTML = count
    let answer = document.getElementById("answer");
    answer.addEventListener("keyup", (e) => {
        checkAnswer(e);
    });
}


getPokemons(151).then(() => {
}).then(() => {
    let load = document.getElementById("loading");
    load.remove();
    addControls();
    addImages();
    whosThat();
    playAudio();
})



