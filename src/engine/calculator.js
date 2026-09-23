export const CPM_TABLE = {
  1.0: 0.094, 1.5: 0.1351374318, 2.0: 0.16639787, 2.5: 0.192650919, 3.0: 0.21573247, 3.5: 0.2365726613,
  4.0: 0.25572005, 4.5: 0.2735303812, 5.0: 0.29024988, 5.5: 0.3060573775, 6.0: 0.3210876, 6.5: 0.3354450362,
  7.0: 0.34921268, 7.5: 0.3624577511, 8.0: 0.3752356, 8.5: 0.387592416, 9.0: 0.39956728, 9.5: 0.4111935514,
  10.0: 0.4225, 10.5: 0.4329264091, 11.0: 0.44310755, 11.5: 0.4530599591, 12.0: 0.4627984, 12.5: 0.472336093, 
  13.0: 0.48168495, 13.5: 0.4908558003, 14.0: 0.49985844, 14.5: 0.508701765, 15.0: 0.51739395, 15.5: 0.5259425113,
  16.0: 0.5343543, 16.5: 0.5426357375, 17.0: 0.5507927, 17.5: 0.5588305862, 18.0: 0.5667545, 18.5: 0.5745691333,
  19.0: 0.5822789, 19.5: 0.5898879072, 20.0: 0.5974, 20.5: 0.6048236651, 21.0: 0.6121573, 21.5: 0.6194041216,
  22.0: 0.6265671, 22.5: 0.6336491432, 23.0: 0.64065295, 23.5: 0.6475809666, 24.0: 0.65443563, 24.5: 0.6612192524,
  25.0: 0.667934, 25.5: 0.6745818959, 26.0: 0.6811649, 26.5: 0.6876849038, 27.0: 0.69414365, 27.5: 0.70054287,
  28.0: 0.7068842, 28.5: 0.7131691091, 29.0: 0.7193991, 29.5: 0.7255756136, 30.0: 0.7317, 30.5: 0.7347410093,
  31.0: 0.7377695, 31.5: 0.7407855938, 32.0: 0.74378943, 32.5: 0.7467812109, 33.0: 0.74976104, 33.5: 0.7527290867,
  34.0: 0.7556855, 34.5: 0.7586303683, 35.0: 0.76156384, 35.5: 0.7644860647, 36.0: 0.76739717, 36.5: 0.7702972656,
  37.0: 0.7731865, 37.5: 0.7760649616, 38.0: 0.77893275, 38.5: 0.7817900548, 39.0: 0.784637, 39.5: 0.7874736075,
  40.0: 0.7903, 40.5: 0.792803968, 41.0: 0.79530001, 41.5: 0.797800015, 42.0: 0.8003, 42.5: 0.802799995,
  43.0: 0.8053, 43.5: 0.8078, 44.0: 0.81029999, 44.5: 0.812799985, 45.0: 0.81529999, 45.5: 0.81779999,
  46.0: 0.82029999, 46.5: 0.82279999, 47.0: 0.82529999, 47.5: 0.82779999, 48.0: 0.83029999, 48.5: 0.83279999,
  49.0: 0.83529999, 49.5: 0.83779999, 50.0: 0.84029999, 50.5: 0.84279999, 51.0: 0.84529999
};

export const CPMr_TABLE = {
  8: 0.29899919, 9: 0.352000237, 10: 0.399999797, 11: 0.443999946, 12: 0.487000316, 13: 0.529002368,
  14: 0.569000363, 15: 0.60800004, 16: 0.645999432, 17: 0.683000147, 18: 0.719999731, 19: 0.755000234,
  20: 0.795999765, 21: 0.808000267, 22: 0.820000947, 23: 0.831999838, 24: 0.843999565, 25: 0.855000198,
  26: 0.866999269, 27: 0.877999663, 28: 0.889999986, 29: 0.900999725, 30: 0.911996603, 31: 0.92299962,
  32: 0.934000373, 33: 0.944997787, 34: 0.954999924, 35: 0.965000153, 36: 0.976000071, 37: 0.985995412,
  38: 0.997000039, 39: 1.0069952, 40: 1.01599848, 41: 1.02600145, 42: 1.03600228, 43: 1.04599953,
  44: 1.05600107, 45: 1.06500006, 46: 1.07500029, 47: 1.08400011, 48: 1.09299958, 49: 1.10200143,
  50: 1.11099982, 51: 1.12, 52: 1.12799954, 53: 1.13699937, 54: 1.14499974, 55: 1.15299988,
  56: 1.16100001, 57: 1.16799998, 58: 1.17600024, 59: 1.1839999, 60: 1.19099939, 61: 1.19899976,
  62: 1.20600009, 63: 1.21400058, 64: 1.22099972, 65: 1.22899985, 66: 1.23599958, 67: 1.24299955,
  68: 1.25099993, 69: 1.2579999, 70: 1.2650001, 71: 1.26999998, 72: 1.27499998, 73: 1.28000009,
  74: 1.28499985, 75: 1.28999996, 76: 1.29500079, 77: 1.29999983, 78: 1.30500031, 79: 1.30999994,
  80: 1.31500006
};

export const TYPES = new Map([
  ["NORMAL", 0],
  ["FIRE", 1],
  ["WATER", 2],
  ["GRASS", 3],
  ["ELECTRIC", 4],
  ["ICE", 5],
  ["FIGHTING", 6],
  ["POISON", 7],
  ["GROUND", 8],
  ["FLYING", 9],
  ["PSYCHIC", 10],
  ["BUG", 11],
  ["ROCK", 12],
  ["GHOST", 13],
  ["DRAGON", 14],
  ["DARK", 15],
  ["STEEL", 16],
  ["FAIRY", 17]
]);

