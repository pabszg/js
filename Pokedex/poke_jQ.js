let pokemonArray = [];
let artArray = [];
let catched = [];
let checkAnswer = () => {};
let audio = new Audio("wtpsound.mp3");
let score = 0;
let highScore = localStorage.getItem("highScore")
  ? parseInt(localStorage.getItem("highScore"))
  : 0;
$("#highscore").html("Highscore: " + highScore);
//...

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

//...

const whosThat = () => {
  $("#answer").prop("disabled", false);
  $("#answer").val("");
  $("#answer").focus();

  if (pokemonArray.length === 0) {
    return; // If no more pokemons, exit the function
  }
  let randomIndex = Math.floor(Math.random() * pokemonArray.length);
  let currentPokemon = pokemonArray[randomIndex];
  let pick = currentPokemon.artwork;
  let hiddenPoke = $("<img>");
  hiddenPoke.attr("src", pick);
  hiddenPoke.attr("id", "hiddenPoke");
  hiddenPoke.addClass("pokemon hidden-pokemon");
  $("#pokemon").append(hiddenPoke);
  $("img").on("dragstart", function () {
    return false;
  });
  //...

const addSettings = () => {
  for (i = 1; i < 10; i++) {
    let button = $("<button>");
    button.attr("id", "GEN" + roman[i]);
    button.addClass("button");
    $("#settings").append(button);
    button = $("#GEN" + roman[i]);
    button.html("Up to GEN " + roman[i]);
    let n = gen[i];
    button.on("click", () => initGame(n));
  }
};

const addControls = () => {
  let button = $("<button>");
  button.attr("id", "play");
  button.addClass("button");
  $("#controls").append(button);
  button = $("#play");
  button.html("Skip");
  button.on("click", () => {
    $("#hiddenPoke")?.remove();
    whosThat();
  });
  let input = $("<input>");
  input.attr("type", "text");
  input.attr("class", "text");
  input.attr("id", "answer");
  $("#input").append(input);
  $("#counter").html(score);
  let answer = $("#answer");
  answer.on("keyup", (e) => {
    checkAnswer(e);
  });
};

//...

addSettings();