async function getPokemonData(id) {
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
      };
      console.log(pokemonData)
      return pokemonData;
  } catch (error) {
      console.error('Error:', error);
  }
}
getPokemonData(1);

fo