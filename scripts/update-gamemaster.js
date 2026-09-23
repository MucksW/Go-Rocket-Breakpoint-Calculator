import fs from 'node:fs';
import path from 'node:path';

const GM_API_URL = 'https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster.json';

async function updateGameMaster() {
  console.log('Loading latest GameMaster...');
  const response = await fetch(GM_API_URL);
  if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
  const rawGm = await response.json();

  const movesMap = {};
  if (Array.isArray(rawGm.moves)) {
    rawGm.moves.forEach(m => {
      if (m.cooldown !== undefined && m.energyGain !== undefined) {
        movesMap[m.moveId] = {
          id: m.moveId,
          name: m.name || m.moveId,
          type: (m.type || 'NORMAL').toUpperCase(),
          power: m.power || 0,
          turns: Math.max(1, Math.round(m.cooldown / 500))
        };
      }
    });
  }

  const pokemonList = [];
  if (Array.isArray(rawGm.pokemon)) {
    rawGm.pokemon.forEach(p => {
      if (!p.baseStats || !p.fastMoves) return;

      const isShadow = p.speciesId.endsWith('_shadow') || p.tags?.includes('shadow');
      const isMega = p.speciesId.includes('_mega') || p.tags?.includes('mega');

      pokemonList.push({
        id: p.speciesId.toUpperCase(),
        name: p.speciesName || p.speciesId,
        types: (p.types || []).map(t => t.toUpperCase()),
        baseStats: {
          atk: p.baseStats.atk || 100,
          def: p.baseStats.def || 100,
          hp: p.baseStats.hp || 100
        },
        fastMoves: p.fastMoves,
        isShadow: !!isShadow,
        isMega: !!isMega
      });
    });
  }

  const dataDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(path.join(dataDir, 'pokemon.json'), JSON.stringify(pokemonList, null, 2));
  fs.writeFileSync(path.join(dataDir, 'moves.json'), JSON.stringify({ fastMoves: movesMap }, null, 2));

  console.log('GameMaster data successfully generated!');
}

updateGameMaster().catch(err => {
  console.error(err);
  process.exit(1);
});