let pokemonArray = [];
let artArray = [];
let catched = [];
let checkAnswer = () => {};
let audio = new Audio("wtpsound.mp3");
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
const gen = [0, 151, 251, 386, 493, 649, 721, 809, 905, 1010];

const getPokeData = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pokemonData = {
      id: data.id,
      name: data.name,
      artwork: data.sprites.other["official-artwork"].front_default,
    };
    pokemonArray.push(pokemonData);
    const img = new Image();
    img.src = pokemonData.artwork;
    return pokemonData;
  } catch (error) {
    console.error("Error:", error);
  }
};

const getPokemons = async (limit) => {
  console.log("Generating " + limit);
  pokemonArray = [];
  let promises = [];
  for (let i = 1; i <= limit; i++) {
    promises.push(getPokeData(i));
  }
  await Promise.all(promises);
  pokemonArray.sort((a, b) => a.id - b.id);
};

const whosThat = () => {
  document.getElementById("hiddenPoke")?.remove();
  document.getElementById("answer").disabled = false;
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();

  if (pokemonArray.length === 0) {
    console.log("No more pokemons left!");
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
  checkAnswer = (e) => {
    let typed = document.getElementById("answer").value;
    console.log(typed);
    if (typed.toLowerCase() == currentPokemon.name) {
      document.getElementById("answer").disabled = true;
      document.getElementById("hiddenPoke").classList.remove("hidden-pokemon");
      score++;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore.toString());
        document.getElementById("highscore").innerHTML = highScore;
        console.log("New high score: " + highScore);
      }
      document.getElementById("counter").innerHTML = score;
      catched.push(currentPokemon.id);

      // Find the pokemon in the array and remove it
      let index = pokemonArray.findIndex((p) => p.id === currentPokemon.id);
      if (index > -1) {
        pokemonArray.splice(index, 1);
      }
      setTimeout(whosThat, 1000);
    }
  };
};

const addSettings = () => {
  for (i = 1; i < 10; i++) {
    let button = document.createElement("button");
    button.id = "GEN" + roman[i];
    button.classList.add("button");
    document.getElementById("settings").append(button);
    button = document.getElementById(button.id);
    button.innerHTML = "Up to GEN " + roman[i];
    let n = gen[i];
    console.log(n);
    button.addEventListener("click", () => initGame(n));
  }
};

const addControls = () => {
  let button = document.createElement("button");
  button.id = "play";
  button.classList.add("button");
  document.getElementById("controls").append(button);
  button = document.getElementById("play");
  button.innerHTML = "Skip";
  button.addEventListener("click", whosThat);
  let exit = document.createElement("button");
  exit.id = "exit";
  exit.classList.add("button");
  document.getElementById("controls").append(exit);
  exit = document.getElementById("exit");
  exit.innerHTML = "Exit";
  exit.addEventListener("click", addSettings);
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

const initGame = (n) => {
  document.getElementById("settings").remove();
  document.getElementById("loading").style.display = "block";
  getPokemons(n).then(() => {
    let load = document.getElementById("loading");
    load.remove();
    addControls();
    whosThat();
    audio.play();
  });
};

addSettings();
