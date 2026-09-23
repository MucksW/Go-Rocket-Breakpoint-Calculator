import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_GAMEMASTER_URL = 'https://raw.githubusercontent.com/PokeMiners/game_masters/master/latest/latest.json';

// Convert IDs to readable names
function formatName(rawId) {
  if (!rawId) return '';
  
  let name = String(rawId)
    .replace(/_FAST$/, '')
    .replace(/_MEGA_X$/, ' Mega X')
    .replace(/_MEGA_Y$/, ' Mega Y')
    .replace(/_MEGA$/, ' Mega')
    .replace(/_PRIMAL$/, ' Primal')
    .replace(/_ALOLA$/, ' (Alola)')
    .replace(/_GALAR$/, ' (Galar)')
    .replace(/_HISUI$/, ' (Hisui)')
    .replace(/_PALDEA$/, ' (Paldea)')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());

  return name;
}

function cleanType(typeStr) {
  if (!typeStr) return null;
  return String(typeStr).replace('POKEMON_TYPE_', '').toUpperCase();
}

// Filter out cosmetic/duplicate forms and determine the ID
function getCanonicalId(pkm) {
  const baseId = String(pkm.pokemonId);
  const form = pkm.form ? String(pkm.form) : null;

  if (!form) return baseId;

  // Cosmetic forms that don't change stats or type are treated as the base Pokémon
  const isCosmetic = 
    form === baseId ||
    form.endsWith('_NORMAL') ||
    form.endsWith('_STANDARD') ||
    /_COPY_/.test(form) ||
    /_COSTUME/.test(form) ||
    /_NOEVOLVE/.test(form) ||
    /_\d{4}$/.test(form);

  return isCosmetic ? baseId : form;
}

async function buildGameMaster() {
  console.log('Downloading Raw Niantic GameMaster from PokéMiners...');
  const response = await fetch(RAW_GAMEMASTER_URL);
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  const rawData = await response.json();

  console.log('Parsing Moves & Deduplicating Pokémon Data...');

  const fastMoves = {};
  const chargedMoves = {};
  const pokemonMap = new Map();

  // Helper function to add or merge Pokémon data into the map
  function addOrMergePokemon(mon) {
    if (pokemonMap.has(mon.id)) {
      const existing = pokemonMap.get(mon.id);
      
      // Merge fast and charged moves
      existing.fastMoves = Array.from(new Set([...existing.fastMoves, ...mon.fastMoves]));
      existing.chargedMoves = Array.from(new Set([...existing.chargedMoves, ...mon.chargedMoves]));
      
      if (existing.baseStats.atk === 0 && mon.baseStats.atk > 0) {
        existing.baseStats = mon.baseStats;
      }
    } else {
      pokemonMap.set(mon.id, mon);
    }
  }

  rawData.forEach(entry => {
    const data = entry.data;
    if (!data) return;

    // -------------------------------------------------------------
    // 1. COMBAT MOVES PARSING
    // -------------------------------------------------------------
    if (data.combatMove) {
      const move = data.combatMove;
      if (!move.uniqueId) return;

      const moveId = String(move.uniqueId);
      const type = cleanType(move.type);
      const power = move.power || 0;
      const energyDelta = move.energyDelta || 0;
      const turns = (move.durationTurns !== undefined) ? move.durationTurns + 1 : 1;

      if (energyDelta > 0 || moveId.endsWith('_FAST')) {
        fastMoves[moveId] = {
          id: moveId,
          name: formatName(moveId),
          type: type,
          power: power,
          energyDelta: energyDelta,
          turns: turns
        };
      } else {
        chargedMoves[moveId] = {
          id: moveId,
          name: formatName(moveId),
          type: type,
          power: power,
          energyCost: Math.abs(energyDelta)
        };
      }
    }

    // -------------------------------------------------------------
    // 2. POKEMON SETTINGS PARSING (DEDUPLICATED)
    // -------------------------------------------------------------
    if (data.pokemonSettings) {
      const pkm = data.pokemonSettings;
      if (!pkm.pokemonId || !pkm.stats) return;

      const canonicalId = getCanonicalId(pkm);
      const templateId = entry.templateId ? String(entry.templateId) : '';
      const dex = parseInt(templateId.match(/^V(\d+)_/)?.[1] || '0', 10);

      const baseTypes = [cleanType(pkm.type), cleanType(pkm.type2)].filter(Boolean);

      // Merge fast moves and charged moves from both standard and elite moves
      const fastMovesList = Array.from(new Set([
        ...(pkm.quickMoves || []),
        ...(pkm.eliteQuickMove || [])
      ])).map(String);

      const chargedMovesList = Array.from(new Set([
        ...(pkm.cinematicMoves || []),
        ...(pkm.eliteCinematicMove || [])
      ])).map(String);

      // Base Pokémon Form
      const baseMon = {
        id: canonicalId,
        dex: dex || (pokemonMap.get(canonicalId)?.dex || 0),
        name: formatName(canonicalId),
        baseStats: {
          atk: pkm.stats.baseAttack || 0,
          def: pkm.stats.baseDefense || 0,
          hp: pkm.stats.baseStamina || 0
        },
        types: baseTypes,
        fastMoves: fastMovesList,
        chargedMoves: chargedMovesList,
        isShadow: false,
        isMega: false
      };
      
      addOrMergePokemon(baseMon);

      // Shadow Form
      if (pkm.shadow) {
        const shadowId = `${canonicalId}_SHADOW`;
        addOrMergePokemon({
          ...baseMon,
          id: shadowId,
          name: `Shadow ${formatName(canonicalId)}`,
          isShadow: true,
          isMega: false
        });
      }

      // Mega / Primal Evolutions
      if (pkm.tempEvoOverrides) {
        pkm.tempEvoOverrides.forEach(tempEvol => {
          if (!tempEvol.tempEvoId) return;

          const megaSuffix = String(tempEvol.tempEvoId).replace('TEMP_EVOLUTION_', '');
          const megaId = `${canonicalId}_${megaSuffix}`;

          const megaTypes = [
            cleanType(tempEvol.typeOverride1) || baseTypes[0],
            cleanType(tempEvol.typeOverride2) || baseTypes[1]
          ].filter(Boolean);

          const stats = tempEvol.stats || pkm.stats;

          addOrMergePokemon({
            id: megaId,
            dex: baseMon.dex,
            name: `${formatName(megaSuffix)} ${formatName(canonicalId)}`,
            baseStats: {
              atk: stats.baseAttack || baseMon.baseStats.atk,
              def: stats.baseDefense || baseMon.baseStats.def,
              hp: stats.baseStamina || baseMon.baseStats.hp
            },
            types: megaTypes,
            fastMoves: fastMovesList,
            chargedMoves: chargedMovesList,
            isShadow: false,
            isMega: true
          });
        });
      }
    }
  });

  const dataDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const finalPokemonList = Array.from(pokemonMap.values());
  const movesData = { fastMoves, chargedMoves };

  fs.writeFileSync(path.join(dataDir, 'moves.json'), JSON.stringify(movesData, null, 2));
  fs.writeFileSync(path.join(dataDir, 'pokemon.json'), JSON.stringify(finalPokemonList, null, 2));

  console.log(`GameMaster successfully built!`);
  console.log(`- Fast Moves: ${Object.keys(fastMoves).length}`);
  console.log(`- Charged Moves: ${Object.keys(chargedMoves).length}`);
  console.log(`- Total Unique Pokémon/Forms: ${finalPokemonList.length}`);
}

buildGameMaster().catch(err => {
  console.error('Build failed:', err);
});