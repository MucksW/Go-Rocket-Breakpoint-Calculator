export async function loadGameMasterData() {
  try {
    const [pRes, mRes] = await Promise.all([
      fetch('./src/data/pokemon.json'),
      fetch('./src/data/moves.json')
    ]);

    if (!pRes.ok || !mRes.ok) throw new Error('Error loading GameMaster data');

    const pokemonData = await pRes.json();
    const movesData = await mRes.json();

    return { pokemonData, movesData };
  } catch (err) {
    console.error('Error loading GameMaster data:', err);
    return { pokemonData: [], movesData: { fastMoves: {} } };
  }
}