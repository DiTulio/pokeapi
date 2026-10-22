import { useState, useEffect } from "react";

export default function App() {
  const [id, setId] = useState(1);
  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarPokemon() {
      setCarregando(true);
      try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const dados = await resposta.json();
        setPokemon(dados);
      } catch (erro) {
        console.error('Erro ao buscar pokémon:', erro);
        setPokemon(null);
      } finally {
        setCarregando(false);
      }
    }
    buscarPokemon();
  }, [id]);

  // Buscando alternativas de imagens caso a principal da API falhe ou venha nula
  const imagemPokemon =
    pokemon?.sprites?.other?.['official-artwork']?.front_default ||
    pokemon?.sprites?.front_default ||
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Pokédex</h1>

        {carregando ? (
          <p className="text-gray-500 animate-pulse">Carregando...</p>
        ) : pokemon ? (
          <>
            <div className="bg-slate-100 rounded-xl p-4 mb-4 flex items-center justify-center min-h-[180px]">
              <img
                src={imagemPokemon}
                alt={pokemon.name}
                className="w-40 h-40 mx-auto object-contain"
                onError={(e) => {
                  // Fallback seguro caso a URL de imagem principal quebre
                  e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
                }}
              />
            </div>
            <p className="text-gray-400 font-semibold">#{pokemon.id}</p>
            <h2 className="text-2xl font-bold mb-4 capitalize text-slate-800">{pokemon.name}</h2>
            <div className="flex justify-center gap-2 mb-6">
              {pokemon.types?.map((tipo, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize font-medium"
                >
                  {tipo.type?.name}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mb-6 text-red-500">Não foi possível carregar o Pokémon.</p>
        )}

        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={() => setId((prev) => Math.max(1, prev - 1))}
            disabled={id === 1}
            className="px-4 py-2 bg-slate-800 text-white font-medium rounded-lg disabled:opacity-50 hover:bg-slate-700 transition"
          >
            Anterior
          </button>
          <button
            onClick={() => setId((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}