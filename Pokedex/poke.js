/*
WHO'S THAT POKE(DEX)
Juego que combina "Quién es ese Pokemon", con la funcionalidad de un Pokedex. 
El objetivo principal es adivinar a qué Pokemon corresponde la silueta.
A medida que se van adivindando los distintos Pokemons, quedan "capturados" para ver sus datos básicos. 
*/

let pokemonArray = []; // Creación de un array vacío para almacenar los datos de los Pokemon.
let catched = []; // Creación de un array vacío para almacenar los Pokemon "atrapados" (adivinados).
let checkAnswer = () => {}; // Definición de una función vacía, se redefinirá para cada caso. La función es comprobar las respuestas del usuario.
let audio = new Audio("wtpsound.mp3");
let tooltip = document.getElementById("tooltip");
let score = 0;
let highScore = localStorage.getItem("highScore")
  ? parseInt(localStorage.getItem("highScore"))
  : 0;
document.getElementById("highscore").innerHTML = "Highscore: " + highScore;
const roman = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
};
const gen = [0, 151, 251, 386, 493, 649, 721, 809, 905, 1010]; // Array almacena la cantidad de Pokemones incluidos en cada generación, considerando todas las anteriores.

// Esta función asincrónica obtiene los datos de un Pokemon específico de la API PokeAPI.
const getPokeData = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pokemonData = {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      types: data.types.map((typeObj) => typeObj.type.name),
      artwork: data.sprites.other["official-artwork"].front_default,
      sprite: data.sprites.front_default,
    };
    pokemonArray.push(pokemonData);
    const img = new Image();
    img.src = pokemonData.artwork;
    return pokemonData;
  } catch (error) {
    console.error("Error:", error);
  }
};

/*  // Esta función asincrónica obtiene los datos de un número específico de Pokemon (según cada generación) utilizando la función getPokeData.
 Almacena las promesas en una Array y espera a que todas estén resueltas para ordenar la matriz resultante por ID del pokemon. */
const getPokemons = async (limit) => {
  pokemonArray = [];
  let promises = [];
  for (let i = 1; i <= limit; i++) {
    promises.push(getPokeData(i));
  }
  await Promise.all(promises);
  pokemonArray.sort((a, b) => a.id - b.id);
};

// Función principal del juego. "Elige" un Pokemon al azar, genera su silueta y define la función para validar la respuesta.
const whosThat = () => {
  document.getElementById("pokemon").style.display = "block"
  document.getElementById("answer").disabled = false;
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();

  if (pokemonArray.length === 0) {
    return; // If no more pokemons, exit the function
  }
  let randomIndex = Math.floor(Math.random() * pokemonArray.length);
  let currentPokemon = pokemonArray[randomIndex];
  let pick = currentPokemon.artwork;
  let hiddenPoke = document.createElement("img");
  hiddenPoke.src = pick;
  hiddenPoke.id = "hiddenPoke";
  hiddenPoke.classList.add("pokemon", "hidden-pokemon");
  document.getElementById("pokemon").append(hiddenPoke);
  document.querySelector("img").ondragstart = function () {
    return false;
  };
  //Cuando la respuesta es correcta, suma un punto al jugador y almacena el puntaje máximo. Elimina el Pokemon de la randomización, lo almacena en una Array de capturados y genera el sprite y tooltip para la funcionalidad de Pokedex.
  checkAnswer = (e) => {
    let typed = document.getElementById("answer").value;
    if (typed.toLowerCase() == currentPokemon.name) {
      document.getElementById("answer").disabled = true;
      document.getElementById("hiddenPoke").classList.remove("hidden-pokemon");
      score++;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore.toString());
        document.getElementById("highscore").innerHTML =
          "New highscore! " + highScore;
      }
      document.getElementById("counter").innerHTML = score;
      catched.push(currentPokemon.id);
      sprite = document.createElement("img");
      sprite.src = currentPokemon.sprite;
      sprite.id = currentPokemon.id;
      sprite.classList.add("sprite");
      let index = pokemonArray.findIndex((p) => p.id === currentPokemon.id);
      if (index > -1) {
        pokemonArray.splice(index, 1);
      }
      setTimeout(() => {
        document.getElementById("hiddenPoke")?.remove();
        document.getElementById("captured").prepend(sprite);
        currentSprite = document.getElementById(currentPokemon.id);
        currentSprite.style.order = currentPokemon.id;
        currentSprite.addEventListener("mouseover", (e) => {
          tooltip.style.display = "block";
          tooltip.style.left =
            e.clientX + window.scrollX - tooltip.offsetWidth / 2 + "px";
          tooltip.style.top =
            e.clientY + window.scrollY - tooltip.offsetHeight - 20 + "px";
          let types = "";
          currentPokemon.types.forEach((type) => {
            let typebadge = `<span class="type ${type} left">${type}</span>`;
            types += typebadge;
          });
          tooltip.innerHTML =
            `
            <span class="number">#${currentPokemon.id}</span><br>
            <span class="pokemonName">${currentPokemon.name}</span><br>
            <span class="stats">height: ${
              currentPokemon.height / 10
            } m</span><br>
            <span class="stats">weight: ${
              currentPokemon.weight / 10
            } kg</span><br>
            ` + types;
        });
        currentSprite.addEventListener("mousemove", (e) => {
          tooltip.style.left =
            e.clientX + window.scrollX - tooltip.offsetWidth / 2 + "px";
          tooltip.style.top =
            e.clientY + window.scrollY - tooltip.offsetHeight - 20 + "px";
        });
        currentSprite.addEventListener("mouseout", () => {
          tooltip.style.display = "none";
        });
        whosThat();
      }, 1000);
    }
  };
};

