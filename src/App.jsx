import { useState, useEffect } from 'react';
import './main.scss';
import getPokemons from './pokemonList';

function App() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setPokemon(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(()=> {
    getPokemons(5);
    getPokemons(10);
    getPokemons(15);
  }, [])

  return (
    <div>
      {pokemon ? (
        <div>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites.other.home.front_default} alt={pokemon.name} />
         
        </div>
      ) : (
        <p>Loading Pokémon data...</p>
      )}
    </div>
  );
}

export default App;
