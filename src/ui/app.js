import { generateBreakPointMatrix, getRocketDefenderStats } from '../engine/calculator.js';

const attackerInput = document.getElementById('attackerInput');
const attackerList = document.getElementById('attackerList');
const fastMoveSelect = document.getElementById('fastMoveSelect');

const defenderInput = document.getElementById('defenderInput');
const defenderList = document.getElementById('defenderList');

const trainerLevelInput = document.getElementById('trainerLevel');
const rocketTypeSelect = document.getElementById('rocketTypeSelect');
const bestBuddyToggle = document.getElementById('bestBuddyToggle');
const oppCpDisplay = document.getElementById('oppCpDisplay');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');

let pokemonData = [];
let movesData = { fastMoves: {} };

let currentAttacker = null;
let currentDefender = null;

// Avoid unnecessary re-rendering if the same Pokémon is selected again
let lastAttackerId = null;
let lastDefenderId = null;

// Debounce function to limit the rate of function execution
function debounce(func, wait = 150) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Load Pokémon and Moves data from local JSON files
async function loadData() {
  try {
    const [pRes, mRes] = await Promise.all([
      fetch('./src/data/pokemon.json'),
      fetch('./src/data/moves.json')
    ]);
    pokemonData = await pRes.json();
    movesData = await mRes.json();

    initControls();
  } catch (err) {
    console.error('Error loading game data:', err);
  }
}

function updateAttackerDatalist(query = '') {
  const q = query.toLowerCase().trim();
  if (q.length < 2 && q.length > 0) return; // Search only after 2 characters

  const fragment = document.createDocumentFragment();
  const filtered = pokemonData.filter(mon => mon.name.toLowerCase().includes(q));

  filtered.slice(0, 30).forEach(mon => {
    const opt = document.createElement('option');
    opt.value = mon.name;
    fragment.appendChild(opt);
  });

  attackerList.innerHTML = '';
  attackerList.appendChild(fragment);
}

function updateDefenderDatalist(query = '') {
  const q = query.toLowerCase().trim();
  if (q.length < 2 && q.length > 0) return; // Search only after 2 characters

  const fragment = document.createDocumentFragment();
  const filtered = pokemonData.filter(mon => {
    const isMega = mon.isMega || mon.id.includes('_MEGA') || mon.name.toLowerCase().includes('mega');
    const isShadow = mon.isShadow || mon.id.includes('_SHADOW') || mon.name.toLowerCase().includes('shadow');
    return !isMega && !isShadow && mon.name.toLowerCase().includes(q);
  });

  filtered.slice(0, 30).forEach(mon => {
    const opt = document.createElement('option');
    opt.value = mon.name;
    fragment.appendChild(opt);
  });

  defenderList.innerHTML = '';
  defenderList.appendChild(fragment);
}

function resolveAttacker(query) {
  const q = query.toLowerCase().trim();
  if (!q) return currentAttacker || pokemonData[0];

  const exact = pokemonData.find(p => p.name.toLowerCase() === q);
  if (exact) return exact;

  const startsWith = pokemonData.find(p => p.name.toLowerCase().startsWith(q));
  if (startsWith) return startsWith;

  const contains = pokemonData.find(p => p.name.toLowerCase().includes(q));
  if (contains) return contains;

  return currentAttacker || pokemonData[0];
}

function resolveDefender(query) {
  const q = query.toLowerCase().trim();
  const validDefenders = pokemonData.filter(mon => {
    const isMega = mon.isMega || mon.id.includes('_MEGA') || mon.name.toLowerCase().includes('mega');
    const isShadow = mon.isShadow || mon.id.includes('_SHADOW') || mon.name.toLowerCase().includes('shadow');
    return !isMega && !isShadow;
  });

  if (!q) return currentDefender || validDefenders[0];

  const exact = validDefenders.find(p => p.name.toLowerCase() === q);
  if (exact) return exact;

  const startsWith = validDefenders.find(p => p.name.toLowerCase().startsWith(q));
  if (startsWith) return startsWith;

  const contains = validDefenders.find(p => p.name.toLowerCase().includes(q));
  if (contains) return contains;

  return currentDefender || validDefenders[0];
}

function initControls() {
  updateAttackerDatalist('');
  updateDefenderDatalist('');

  currentAttacker = pokemonData.find(p => p.id.includes('BULBASAUR')) || pokemonData[0];
  currentDefender = pokemonData.find(p => p.id === 'BULBASAUR') || pokemonData[0];

  attackerInput.value = currentAttacker.name;
  defenderInput.value = currentDefender.name;

  updateFastMoves();
  renderTableHeader();
  updateOpponentCp();
  renderMatrix();
}

function updateFastMoves() {
  fastMoveSelect.innerHTML = '';
  if (!currentAttacker || !currentAttacker.fastMoves) return;

  currentAttacker.fastMoves.forEach(moveId => {
    const move = movesData.fastMoves[moveId];
    if (move) {
      fastMoveSelect.add(new Option(move.name, move.id));
    }
  });
}

