import { useState, useEffect } from 'react';
import './main.scss';
import getPokemons from './pokemonList';

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [pokeArray, setPokeArray] = useState([]);

  // eslint-disable-next-line react/prop-types
  function PokemonBox({ name, pokemonImage }) {
    return (
      <div className='pokeBox'>
        <h2>{name}</h2>
        <img src={pokemonImage} alt={name} />
      </div>
    );
  }

  useEffect(() => {
    const pokeList = getPokemons(5);
    const fetchData = async () => {
      const dataPromises = pokeList.map(async (pokeName) => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokeName}`
          );
          if (!response) {
            throw new Error('Could not fetch pokemon image');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching ${pokeName}:`, error);
          return null;
        }
      });

      const results = await Promise.all(dataPromises);
    
      const filteredData = results.filter((data) => data !== null);

      setPokeArray(filteredData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/diglett')
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {pokemon ? (
        <div>
          <h2>{pokemon.name}</h2>
          <img
            src={pokemon.sprites.other.home.front_default}
            alt={pokemon.name}
          />
        </div>
      ) : (
        <p>Loading Pokémon data...</p>
      )}
      {pokeArray.map((pokemon) => {
        return (
          <PokemonBox
            key={pokemon.name}
            name={pokemon.name}
            pokemonImage={pokemon.sprites.other.home.front_default}
          ></PokemonBox>
        );
      })}
    </div>
  );
}

export default App;
