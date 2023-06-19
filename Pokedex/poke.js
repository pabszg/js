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
let tooltip = document.getElementById("tooltip");

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
        document.getElementById("highscore").innerHTML = "New highscore! " + highScore;
        console.log("New high score: " + highScore);
      }
      document.getElementById("counter").innerHTML = score;
      catched.push(currentPokemon.id);
      console.log(catched);
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
          tooltip.style.left = e.clientX - tooltip.offsetWidth / 2 + "px";
          tooltip.style.top = e.clientY - tooltip.offsetHeight + "px";
          let types = "";
          currentPokemon.types.forEach((type) => {
            let typebadge = `<span class="type ${type} left">${type}</span>`;
            types += typebadge;
          });
          console.log(types);
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
          tooltip.style.left = e.clientX - tooltip.offsetWidth / 2 + "px";
          tooltip.style.top = e.clientY - tooltip.offsetHeight + "px";
        });
        currentSprite.addEventListener("mouseout", () => {
          tooltip.style.display = "none";
        });
        whosThat();
      }, 1000);
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

const resetGame = () => {
  Array.from(document.body.children).forEach((child) => {
    child.innerHTML = "";
  });
  set = document.createElement("div");
  set.id = "settings";
  document.body.append(set);
  addSettings();
};

addSettings();