function updateOpponentCp() {
  const trainerLevel = parseInt(trainerLevelInput.value, 10) || 80;
  const rocketType = parseFloat(rocketTypeSelect.value) || 1.0;

  if (currentDefender) {
    const stats = getRocketDefenderStats(currentDefender, trainerLevel, rocketType);
    oppCpDisplay.textContent = `CP: ${stats.cp.toLocaleString()}`;
  } else {
    oppCpDisplay.textContent = 'CP: --';
  }
}

function renderTableHeader() {
  tableHeader.innerHTML = '<th>Lv \\ IV</th>';
  for (let iv = 15; iv >= 0; iv--) {
    const th = document.createElement('th');
    th.textContent = `Atk ${iv}`;
    tableHeader.appendChild(th);
  }
}

function renderMatrix() {
  const fastMove = movesData.fastMoves[fastMoveSelect.value];
  const trainerLevel = parseInt(trainerLevelInput.value, 10) || 80;
  const rocketType = parseFloat(rocketTypeSelect.value) || 1.0;
  const showBestBuddy = bestBuddyToggle.checked;

  if (!currentAttacker || !currentDefender || !fastMove) return;

  const { matrix, defenderStats } = generateBreakPointMatrix(
    currentAttacker, 
    fastMove, 
    currentDefender, 
    trainerLevel, 
    rocketType, 
    showBestBuddy
  );
  
  oppCpDisplay.textContent = `CP: ${defenderStats.cp.toLocaleString()}`;

  // Performance optimization: Use DocumentFragment to minimize reflows and repaints
  const fragment = document.createDocumentFragment();
  const bestTurns = matrix[0]?.ivs[0]?.turns || 1;

  matrix.forEach(row => {
    const tr = document.createElement('tr');
    
    const thLvl = document.createElement('th');
    thLvl.textContent = `Lv ${row.level.toFixed(1)}`;
    tr.appendChild(thLvl);

    row.ivs.forEach(cell => {
      const td = document.createElement('td');
      td.className = 'cell-turns';
      td.textContent = cell.turns;
      td.title = `Lv ${row.level.toFixed(1)} IV ${cell.iv} -> Dmg: ${cell.damage}, Hits: ${cell.hits}, Turns: ${cell.turns} (${(cell.turns * 0.5).toFixed(1)}s) | Def HP: ${Math.round(defenderStats.hp)}`;

      const diff = cell.turns - bestTurns;
      const stepHue = Math.max(0, 120 - diff * 10);
      td.style.backgroundColor = `hsl(${stepHue}, 60%, 25%)`;

      tr.appendChild(td);
    });

    fragment.appendChild(tr);
  });

  tableBody.innerHTML = '';
  tableBody.appendChild(fragment);

  // Save status
  lastAttackerId = currentAttacker.id;
  lastDefenderId = currentDefender.id;
}

// Handler with Debounce for smooth typing on mobile devices
const handleAttackerInput = debounce((query) => {
  updateAttackerDatalist(query);
  const resolved = resolveAttacker(query);

  if (resolved && resolved.id !== lastAttackerId) {
    currentAttacker = resolved;
    updateFastMoves();
    renderMatrix();
  }
}, 150);

const handleDefenderInput = debounce((query) => {
  updateDefenderDatalist(query);
  const resolved = resolveDefender(query);

  if (resolved && resolved.id !== lastDefenderId) {
    currentDefender = resolved;
    updateOpponentCp();
    renderMatrix();
  }
}, 150);

// Event-Listener
attackerInput.addEventListener('input', (e) => {
  const query = e.target.value;
  const exactMatch = pokemonData.some(p => p.name.toLowerCase() === query.trim().toLowerCase());
  if (exactMatch) e.target.blur();

  handleAttackerInput(query);
});

defenderInput.addEventListener('input', (e) => {
  const query = e.target.value;
  const exactMatch = pokemonData.some(mon => {
    const isMega = mon.isMega || mon.id.includes('_MEGA') || mon.name.toLowerCase().includes('mega');
    const isShadow = mon.isShadow || mon.id.includes('_SHADOW') || mon.name.toLowerCase().includes('shadow');
    return !isMega && !isShadow && mon.name.toLowerCase() === query.trim().toLowerCase();
  });
  if (exactMatch) e.target.blur();

  handleDefenderInput(query);
});

fastMoveSelect.addEventListener('change', renderMatrix);
trainerLevelInput.addEventListener('input', () => { updateOpponentCp(); renderMatrix(); });
rocketTypeSelect.addEventListener('change', () => { updateOpponentCp(); renderMatrix(); });
bestBuddyToggle.addEventListener('change', renderMatrix);

// Start the application
loadData();