const description = [
  'Este juego es una versión interactiva de la popular frase "¿Quién es ese Pokémon?" del mundo Pokémon. <br> Los jugadores son presentados con una silueta oculta de un Pokémon y se les desafía a adivinar el nombre del Pokémon basándose en su silueta. <br> En cada turno, se presenta al jugador una imagen oculta de un Pokémon y un cuadro de entrada para escribir su respuesta. El jugador tiene que adivinar el nombre del Pokémon correctamente para avanzar.',
  'Cada vez que un jugador adivina correctamente, el Pokémon se revela y se añade a una colección de "Pokémon atrapados", mostrada en la pantalla. <br> Cada Pokémon atrapado correctamente incrementa la puntuación del jugador por 1., y queda disponible para ver más información al pasar el mouse por encima',
  'El juego cuenta con controles para saltar un turno en caso de que el jugador no pueda adivinar el Pokémon, así como la capacidad de seleccionar la generación de Pokémon que se quiere jugar antes de iniciar el juego.',
  'Preparado?'
]

const addDescription = () => {
  let container = document.getElementById("description");

  let currentDescriptionIndex = 0;

  // Función para actualizar el texto de la descripción.
  const updateDescription = () => {
    container.innerHTML = description[currentDescriptionIndex];
  };

  // Comienza mostrando el primer párrafo.
  updateDescription();

  let next = document.getElementById("next");

  // Cuando se presiona el botón, avanza al siguiente párrafo y lo muestra.
  next.addEventListener("click", () => {
    currentDescriptionIndex++;
    currentDescriptionIndex == description.length-1 ? next.innerText = "Jugar" : "";
    if (currentDescriptionIndex >= description.length) {
      document.getElementById("instructions").innerHTML = "Elige hasta qué generación de Pokémon quieres incluir"
      addSettings();
    }
    updateDescription();
  });
};



// Agrega las opciones iniciales. Hasta qué generación se quiere jugar. Para cada generación inicia el juego con X cantidad de Pokemons.
const addSettings = () => {
  for (i = 1; i < 10; i++) {
    let button = document.createElement("button");
    button.id = "GEN" + roman[i];
    button.classList.add("button");
    document.getElementById("settings").append(button);
    button = document.getElementById(button.id);
    button.innerHTML = "Up to GEN " + roman[i];
    let n = gen[i];
    button.addEventListener("click", () => initGame(n));
  }
};
//Agrega controles del juego. Input, boton Skip para saltarse el Pokemon.
const addControls = () => {
  let button = document.createElement("button");
  button.id = "play";
  button.classList.add("button");
  document.getElementById("controls").append(button);
  button = document.getElementById("play");
  button.innerHTML = "Skip";
  button.addEventListener("click", () => {
    document.getElementById("hiddenPoke")?.remove();
    whosThat();
  });
  let exit = document.createElement("button");
  exit.id = "exit";
  exit.classList.add("button");
  //document.getElementById("controls").append(exit);
  //exit = document.getElementById("exit");
  //exit.innerHTML = "Exit";
  //exit.addEventListener("click", resetGame);
  let input = document.createElement("input");
  input.type = "text";
  input.class = "text";
  input.id = "answer";
  document.getElementById("input").append(input);
  document.getElementById("counter").innerHTML = score;
  let answer = document.getElementById("answer");
  answer.addEventListener("keyup", (e) => {
    checkAnswer(e);
  });
};

// Innicia el juego, carga la cantidad de pokemons definida por la generación.
const initGame = (n) => {
  document.getElementById("settings").remove();
  document.getElementById("instructions").remove();
  document.getElementById("loading").style.display = "block";
  getPokemons(n).then(() => {
    document.getElementById("highscore").style.display = "block";
    let load = document.getElementById("loading");
    load.remove();
    addControls();
    whosThat();
    audio.play();
  });
};

addDescription();
