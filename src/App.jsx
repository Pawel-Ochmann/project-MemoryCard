import { useState, useEffect } from 'react';
import './main.scss';
import getPokemons from './pokemonList';

function App() {
  const [pokeArray, setPokeArray] = useState([]);
  const [pokeClicked, setPokeClicked] = useState([]);
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem('bestScore', 10)) || 0
  );
  const [difficulty, setDifficulty] = useState(parseInt(localStorage.getItem('difficulty', 10)) || 6);

  // eslint-disable-next-line react/prop-types
  function PokemonBox({ name, pokemonImage }) {
    return (
      <div
        className='pokeBox'
        onClick={() => {
          clickPokemon(name);
        }}
      >
        <img src={pokemonImage} alt={name} />
        <h2>{name}</h2>
      </div>
    );
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const clickPokemon = (key) => {
    if (pokeClicked.length > bestScore) {
      localStorage.setItem('bestScore', pokeClicked.length);
    }
    if (
      pokeClicked.find((e) => {
        return e === key;
      })
    ) {
      location.reload();
      return;
    }

    const clickedArray = [...pokeClicked];
    clickedArray.push(key);
    setPokeClicked(clickedArray);
    const shuffledPokeArray = shuffleArray([...pokeArray]);
    setPokeArray(shuffledPokeArray);
  };

  const resetBestScore = (e) => {
    e.preventDefault();
    localStorage.setItem('bestScore', 0);
    setBestScore(0);
  };

  const handleDifficultyInput = (e) => {
    localStorage.setItem('difficulty', e.target.value);
    setPokeClicked([]);
    setDifficulty(e.target.value);
  };

  useEffect(() => {
    const pokeList = getPokemons(difficulty);
    const fetchData = async () => {
      const dataPromises = pokeList.map(async (pokeName) => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokeName)}`
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
  }, [difficulty]);

  return (
    <>
      <header>
        <h1>Pokemon Memory Game</h1>
        <p>
          Get points by clicking on an image but don't click on any more than
          once!
        </p>
        <p>
          Choose difficulty level:{' '}
          <input
            type='range'
            min={6}
            max={24}
            step={6}
            value={difficulty}
            onChange={(e) => {
              handleDifficultyInput(e);
            }}
          />
        </p>
        <div className='scoreBox'>
          <p>Actual score:{pokeClicked.length}</p>
          <p>Best score: {bestScore}</p>
          <button onClick={resetBestScore}>Reset best score</button>
        </div>
      </header>
      <main>
        <div className='pokeContainer'>
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
      </main>
    </>
  );
}

export default App;