export const effectiveness_matrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -2, 0, 0, -1, 0],
  [0, -1, -1, 1, 0, 1, 0, 0, 0, 0, 0, 1, -1, 0, -1, 0, 1, 0],
  [0, 1, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, -1, 0, 0, 0],
  [0, -1, 1, -1, 0, 0, 0, -1, 1, -1, 0, -1, 1, 0, -1, 0, -1, 0],
  [0, 0, 1, -1, -1, 0, 0, 0, -2, 1, 0, 0, 0, 0, -1, 0, 0, 0],
  [0, -1, -1, 1, 0, -1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, -1, 0],
  [1, 0, 0, 0, 0, 1, 0, -1, 0, -1, -1, -1, 1, -2, 0, 1, 1, -1],
  [0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0, 0, -1, -1, 0, 0, -2, 1],
  [0, 1, 0, -1, 1, 0, 0, 1, 0, -2, 0, -1, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, -1, 0, 1, 0, 0, 0, 0, 1, -1, 0, 0, 0, -1, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, -1, 0, 0, 0, 0, -2, -1, 0],
  [0, -1, 0, 1, 0, 0, -1, -1, 0, -1, 1, 0, 0, -1, 0, 1, -1, -1],
  [0, 1, 0, 0, 0, 1, -1, 0, -1, 1, 0, 1, 0, 0, 0, 0, -1, 0],
  [-2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, -1, -2],
  [0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, -1, 0, -1],
  [0, -1, -1, 0, -1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 1],
  [0, -1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 1, 1, -1, 0]
];

export function getTypeEffectiveness(moveType, defenderTypes = []) {
  const moveIdx = TYPES.get(moveType?.toUpperCase());
  if (moveIdx === undefined) return 1.0;

  let totalExponent = 0;
  defenderTypes.forEach(defType => {
    const defIdx = TYPES.get(defType?.toUpperCase());
    if (defIdx !== undefined && effectiveness_matrix[moveIdx]) {
      totalExponent += effectiveness_matrix[moveIdx][defIdx];
    }
  });

  return Math.pow(1.6, totalExponent);
}

// Defender Stats
export function getRocketDefenderStats(defenderMon, trainerLevel, rocketType = 1.0) {
  const level = Math.min(Math.max(trainerLevel, 8), 80);
  const cpmr = CPMr_TABLE[level] || 1.0;

  const defender_staminaStat = defenderMon.baseStats?.hp ?? defenderMon.baseStats?.sta ?? defenderMon.baseStats?.stamina ?? 100;
  const defender_attackStat = defenderMon.baseStats?.atk ?? defenderMon.baseStats?.attack ?? 100;
  const defender_defenseStat = defenderMon.baseStats?.def ?? defenderMon.baseStats?.defense ?? 100;

  const opphp = Math.floor((defender_staminaStat + 15) * 3 / 5) * cpmr * rocketType;
  const oppatk = (defender_attackStat + Math.floor((2 / 3) * defender_attackStat + 25)) * cpmr * rocketType;
  const oppdef = (defender_defenseStat + 15) * cpmr * rocketType;
  const oppcp = Math.floor(Math.sqrt(opphp) * oppatk * Math.sqrt(oppdef) * 0.1);

  return {
    hp: opphp,
    atk: oppatk,
    def: oppdef,
    cp: oppcp,
    cpmr: cpmr
  };
}

// Fast Damage Calculation
export function calculateFastDamage(attacker, fastMove, attackerLevel, atkIv, defenderStats) {
  const cpm = CPM_TABLE[attackerLevel] || 0.7903;
  const shadowFactor = attacker.isShadow ? 1.2 : 1.0;
  const attacker_attackStat = attacker.baseStats?.atk ?? attacker.baseStats?.attack ?? 100;

  const myatk = (attacker_attackStat + atkIv) * cpm * shadowFactor;

  const stab = attacker.types.includes(fastMove.type) ? 1.2 : 1.0;
  const typeEff = getTypeEffectiveness(fastMove.type, attacker.defenderTypes || []);

  const modes = stab * typeEff;

  const damage = Math.floor(0.65 * fastMove.power * myatk / (defenderStats.def * 5 / 6) * modes) + 1;
  return damage;
}

// Breakpoint Matrix Generation
export function generateBreakPointMatrix(attacker, fastMove, defenderMon, trainerLevel, rocketType = 1.0, showBestBuddy = false) {
  const defenderStats = getRocketDefenderStats(defenderMon, trainerLevel, rocketType);
  attacker.defenderTypes = defenderMon.types;

  const matrix = [];
  const startLevel = showBestBuddy ? 51.0 : 50.0;

  for (let level = startLevel; level >= 1.0; level = Math.round((level - 0.5) * 10) / 10) {
    const row = { level: level, ivs: [] };
    
    for (let iv = 15; iv >= 0; iv--) {
      const dmg = calculateFastDamage(attacker, fastMove, level, iv, defenderStats);
      const hitsNeeded = Math.ceil(defenderStats.hp / dmg);
      const totalTurns = hitsNeeded * fastMove.turns;

      row.ivs.push({
        iv: iv,
        damage: dmg,
        hits: hitsNeeded,
        turns: totalTurns
      });
    }
    matrix.push(row);
  }

  return { matrix, defenderStats };
}