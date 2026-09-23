import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POKEMON_URL = 'https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data/gamemaster/pokemon.json';
const MOVES_URL = 'https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data/gamemaster/moves.json';

// Helper for formatting fallback names if missing
function formatName(rawId) {
  if (!rawId) return '';
  return String(rawId)
    .replace(/_FAST$/, '')
    .replace(/_MEGA_X$/, ' Mega X')
    .replace(/_MEGA_Y$/, ' Mega Y')
    .replace(/_MEGA$/, ' Mega')
    .replace(/_PRIMAL$/, ' Primal')
    .replace(/_SHADOW$/, ' (Shadow)')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

async function buildGameMaster() {
  console.log('Downloading GameMaster data from PvPoke...');
  
  const [pokemonRes, movesRes] = await Promise.all([
    fetch(POKEMON_URL),
    fetch(MOVES_URL)
  ]);

  if (!pokemonRes.ok) throw new Error(`Failed to load Pokemon data: ${pokemonRes.status}`);
  if (!movesRes.ok) throw new Error(`Failed to load Moves data: ${movesRes.status}`);

  const rawPokemon = await pokemonRes.json();
  const rawMoves = await movesRes.json();

  console.log('Parsing Moves & Pokemon Data...');

  const fastMoves = {};
  const chargedMoves = {};

  // -------------------------------------------------------------
  // 1. COMBAT MOVES PARSING
  // -------------------------------------------------------------
  if (Array.isArray(rawMoves)) {
    rawMoves.forEach(move => {
      if (!move.moveId) return;

      const moveId = String(move.moveId);
      const name = move.name || formatName(moveId);
      const type = (move.type || 'NORMAL').toUpperCase();
      const power = move.power || 0;
      const cooldown = move.cooldown !== undefined ? move.cooldown : 500;
      const turns = Math.max(1, Math.round(cooldown / 500));

      const isFastMove = (move.energyGain && move.energyGain > 0) || 
                         move.archetype === 'Fast Move' || 
                         moveId.endsWith('_FAST');

      if (isFastMove) {
        fastMoves[moveId] = {
          id: moveId,
          name: name,
          type: type,
          power: power,
          energyDelta: move.energyGain || move.energy || 0,
          turns: turns
        };
      } else {
        chargedMoves[moveId] = {
          id: moveId,
          name: name,
          type: type,
          power: power,
          energyCost: Math.abs(move.energy || 0)
        };
      }
    });
  }

  // -------------------------------------------------------------
  // 2. POKEMON PARSING
  // -------------------------------------------------------------
  const pokemonList = [];

  if (Array.isArray(rawPokemon)) {
    rawPokemon.forEach(p => {
      if (!p.speciesId || !p.baseStats) return;

      const id = String(p.speciesId).toUpperCase();
      const isShadow = p.speciesId.endsWith('_shadow') || (Array.isArray(p.tags) && p.tags.includes('shadow'));
      const isMega = p.speciesId.includes('_mega') || p.speciesId.includes('_primal') || (Array.isArray(p.tags) && (p.tags.includes('mega') || p.tags.includes('primal')));

      pokemonList.push({
        id: id,
        dex: p.dex || 0,
        name: p.speciesName || formatName(id),
        baseStats: {
          atk: p.baseStats.atk || 0,
          def: p.baseStats.def || 0,
          hp: p.baseStats.hp || 0
        },
        types: (p.types || []).map(t => String(t).toUpperCase()),
        fastMoves: p.fastMoves || [],
        chargedMoves: p.chargedMoves || [],
        isShadow: isShadow,
        isMega: isMega
      });
    });
  }

  // -------------------------------------------------------------
  // 3. WRITE FILES TO DISK
  // -------------------------------------------------------------
  const dataDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const movesData = { fastMoves, chargedMoves };

  fs.writeFileSync(path.join(dataDir, 'moves.json'), JSON.stringify(movesData, null, 2));
  fs.writeFileSync(path.join(dataDir, 'pokemon.json'), JSON.stringify(pokemonList, null, 2));

  console.log(`GameMaster successfully built from PvPoke!`);
  console.log(`- Fast Moves: ${Object.keys(fastMoves).length}`);
  console.log(`- Charged Moves: ${Object.keys(chargedMoves).length}`);
  console.log(`- Total Pokémon/Forms: ${pokemonList.length}`);
}

buildGameMaster().catch(err => {
  console.error('Build failed:', err);
});