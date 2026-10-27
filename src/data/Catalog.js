// Complete Game Data Catalog for Unwritten World (Steam App ID 4314900 Clone)

export const LIFE_SKILLS = [
  {
    id: 'woodcutting',
    name: 'Woodcutting',
    icon: 'axe',
    color: '#6ec25a',
    description: 'Chop trees across every region—including emergent trees sprouted from Forager Goblin acorns—for logs, twigs, and resin.'
  },
  {
    id: 'mining',
    name: 'Mining',
    icon: 'pickaxe',
    color: '#67b7dc',
    description: 'Extract Tin, Copper, Coal, and Cobalt Crystal from Gibler\'s Mines and the Ashen Expanse.'
  },
  {
    id: 'crafting',
    name: 'Crafting',
    icon: 'anvil',
    color: '#e0a952',
    description: 'Forge weapons, class armor, tools, and jewelry. Every piece of equipment you craft is permanently inscribed with your name.'
  },
  {
    id: 'artificing',
    name: 'Artificing',
    icon: 'flask_purple',
    color: '#c471ed',
    description: 'Research items at the Artificing Station to gain item knowledge and salvage exclusive catalysts unavailable anywhere else.'
  },
  {
    id: 'cooking',
    name: 'Cooking',
    icon: 'pot',
    color: '#f08a4b',
    description: 'Prepare hearty meals over the Cooking Pot to grant long-lasting combat and gathering buffs.'
  },
  {
    id: 'monster_hunter',
    name: 'Monster Hunter',
    icon: 'skull',
    color: '#d9534f',
    description: 'Complete Bounty Board contracts, track regional monster populations, and unlock bonus Monster Card drop odds.'
  },
  {
    id: 'imbuing',
    name: 'Imbuing',
    icon: 'scroll_glow',
    color: '#5bc0de',
    description: 'Enhance weapons and armor using regional scrolls and Artificing catalysts to push gear to higher star tiers.'
  },
  {
    id: 'processing',
    name: 'Processing',
    icon: 'sawmill',
    color: '#b89768',
    description: 'Refine raw timber at the Sawmill and smelt raw ore at the Stone Forge into planks, shafts, cloth, and metal ingots.'
  },
  {
    id: 'taming',
    name: 'Taming',
    icon: 'paw',
    color: '#e67e22',
    description: 'Befriend wild companions like the Crimson Finch, Sproutling, and Spirit Stag to follow you and auto-collect nearby loot.'
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    icon: 'vial',
    color: '#2ecc71',
    description: 'Brew restorative health & mana potions, essence draughts, and lucky drop elixirs from regional herbs and monster parts.'
  }
];

export const CLASSES = {
  castaway: {
    id: 'castaway',
    name: 'Castaway',
    archetype: 'Castaway',
    color: '#5ec8e5',
    difficulty: 'Simple',
    weaponType: 'Club / Driftwood',
    description: 'Washed ashore on Driftwood Shores with nothing but determination. Advance freely into any of the 8 specialist classes at any level!',
    baseStats: { hp: 160, mp: 80, atk: 16, spellPower: 12, def: 8, critChance: 0.12, dodgeChance: 0.06, speed: 225 },
    visual: { hairColor: '#3dd4f5', hat: 'none', outfitColor: '#9c7a54', capeColor: null, weaponStyle: 'driftwood_blade' },
    skills: [
      { id: 'tidal_slash', slot: '1', name: 'Tidal Slash', mpCost: 0, cooldown: 0.45, range: 95, hits: 2, dmgMult: 1.15, vfx: 'water_slash', desc: 'Swift two-hit driftwood strike wrapped in seafoam.' },
      { id: 'pebble_toss', slot: '2', name: 'Skip Stone', mpCost: 8, cooldown: 2.2, range: 320, hits: 1, dmgMult: 1.55, projectile: 'pebble', vfx: 'water_burst', desc: 'Hurls a skipping coastal stone that ricochets through targets.' },
      { id: 'sea_breeze', slot: '3', name: 'Sea Breeze', mpCost: 14, cooldown: 8.0, buff: { id: 'breeze', name: 'Sea Breeze', duration: 18, healPct: 0.2, speedBonus: 0.15, icon: 'water_wave' }, vfx: 'heal_green', desc: 'Restores 20% HP and increases movement speed for 18s.' },
      { id: 'drift_bash', slot: '4', name: 'Breaker Bash', mpCost: 12, cooldown: 3.5, range: 120, hits: 3, dmgMult: 1.05, vfx: 'heavy_arc', desc: 'Crashing 3-hit overhead slam that staggers nearby foes.' },
      { id: 'survivor_grit', slot: '5', name: 'Castaway Grit', mpCost: 16, cooldown: 10.0, shieldPct: 0.25, buff: { id: 'grit', name: 'Survivor Grit', duration: 20, defBonus: 12, icon: 'shield_up' }, vfx: 'gold_shield', desc: 'Grants a protective Ward Shield equal to 25% Max HP.' },
      { id: 'uncharted_surge', slot: 'R', name: 'Unwritten Surge', mpCost: 22, cooldown: 9.0, range: 180, hits: 5, dmgMult: 0.95, vfx: 'water_geyser', desc: 'Unleashes 5 surging geysers around you.' }
    ]
  },

  bushido: {
    id: 'bushido',
    name: 'Bushido',
    archetype: 'Warrior',
    color: '#ff4d6d',
    difficulty: 'Fast-Paced / High Attention',
    weaponType: 'Katana',
    description: 'Master of the katana who builds Bushido Focus (武) with rapid crimson-petal strikes and screen-slicing iaijutsu dashes.',
    baseStats: { hp: 220, mp: 110, atk: 28, spellPower: 14, def: 12, critChance: 0.28, dodgeChance: 0.16, speed: 265 },
    visual: { hairColor: '#24242c', hat: 'samurai_headband', outfitColor: '#2f3d32', capeColor: '#8c1d40', weaponStyle: 'katana', aura: 'bushido_kanji' },
    skills: [
      { id: 'sakura_izanagi', slot: '1', name: 'Sakura Iai Slash', mpCost: 0, cooldown: 0.38, range: 125, hits: 3, dmgMult: 1.05, vfx: 'sakura_slash', desc: 'Lightning-fast 3-hit katana combo scattering cherry blossom petals.' },
      { id: 'crimson_crescent', slot: '2', name: 'Crimson Crescent', mpCost: 12, cooldown: 2.0, range: 220, hits: 2, dmgMult: 1.65, projectile: 'crimson_wave', vfx: 'crimson_arc', desc: 'Projects twin dark-crimson blade crescents forward.' },
      { id: 'bushido_focus', slot: '3', name: 'Way of Bushido (武)', mpCost: 18, cooldown: 12.0, buff: { id: 'bushido_stance', name: 'Bushido Focus', duration: 25, critBonus: 0.2, atkBonus: 0.25, icon: 'kanji_bu' }, vfx: 'bushido_aura', desc: 'Manifests the 武 seal overhead, boosting Critical Chance +20% and Attack +25%.' },
      { id: 'shadow_iaijutsu', slot: '4', name: 'Severing Horizon', mpCost: 16, cooldown: 3.2, range: 260, hits: 4, dmgMult: 1.25, dash: 130, vfx: 'black_pink_cuts', desc: 'Dashes forward through enemies, leaving 4 delayed dark-magenta dimensional cuts.' },
      { id: 'petal_parry', slot: '5', name: 'Steel & Petal Ward', mpCost: 15, cooldown: 8.0, shieldPct: 0.22, buff: { id: 'petal_ward', name: 'Petal Ward', duration: 15, dodgeBonus: 0.2, icon: 'shield_up' }, vfx: 'sakura_slash', desc: 'Wraps the blade in swirling petals, granting a Ward Shield and +20% Dodge.' },
      { id: 'thousand_blossoms', slot: 'R', name: 'Thousand Blossoms', mpCost: 30, cooldown: 8.5, range: 250, hits: 7, dmgMult: 1.12, vfx: 'black_pink_cuts', desc: 'Ultimate iaijutsu storm slicing every nearby monster 7 times in black-and-pink flashes.' }
    ]
  },

  elementalist: {
    id: 'elementalist',
    name: 'Elementalist',
    archetype: 'Mage',
    color: '#56b4e9',
    difficulty: 'Medium / Combo Caster',
    weaponType: 'Skull Staff',
    description: 'Versatile spellcaster cycling between Arcane Void Orbs, Solar Fireballs, and Freezing Glacier Shards for massive elemental bursts.',
    baseStats: { hp: 175, mp: 240, atk: 14, spellPower: 34, def: 9, critChance: 0.22, dodgeChance: 0.08, speed: 230 },
    visual: { hairColor: '#4a3525', hat: 'wizard_hat_blue', outfitColor: '#1e64b4', capeColor: '#472c82', weaponStyle: 'skull_staff', aura: 'arcane_orbs' },
    skills: [
      { id: 'arcane_volley', slot: '1', name: 'Void Rune Bolt', mpCost: 4, cooldown: 0.45, range: 360, hits: 2, dmgMult: 1.15, projectile: 'void_orb', vfx: 'purple_magic', desc: 'Fires twin geometric purple rune bolts that home in on monsters.' },
      { id: 'glacier_spikes', slot: '2', name: 'Glacier Spikes', mpCost: 16, cooldown: 2.6, range: 280, hits: 4, dmgMult: 1.25, vfx: 'ice_glacier', desc: 'Erupts crystalline ice spires from the ground, freezing targets in solid ice blocks.' },
      { id: 'meteor_ring', slot: '3', name: 'Solar Fireball Ring', mpCost: 22, cooldown: 3.8, range: 310, hits: 3, dmgMult: 1.68, projectile: 'fireball', vfx: 'solar_ring', desc: 'Launches blazing fireballs that detonate in a radiant solar ring.' },
      { id: 'mana_conduit', slot: '4', name: 'Elemental Conduit', mpCost: 10, cooldown: 10.0, buff: { id: 'conduit', name: 'Elemental Conduit', duration: 24, atkBonus: 0.28, mpRegenBonus: 12, icon: 'elem_crest' }, vfx: 'ice_glacier', desc: 'Restores 35% Mana and empowers Spell Power by +28% for 24s.' },
      { id: 'frost_barrier', slot: '5', name: 'Crystalline Ward', mpCost: 18, cooldown: 9.0, shieldPct: 0.35, vfx: 'ice_glacier', desc: 'Encases you in a refracting frost barrier equal to 35% Max HP.' },
      { id: 'cataclysm_tempest', slot: 'R', name: 'Tri-Elemental Cataclysm', mpCost: 38, cooldown: 9.5, range: 320, hits: 6, dmgMult: 1.35, vfx: 'sky_lances', desc: 'Calls down a wide celestial ring of ice lances, firebursts, and arcane lightning.' }
    ]
  },

  templar: {
    id: 'templar',
    name: 'Templar',
    archetype: 'Warrior',
    color: '#f5c542',
    difficulty: 'Balanced / Durable',
    weaponType: 'Mace & Greatshield',
    description: 'Radiant holy warrior who hurls golden light spears, fortifies the grey Ward Shield bar, and smites monsters with solar decrees.',
    baseStats: { hp: 285, mp: 150, atk: 24, spellPower: 24, def: 22, critChance: 0.18, dodgeChance: 0.08, speed: 225 },
    visual: { hairColor: '#d4e157', hat: 'laurel_crown', outfitColor: '#c9a236', capeColor: '#f5f0d5', weaponStyle: 'sun_spear_shield', aura: 'holy_ring' },
    skills: [
      { id: 'radiant_lance', slot: '1', name: 'Radiant Lance', mpCost: 0, cooldown: 0.48, range: 260, hits: 2, dmgMult: 1.2, projectile: 'gold_lance', vfx: 'holy_burst', desc: 'Hurls a piercing spear of golden sunlight across the platform.' },
      { id: 'sacred_scripture', slot: '2', name: 'Scroll of Light', mpCost: 14, cooldown: 3.0, range: 190, hits: 3, dmgMult: 1.28, vfx: 'holy_burst', desc: 'Unfurls a sacred decree that scorches all nearby monsters and heals you for 12% HP.' },
      { id: 'zealot_rush', slot: '3', name: 'Zealot Rush', mpCost: 12, cooldown: 3.5, range: 210, hits: 2, dmgMult: 1.4, dash: 110, vfx: 'holy_burst', desc: 'Charges forward in a flash of white-gold light, cleaving through monsters.' },
      { id: 'holy_cross_smite', slot: '4', name: 'Judgment Cross', mpCost: 20, cooldown: 4.5, range: 220, hits: 4, dmgMult: 1.32, vfx: 'lightning_pillar', desc: 'Calls down a towering pillar of sacred lightning onto the target.' },
      { id: 'solar_aegis', slot: '5', name: 'Solar Aegis', mpCost: 18, cooldown: 8.0, shieldPct: 0.45, buff: { id: 'solar_aegis', name: 'Solar Aegis', duration: 22, defBonus: 20, atkBonus: 0.18, icon: 'sun_emblem' }, vfx: 'gold_shield', desc: 'Grants a massive 45% Max HP Ward Shield and +20 Defense.' },
      { id: 'heavens_verdict', slot: 'R', name: 'Heaven\'s Verdict', mpCost: 32, cooldown: 9.0, range: 270, hits: 6, dmgMult: 1.25, vfx: 'holy_burst', desc: 'Summons 6 consecrated sun-crests that erupt in unison.' }
    ]
  },

  juggernaut: {
    id: 'juggernaut',
    name: 'Juggernaut',
    archetype: 'Warrior',
    color: '#e65100',
    difficulty: 'Simple / Heavy Bruiser',
    weaponType: 'Greatsword & Warshield',
    description: 'Unstoppable frontline powerhouse who cleaves whole platforms with sweeping fiery arcs and shrugs off boss hits.',
    baseStats: { hp: 320, mp: 100, atk: 31, spellPower: 10, def: 26, critChance: 0.2, dodgeChance: 0.06, speed: 230 },
    visual: { hairColor: '#d94f5c', hat: 'red_war_helm', outfitColor: '#7a2e2e', capeColor: '#b71c1c', weaponStyle: 'greatsword_shield' },
    skills: [
      { id: 'molten_cleave', slot: '1', name: 'Molten Cleave', mpCost: 0, cooldown: 0.45, range: 135, hits: 2, dmgMult: 1.3, vfx: 'molten_arc', desc: 'Wide sweeping greatsword arc scattering glowing embers and rock shards.' },
      { id: 'iron_bulwark', slot: '2', name: 'Iron Bulwark', mpCost: 12, cooldown: 9.0, shieldPct: 0.4, buff: { id: 'bulwark', name: 'Iron Bulwark', duration: 20, defBonus: 25, icon: 'shield_up' }, vfx: 'gold_shield', desc: 'Fortifies your stance with a 40% HP Ward Shield and +25 Defense.' },
      { id: 'titan_war_cry', slot: '3', name: 'Titan Warcry', mpCost: 15, cooldown: 11.0, buff: { id: 'warcry', name: 'Titan Warcry', duration: 24, atkBonus: 0.3, critBonus: 0.12, icon: 'warcry_up' }, vfx: 'molten_arc', desc: 'Roars with volcanic fury, boosting Attack Damage by +30%.' },
      { id: 'whirlwind_tempest', slot: '4', name: 'Whirlwind Tempest', mpCost: 16, cooldown: 3.0, range: 165, hits: 4, dmgMult: 1.15, dash: 70, vfx: 'whirlwind_slash', desc: 'Spins into a steel cyclone that hits all surrounding foes 4 times.' },
      { id: 'shattering_slam', slot: '5', name: 'Shattering Slam', mpCost: 18, cooldown: 4.0, range: 190, hits: 3, dmgMult: 1.45, vfx: 'molten_arc', desc: 'Crushes the platform with a shockwave of molten fragments.' },
      { id: 'guillotine_decree', slot: 'R', name: 'Juggernaut Guillotine', mpCost: 28, cooldown: 8.5, range: 230, hits: 5, dmgMult: 1.4, vfx: 'lightning_pillar', desc: 'Drops a colossal ancestral blade from the sky for 5 devastating hits.' }
    ]
  },

  forest_warden: {
    id: 'forest_warden',
    name: 'Forest Warden',
    archetype: 'Ranger',
    color: '#4cd964',
    difficulty: 'Simple / Sustain & Summons',
    weaponType: 'Living Greatbow',
    description: 'Guardian of Namu Forest who commands emerald spore clouds, healing nature rain, and a spectral Spirit Stag companion.',
    baseStats: { hp: 235, mp: 165, atk: 24, spellPower: 25, def: 15, critChance: 0.2, dodgeChance: 0.14, speed: 245 },
    visual: { hairColor: '#523628', hat: 'leaf_wreath', outfitColor: '#2e6b3e', capeColor: '#1b4d2e', weaponStyle: 'nature_bow', aura: 'nature_spores' },
    skills: [
      { id: 'thorn_arrow', slot: '1', name: 'Bramble Shot', mpCost: 0, cooldown: 0.42, range: 370, hits: 2, dmgMult: 1.15, projectile: 'emerald_arrow', vfx: 'emerald_burst', desc: 'Looses twin thorn-wrapped arrows that burst into emerald spores.' },
      { id: 'toxic_bloom', slot: '2', name: 'Venom Spore Orb', mpCost: 14, cooldown: 2.8, range: 310, hits: 3, dmgMult: 1.25, projectile: 'spore_orb', vfx: 'emerald_burst', desc: 'Launches a pulsing green spore sphere that erupts repeatedly on impact.' },
      { id: 'spirit_stag_call', slot: '3', name: 'Call Spirit Stag', mpCost: 20, cooldown: 5.0, range: 340, hits: 4, dmgMult: 1.35, projectile: 'spirit_stag', vfx: 'emerald_burst', desc: 'Summons a glowing cyan-emerald Spirit Stag that stampedes through enemies.' },
      { id: 'canopy_blessing', slot: '4', name: 'Canopy Blessing', mpCost: 18, cooldown: 10.0, buff: { id: 'canopy', name: 'Canopy Blessing', duration: 24, healPct: 0.25, atkBonus: 0.22, icon: 'leaf_crest' }, vfx: 'heal_green', desc: 'Heals 25% HP and surrounds you with rejuvenating forest spirits.' },
      { id: 'barkskin_ward', slot: '5', name: 'Ancient Barkskin', mpCost: 16, cooldown: 8.5, shieldPct: 0.32, vfx: 'heal_green', desc: 'Hardens your armor like Wood Golem bark, granting a 32% HP Ward Shield.' },
      { id: 'emerald_downpour', slot: 'R', name: 'Emerald Starfall', mpCost: 30, cooldown: 8.5, range: 320, hits: 6, dmgMult: 1.22, vfx: 'emerald_rain', desc: 'Rains glowing emerald crystals across the entire platform.' }
    ]
  },

  ranger: {
    id: 'ranger',
    name: 'Ranger',
    archetype: 'Ranger',
    color: '#8bc34a',
    difficulty: 'Medium / Long-Range Marksman',
    weaponType: 'Composite Bow',
    description: 'High-precision bow master who crafts specialized arrows, sets hunting snares, and peppers monsters from across the map.',
    baseStats: { hp: 195, mp: 140, atk: 29, spellPower: 14, def: 11, critChance: 0.3, dodgeChance: 0.18, speed: 260 },
    visual: { hairColor: '#69d2e7', hat: 'boar_pelt_hood', outfitColor: '#4e5d38', capeColor: '#3b2d22', weaponStyle: 'hunter_bow' },
    skills: [
      { id: 'rapid_double', slot: '1', name: 'Double Strafe', mpCost: 0, cooldown: 0.38, range: 400, hits: 2, dmgMult: 1.18, projectile: 'gold_arrow', vfx: 'arrow_hit', desc: 'Fires two high-velocity arrows in rapid succession.' },
      { id: 'spiral_piercer', slot: '2', name: 'Spiral Piercer', mpCost: 12, cooldown: 2.4, range: 420, hits: 3, dmgMult: 1.38, projectile: 'spiral_arrow', vfx: 'molten_arc', desc: 'Fires a drill-tipped arrow that pierces targets 3 times.' },
      { id: 'wind_vault', slot: '3', name: 'Tailwind Vault', mpCost: 10, cooldown: 4.5, dash: -110, buff: { id: 'tailwind', name: 'Tailwind', duration: 16, speedBonus: 0.25, critBonus: 0.15, icon: 'water_wave' }, vfx: 'water_slash', desc: 'Backflips away from danger while gaining +25% Speed and +15% Crit.' },
      { id: 'jaw_trap', slot: '4', name: 'Hunter\'s Snare Volley', mpCost: 16, cooldown: 3.6, range: 280, hits: 4, dmgMult: 1.2, vfx: 'arrow_hit', desc: 'Springs spiked hunting traps beneath nearby monsters.' },
      { id: 'hawk_focus', slot: '5', name: 'Predator\'s Sight', mpCost: 15, cooldown: 10.0, shieldPct: 0.2, buff: { id: 'predator', name: 'Predator Sight', duration: 22, atkBonus: 0.25, icon: 'warcry_up' }, vfx: 'gold_shield', desc: 'Sharpens aim for +25% Attack and a 20% HP Ward Shield.' },
      { id: 'sky_barrage', slot: 'R', name: 'Tempest Arrow Rain', mpCost: 28, cooldown: 8.0, range: 360, hits: 7, dmgMult: 1.15, vfx: 'sky_lances', desc: 'Showers the battlefield with 7 waves of whistling arrows.' }
    ]
  },

  bandit: {
    id: 'bandit',
    name: 'Bandit',
    archetype: 'Bandit',
    color: '#b388ff',
    difficulty: 'Fast-Paced / High Crit & Dodge',
    weaponType: 'Twin Daggers & Shurikens',
    description: 'Nimble shadow rogue who chains purple lightning daggers, evades attacks with DODGE frames, and triggers massive LUCKY! criticals.',
    baseStats: { hp: 185, mp: 130, atk: 27, spellPower: 18, def: 10, critChance: 0.36, dodgeChance: 0.28, speed: 275 },
    visual: { hairColor: '#8d99ae', hat: 'sigtis_veil', outfitColor: '#2b2d42', capeColor: '#5a189a', weaponStyle: 'twin_daggers' },
    skills: [
      { id: 'twin_fang', slot: '1', name: 'Volt Twin-Fang', mpCost: 0, cooldown: 0.35, range: 115, hits: 3, dmgMult: 1.05, vfx: 'purple_lightning', desc: 'Ultra-fast 3-hit dagger flurry crackling with purple lightning.' },
      { id: 'thunder_shuriken', slot: '2', name: 'Thunder Shuriken', mpCost: 11, cooldown: 2.0, range: 350, hits: 3, dmgMult: 1.28, projectile: 'purple_shuriken', vfx: 'purple_lightning', desc: 'Throws 3 electrified throwing stars that bounce between foes.' },
      { id: 'smoke_mirage', slot: '3', name: 'Mirage Veil', mpCost: 14, cooldown: 9.0, shieldPct: 0.2, buff: { id: 'mirage', name: 'Mirage Veil', duration: 20, dodgeBonus: 0.25, critBonus: 0.2, icon: 'kanji_bu' }, vfx: 'purple_magic', desc: 'Cloaks in violet shadow, boosting Dodge +25% and LUCKY Crit +20%.' },
      { id: 'shadow_ambush', slot: '4', name: 'Shadowstep Ambush', mpCost: 16, cooldown: 3.0, range: 240, hits: 4, dmgMult: 1.3, dash: 140, vfx: 'purple_lightning', desc: 'Blinks through monsters in a violet lightning bolt for 4 critical strikes.' },
      { id: 'greed_flip', slot: '5', name: 'Pickpocket Slash', mpCost: 12, cooldown: 4.5, range: 140, hits: 2, dmgMult: 1.5, bonusRasa: 25, vfx: 'purple_lightning', desc: 'Strikes a monster\'s coin pouch, knocking loose bonus Rasa coins.' },
      { id: 'phantom_execution', slot: 'R', name: 'Phantom Storm', mpCost: 28, cooldown: 8.5, range: 280, hits: 7, dmgMult: 1.18, vfx: 'purple_lightning', desc: 'Unleashes a purple lightning storm that strikes 7 times across the platform.' }
    ]
  },

  shaman: {
    id: 'shaman',
    name: 'Shaman',
    archetype: 'Mage',
    color: '#ff6b8b',
    difficulty: 'Medium / Blood & Soul Weaver',
    weaponType: 'Ritual Runeblade',
    description: 'Mystic spellblade who weaves orbiting crimson blood-blossoms and emerald soul wisps to drain life from monsters.',
    baseStats: { hp: 225, mp: 195, atk: 20, spellPower: 30, def: 13, critChance: 0.24, dodgeChance: 0.12, speed: 238 },
    visual: { hairColor: '#ff8da1', hat: 'twin_buns', outfitColor: '#6d1b2b', capeColor: '#3a0ca3', weaponStyle: 'ritual_blade', aura: 'crimson_petals' },
    skills: [
      { id: 'crimson_reap', slot: '1', name: 'Crimson Rite Cleave', mpCost: 0, cooldown: 0.44, range: 150, hits: 2, dmgMult: 1.22, vfx: 'crimson_arc', desc: 'Sweeps the runeblade in a blood-lotus arc that siphons vitality.' },
      { id: 'soul_wisp_bolt', slot: '2', name: 'Soul Wisp Bolt', mpCost: 14, cooldown: 2.3, range: 340, hits: 2, dmgMult: 1.48, projectile: 'soul_wisp', vfx: 'emerald_burst', desc: 'Releases a spectral green wisp that devours target essence and heals you.' },
      { id: 'blood_blossom_ring', slot: '3', name: 'Blood Lotus Pact', mpCost: 18, cooldown: 10.0, buff: { id: 'blood_pact', name: 'Blood Lotus Pact', duration: 24, atkBonus: 0.26, healPct: 0.18, icon: 'elem_crest' }, vfx: 'sakura_slash', desc: 'Summons 5 orbiting crimson blossoms, healing 18% HP and boosting damage +26%.' },
      { id: 'ancestral_totem', slot: '4', name: 'Totem of Whispers', mpCost: 18, cooldown: 3.8, range: 230, hits: 4, dmgMult: 1.28, vfx: 'emerald_rain', desc: 'Erects an ancestral spirit totem that pulses 4 waves of soul fire.' },
      { id: 'spirit_shroud', slot: '5', name: 'Wisp Shroud', mpCost: 16, cooldown: 8.5, shieldPct: 0.35, vfx: 'purple_magic', desc: 'Wraps you in a ghostly shroud absorbing 35% Max HP.' },
      { id: 'eclipse_ritual', slot: 'R', name: 'Unwritten Eclipse', mpCost: 34, cooldown: 9.0, range: 290, hits: 6, dmgMult: 1.32, vfx: 'black_pink_cuts', desc: 'Detonates all crimson blossoms and emerald wisps in a 6-hit soul explosion.' }
    ]
  }
};

export const ITEMS = {
  // Raw Gathering Materials (No Junk Items!)
  stick: {
    id: 'stick',
    name: 'Humble Stick',
    category: 'Material',
    rarity: 'common',
    icon: 'twig',
    value: 4,
    artificingXp: 8,
    salvage: [{ itemId: 'wood_splinter', count: 2 }],
    desc: 'From the humblest stick to godly signets, every item has a purpose. Used for arrow shafts and tool handles.'
  },
  driftwood: {
    id: 'driftwood',
    name: 'Sun-Bleached Driftwood',
    category: 'Material',
    rarity: 'common',
    icon: 'log',
    value: 8,
    artificingXp: 12,
    salvage: [{ itemId: 'stick', count: 2 }, { itemId: 'sea_salt_crystal', count: 1 }],
    desc: 'Salt-cured timber gathered along Driftwood Shores.'
  },
  sandy_crab_claw: {
    id: 'sandy_crab_claw',
    name: 'Sandy Crab Claw',
    category: 'Material',
    rarity: 'common',
    icon: 'claw',
    value: 10,
    artificingXp: 14,
    salvage: [{ itemId: 'chitin_dust', count: 2 }],
    desc: 'Pincher from a Driftwood Shores Sand Crab. Sought by Arbaldo and coastal cooks.'
  },
  namu_log: {
    id: 'namu_log',
    name: 'Namu Oak Log',
    category: 'Material',
    rarity: 'common',
    icon: 'log',
    value: 14,
    artificingXp: 18,
    salvage: [{ itemId: 'stick', count: 3 }],
    desc: 'Dense timber felled in Namu Forest or from emergent Forager Goblin acorn trees.'
  },
  sprout_essence: {
    id: 'sprout_essence',
    name: 'Sprout Essence',
    category: 'Material',
    rarity: 'uncommon',
    icon: 'leaf_essence',
    value: 28,
    artificingXp: 35,
    salvage: [{ itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Living botanical dew dropped by Sproutlings and Forager Goblins.'
  },
  silt_essence: {
    id: 'silt_essence',
    name: 'Silt Essence',
    category: 'Material',
    rarity: 'uncommon',
    icon: 'silt_essence',
    value: 32,
    artificingXp: 40,
    salvage: [{ itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Condensed elemental silt from Bayou Badlands and Ashen Expanse.'
  },
  bug_mush: {
    id: 'bug_mush',
    name: 'Bug Mush',
    category: 'Material',
    rarity: 'common',
    icon: 'slime_gel',
    value: 16,
    artificingXp: 20,
    salvage: [{ itemId: 'chitin_dust', count: 2 }],
    desc: 'Sticky bio-gel harvested from Blue Berry Slimes and forest critters.'
  },
  frogling_legs: {
    id: 'frogling_legs',
    name: 'Frogling Legs',
    category: 'Material',
    rarity: 'uncommon',
    icon: 'meat',
    value: 24,
    artificingXp: 26,
    salvage: [{ itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Tender amphibian legs from Croaking Rapids Moss Frogs. Prized for Cooking.'
  },
  wood_golem_bark: {
    id: 'wood_golem_bark',
    name: 'Wood Golem Bark',
    category: 'Material',
    rarity: 'uncommon',
    icon: 'bark',
    value: 45,
    artificingXp: 55,
    salvage: [{ itemId: 'namu_log', count: 2 }, { itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Runed heartwood plating from a Lv. 30 Wood Golem (70% drop).'
  },
  damp_moss: {
    id: 'damp_moss',
    name: 'Damp Moss',
    category: 'Material',
    rarity: 'rare',
    icon: 'moss',
    value: 90,
    artificingXp: 95,
    salvage: [{ itemId: 'sprout_essence', count: 2 }, { itemId: 'brittle_catalyst', count: 2 }],
    desc: 'Mana-soaked moss clinging to ancient Wood Golems (1/33 drop).'
  },
  brittle_catalyst: {
    id: 'brittle_catalyst',
    name: 'Brittle Catalyst',
    category: 'Material',
    rarity: 'rare',
    icon: 'catalyst',
    value: 140,
    artificingXp: 130,
    salvage: [{ itemId: 'ancient_catalyst', count: 1 }],
    desc: 'Spiral golden rune catalyst obtained from rare monster drops (1/87) or Artificing breakdown.'
  },
  ancient_catalyst: {
    id: 'ancient_catalyst',
    name: 'Ancient Core Catalyst',
    category: 'Material',
    rarity: 'epic',
    icon: 'orb_catalyst',
    value: 320,
    artificingXp: 260,
    salvage: [{ itemId: 'crimson_shard', count: 2 }],
    desc: 'Refined Artificing core required for high-tier class armor like the Sigtis Veil.'
  },
  tin_ore: {
    id: 'tin_ore',
    name: 'Tin Ore',
    category: 'Material',
    rarity: 'common',
    icon: 'ore_tin',
    value: 18,
    artificingXp: 22,
    salvage: [{ itemId: 'chitin_dust', count: 2 }],
    desc: 'Silvery-grey ore mined in Gibler\'s Mines or dropped by Goblin Miners.'
  },
  cobalt_crystal: {
    id: 'cobalt_crystal',
    name: 'Cobalt Crystal',
    category: 'Material',
    rarity: 'rare',
    icon: 'ore_cobalt',
    value: 85,
    artificingXp: 90,
    salvage: [{ itemId: 'brittle_catalyst', count: 2 }],
    desc: 'Radiant blue mineral formation mined in the Ashen Expanse.'
  },
  woven_cloth: {
    id: 'woven_cloth',
    name: 'Woven Cloth',
    category: 'Material',
    rarity: 'uncommon',
    icon: 'cloth',
    value: 35,
    artificingXp: 30,
    salvage: [{ itemId: 'sprout_essence', count: 1 }],
    desc: 'Spun plant fiber cloth processed at the Namu\'s Rest Sawmill & Loom.'
  },
  crimson_shard: {
    id: 'crimson_shard',
    name: 'Crimson Ruby Cluster',
    category: 'Material',
    rarity: 'rare',
    icon: 'ruby_cluster',
    value: 160,
    artificingXp: 150,
    salvage: [{ itemId: 'ancient_catalyst', count: 1 }],
    desc: 'Blood-red crystal cluster found in deep mines and Greed Spirit pouches.'
  },
  tin_bar: {
    id: 'tin_bar',
    name: 'Tin Ingot',
    category: 'Material',
    rarity: 'uncommon',
    icon: 'ingot',
    value: 40,
    artificingXp: 35,
    salvage: [{ itemId: 'tin_ore', count: 1 }],
    desc: 'Smelted at the Namu\'s Rest Stone Forge.'
  },
  arrow_shaft: {
    id: 'arrow_shaft',
    name: 'Arrow Shaft',
    category: 'Material',
    rarity: 'common',
    icon: 'shaft',
    value: 6,
    artificingXp: 10,
    salvage: [{ itemId: 'stick', count: 1 }],
    desc: 'Planed wooden shafts used to craft hunting and elemental arrows.'
  },
  tin_arrow: {
    id: 'tin_arrow',
    name: 'Tin Arrow',
    category: 'Material',
    rarity: 'common',
    icon: 'arrow_bundle',
    value: 8,
    artificingXp: 12,
    salvage: [{ itemId: 'arrow_shaft', count: 1 }],
    desc: 'Standard hunting ammunition requested for Hunting Supplies quests.'
  },
  wood_splinter: {
    id: 'wood_splinter',
    name: 'Resonant Splinter',
    category: 'Material',
    rarity: 'common',
    icon: 'twig',
    value: 5,
    artificingXp: 6,
    desc: 'Exclusive Artificing salvage material used in scroll synthesis.'
  },
  sea_salt_crystal: {
    id: 'sea_salt_crystal',
    name: 'Sea Salt Crystal',
    category: 'Material',
    rarity: 'common',
    icon: 'ore_tin',
    value: 9,
    artificingXp: 10,
    desc: 'Extracted via Artificing from coastal driftwood; used in gourmet Cooking.'
  },
  chitin_dust: {
    id: 'chitin_dust',
    name: 'Alchemical Chitin Dust',
    category: 'Material',
    rarity: 'common',
    icon: 'moss',
    value: 11,
    artificingXp: 12,
    desc: 'Fine catalyst powder extracted via Artificing for Alchemy potions.'
  },

  // Consumables (Potions, Cooked Food, Scrolls)
  minor_hp_potion: {
    id: 'minor_hp_potion',
    name: 'Crimson Vitality Draught',
    category: 'Consumable',
    rarity: 'common',
    icon: 'potion_red',
    value: 25,
    useEffect: { healHp: 180 },
    desc: 'Restores 180 HP instantly. Bound to Hotbar slot [F].'
  },
  minor_mp_potion: {
    id: 'minor_mp_potion',
    name: 'Azure Mana Draught',
    category: 'Consumable',
    rarity: 'common',
    icon: 'potion_blue',
    value: 25,
    useEffect: { healMp: 120 },
    desc: 'Restores 120 Mana instantly. Bound to Hotbar slot [X].'
  },
  roasted_frog_skewer: {
    id: 'roasted_frog_skewer',
    name: 'Roasted Frogling Skewer',
    category: 'Consumable',
    rarity: 'uncommon',
    icon: 'drumstick',
    value: 55,
    useEffect: {
      healHp: 120,
      buff: { id: 'well_fed', name: 'Hearty Skewer (+18% ATK, +15 HP/s)', duration: 120, atkBonus: 0.18, hpRegenBonus: 15, icon: 'drumstick' }
    },
    desc: 'Crispy camp meal that grants +18% Attack and +15 HP regen for 120s. Bound to Hotbar [V].'
  },
  lucky_drop_elixir: {
    id: 'lucky_drop_elixir',
    name: 'Elixir of Fortune',
    category: 'Consumable',
    rarity: 'rare',
    icon: 'vial_gold',
    value: 110,
    useEffect: {
      buff: { id: 'fortune_elixir', name: 'Fortune Elixir (+25% Crit & Drop Luck)', duration: 120, critBonus: 0.25, dropBonus: 0.5, icon: 'vial_gold' }
    },
    desc: 'Brews a shimmering golden aura that boosts LUCKY! Crit rate +25% and rare drop odds +50%.'
  },
  scroll_of_power: {
    id: 'scroll_of_power',
    name: 'Scroll of Weapon Mastery',
    category: 'Scroll',
    rarity: 'rare',
    icon: 'scroll_purple',
    value: 180,
    artificingXp: 140,
    imbueEffect: { stat: 'atk', bonus: 6, spellPowerBonus: 6 },
    desc: 'Imbues your equipped weapon with +6 Attack and +6 Spell Power. Greed Spirits love stealing these!'
  },
  scroll_of_protection: {
    id: 'scroll_of_protection',
    name: 'Scroll of Barkskin Protection',
    category: 'Scroll',
    rarity: 'rare',
    icon: 'scroll_purple',
    value: 165,
    artificingXp: 130,
    imbueEffect: { stat: 'def', bonus: 5, hpBonus: 45 },
    desc: 'Imbues your equipped armor/headgear with +5 Defense and +45 Max HP.'
  },

  // Weapons
  driftwood_club: {
    id: 'driftwood_club',
    name: 'Barnacle Driftwood Blade',
    category: 'Weapon',
    slot: 'weapon',
    classReq: 'Generic',
    reqLevel: 1,
    rarity: 'common',
    icon: 'sword_wood',
    value: 30,
    stats: { atk: 8, spellPower: 5 },
    artificingXp: 35,
    salvage: [{ itemId: 'driftwood', count: 2 }, { itemId: 'wood_splinter', count: 1 }],
    desc: 'Sturdy weapon fashioned from shipwreck timber.'
  },
  namu_katana: {
    id: 'namu_katana',
    name: 'Petal-Edge Uchigatana',
    category: 'Weapon',
    slot: 'weapon',
    classReq: 'Warrior',
    reqLevel: 10,
    rarity: 'rare',
    icon: 'katana',
    value: 210,
    stats: { atk: 24, critChance: 0.08, speed: 12 },
    artificingXp: 120,
    salvage: [{ itemId: 'tin_bar', count: 2 }, { itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Razor-sharp Bushido blade tempered in Namu\'s Rest.'
  },
  whispering_bow: {
    id: 'whispering_bow',
    name: 'Whispering Canopy Bow',
    category: 'Weapon',
    slot: 'weapon',
    classReq: 'Archer',
    reqLevel: 10,
    rarity: 'rare',
    icon: 'bow_wood',
    value: 200,
    stats: { atk: 22, spellPower: 14, critChance: 0.07 },
    artificingXp: 120,
    salvage: [{ itemId: 'namu_log', count: 3 }, { itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Living yew bow strung with enchanted sprout sinew.'
  },
  elemental_skull_staff: {
    id: 'elemental_skull_staff',
    name: 'Archmage Skull Staff',
    category: 'Weapon',
    slot: 'weapon',
    classReq: 'Mage',
    reqLevel: 10,
    rarity: 'rare',
    icon: 'staff_skull',
    value: 220,
    stats: { atk: 10, spellPower: 30, mp: 60 },
    artificingXp: 125,
    salvage: [{ itemId: 'damp_moss', count: 1 }, { itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Focuses arcane, solar, and glacial spells with zero mana leakage.'
  },
  sigtis_twin_daggers: {
    id: 'sigtis_twin_daggers',
    name: 'Sigtis Volt-Fangs',
    category: 'Weapon',
    slot: 'weapon',
    classReq: 'Bandit',
    reqLevel: 15,
    rarity: 'epic',
    icon: 'daggers',
    value: 340,
    stats: { atk: 28, critChance: 0.12, dodgeChance: 0.06 },
    artificingXp: 180,
    salvage: [{ itemId: 'ancient_catalyst', count: 1 }, { itemId: 'crimson_shard', count: 1 }],
    desc: 'Twin purple-lightning daggers that hum with lethal velocity.'
  },

  // Armor & Headgear (Including Sigtis Veil from ss_9.jpg!)
  miner_hard_hat: {
    id: 'miner_hard_hat',
    name: 'Gibler\'s Lantern Helm',
    category: 'Armor',
    slot: 'hat',
    classReq: 'Generic',
    reqLevel: 5,
    rarity: 'uncommon',
    icon: 'hat_miner',
    value: 95,
    stats: { def: 9, hp: 55 },
    visualHat: 'miner_helm',
    artificingXp: 65,
    salvage: [{ itemId: 'tin_bar', count: 1 }, { itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Brass mining helmet worn by Goblin Miners in Gibler\'s Mines.'
  },
  boar_hunter_hood: {
    id: 'boar_hunter_hood',
    name: 'Wildwood Boar Pelt Hood',
    category: 'Armor',
    slot: 'hat',
    classReq: 'Archer',
    reqLevel: 18,
    rarity: 'rare',
    icon: 'hat_boar',
    value: 240,
    stats: { atk: 12, def: 12, hp: 85, critChance: 0.05 },
    visualHat: 'boar_pelt_hood',
    artificingXp: 140,
    salvage: [{ itemId: 'woven_cloth', count: 2 }, { itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Trophy hood worn by top Leaderboard Rangers.'
  },
  azure_wizard_hat: {
    id: 'azure_wizard_hat',
    name: 'Starlight Elementalist Hat',
    category: 'Armor',
    slot: 'hat',
    classReq: 'Mage',
    reqLevel: 20,
    rarity: 'rare',
    icon: 'hat_wizard',
    value: 260,
    stats: { spellPower: 22, def: 10, mp: 90 },
    visualHat: 'wizard_hat_blue',
    artificingXp: 150,
    salvage: [{ itemId: 'woven_cloth', count: 2 }, { itemId: 'damp_moss', count: 1 }],
    desc: 'Pointed azure hat worn by Precision and Boots atop the Leaderboard podium.'
  },
  sigtis_veil: {
    id: 'sigtis_veil',
    name: 'Sigtis Veil',
    category: 'Armor',
    slot: 'hat',
    classReq: 'Bandit',
    reqLevel: 45,
    rarity: 'epic',
    icon: 'hat_sigtis',
    value: 520,
    stats: { atk: 22, spellPower: 16, def: 18, hp: 140, critChance: 0.1, dodgeChance: 0.08 },
    visualHat: 'sigtis_veil',
    artificingXp: 280,
    salvage: [{ itemId: 'ancient_catalyst', count: 1 }, { itemId: 'crimson_shard', count: 1 }],
    desc: 'Signature shadowed hood with a glowing crimson eye-gem. Featured in the Namu\'s Rest Crafting showcase.'
  },
  barkplate_cuirass: {
    id: 'barkplate_cuirass',
    name: 'Golem Barkplate Armor',
    category: 'Armor',
    slot: 'armor',
    classReq: 'Generic',
    reqLevel: 12,
    rarity: 'rare',
    icon: 'armor_bark',
    value: 230,
    stats: { def: 20, hp: 130, atk: 8 },
    artificingXp: 135,
    salvage: [{ itemId: 'wood_golem_bark', count: 2 }, { itemId: 'brittle_catalyst', count: 1 }],
    desc: 'Heavy living-wood chestplate carved from Wood Golem Bark.'
  },

  // Unique Gear & Jewelry (Steam Desc: "From the humblest stick to Corrupted Signet of the Gods")
  corrupted_signet_of_the_gods: {
    id: 'corrupted_signet_of_the_gods',
    name: 'Corrupted Signet of the Gods',
    category: 'Jewelry',
    slot: 'ring',
    classReq: 'Generic',
    reqLevel: 1,
    rarity: 'legendary',
    icon: 'ring_gods',
    value: 2500,
    stats: { atk: 35, spellPower: 35, def: 20, hp: 250, critChance: 0.15 },
    uniqueSkill: 'Divine Corruption Nova (Passive: Every 5th attack triggers a lightning pillar for +180% damage)',
    artificingXp: 600,
    salvage: [{ itemId: 'ancient_catalyst', count: 3 }, { itemId: 'crimson_shard', count: 3 }],
    desc: 'Mythic relic of the Unwritten World (1/2,222 drop). Grants passive Divine Corruption lightning strikes on every 5th attack!'
  },

  // Tools
  sturdy_iron_axe: {
    id: 'sturdy_iron_axe',
    name: 'Lumberjack\'s Tin Hatchet',
    category: 'Tool',
    slot: 'tool',
    classReq: 'Generic',
    reqLevel: 1,
    rarity: 'uncommon',
    icon: 'axe',
    value: 120,
    stats: { woodcuttingSpeed: 0.35, extraDropChance: 0.2 },
    artificingXp: 70,
    salvage: [{ itemId: 'tin_bar', count: 1 }, { itemId: 'namu_log', count: 1 }],
    desc: 'Increases Woodcutting speed by +35% and EXTRA! double-log proc chance by +20%.'
  },

  // Tamed Pets
  crimson_finch_charm: {
    id: 'crimson_finch_charm',
    name: 'Tamed Crimson Finch',
    category: 'Pet',
    slot: 'pet',
    rarity: 'rare',
    icon: 'pet_bird',
    value: 300,
    petVisual: 'crimson_bird',
    stats: { atk: 6, speed: 15 },
    desc: 'Loyal red feathery companion (seen in Namu Forest screenshots) that follows you and auto-collects nearby Rasa & loot!'
  },
  sproutling_pet_charm: {
    id: 'sproutling_pet_charm',
    name: 'Tamed Leaf Sproutling',
    category: 'Pet',
    slot: 'pet',
    rarity: 'rare',
    icon: 'pet_sprout',
    value: 300,
    petVisual: 'sproutling_pet',
    stats: { hp: 65, def: 6 },
    desc: 'Adorable bouncing turnip-sprout companion that auto-loots drops and boosts Max HP.'
  },
  shadow_wisp_charm: {
    id: 'shadow_wisp_charm',
    name: 'Tamed Ember Wisp',
    category: 'Pet',
    slot: 'pet',
    rarity: 'epic',
    icon: 'pet_imp',
    value: 480,
    petVisual: 'shadow_imp',
    stats: { spellPower: 14, critChance: 0.06 },
    desc: 'Hooded shadow-ember sprite seen beside high-level adventurers in Ashen Expanse.'
  }
};

// Crafting Recipes matching ss_9.jpg and vid_3_combat.mp4
export const CRAFTING_RECIPES = [
  {
    id: 'craft_arrow_shaft',
    outputId: 'arrow_shaft',
    outputCount: 12,
    tab: 'General',
    subTab: 'Generic',
    reqLevel: 1,
    xpReward: 9,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: true,
    ingredients: [
      { itemId: 'stick', count: 2 }
    ]
  },
  {
    id: 'craft_woven_cloth',
    outputId: 'woven_cloth',
    outputCount: 2,
    tab: 'General',
    subTab: 'Generic',
    reqLevel: 3,
    xpReward: 28,
    skill: 'processing',
    discoveredByDefault: true,
    isNew: true,
    ingredients: [
      { itemId: 'sprout_essence', count: 2 },
      { itemId: 'bug_mush', count: 2 }
    ]
  },
  {
    id: 'craft_tin_bar',
    outputId: 'tin_bar',
    outputCount: 1,
    tab: 'General',
    subTab: 'Generic',
    reqLevel: 4,
    xpReward: 35,
    skill: 'processing',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'tin_ore', count: 2 },
      { itemId: 'namu_log', count: 1 }
    ]
  },
  {
    id: 'craft_tin_arrow',
    outputId: 'tin_arrow',
    outputCount: 25,
    tab: 'Weapons',
    subTab: 'Archer',
    reqLevel: 5,
    xpReward: 45,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: true,
    ingredients: [
      { itemId: 'arrow_shaft', count: 12 },
      { itemId: 'tin_bar', count: 1 }
    ]
  },
  {
    id: 'craft_namu_katana',
    outputId: 'namu_katana',
    outputCount: 1,
    tab: 'Weapons',
    subTab: 'Warrior',
    reqLevel: 10,
    xpReward: 180,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'tin_bar', count: 2 },
      { itemId: 'namu_log', count: 3 },
      { itemId: 'sprout_essence', count: 2 }
    ]
  },
  {
    id: 'craft_whispering_bow',
    outputId: 'whispering_bow',
    outputCount: 1,
    tab: 'Weapons',
    subTab: 'Archer',
    reqLevel: 10,
    xpReward: 180,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'namu_log', count: 4 },
      { itemId: 'sprout_essence', count: 3 },
      { itemId: 'arrow_shaft', count: 12 }
    ]
  },
  {
    id: 'craft_elemental_staff',
    outputId: 'elemental_skull_staff',
    outputCount: 1,
    tab: 'Weapons',
    subTab: 'Mage',
    reqLevel: 10,
    xpReward: 195,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'namu_log', count: 3 },
      { itemId: 'damp_moss', count: 1 },
      { itemId: 'sprout_essence', count: 3 }
    ]
  },
  {
    id: 'craft_sigtis_daggers',
    outputId: 'sigtis_twin_daggers',
    outputCount: 1,
    tab: 'Weapons',
    subTab: 'Bandit',
    reqLevel: 15,
    xpReward: 320,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: true,
    ingredients: [
      { itemId: 'tin_bar', count: 3 },
      { itemId: 'brittle_catalyst', count: 1 },
      { itemId: 'crimson_shard', count: 1 }
    ]
  },
  {
    id: 'craft_miner_hat',
    outputId: 'miner_hard_hat',
    outputCount: 1,
    tab: 'Armor',
    subTab: 'Generic',
    reqLevel: 5,
    xpReward: 95,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'tin_bar', count: 2 },
      { itemId: 'driftwood', count: 2 }
    ]
  },
  {
    id: 'craft_barkplate',
    outputId: 'barkplate_cuirass',
    outputCount: 1,
    tab: 'Armor',
    subTab: 'Warrior',
    reqLevel: 12,
    xpReward: 260,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'wood_golem_bark', count: 3 },
      { itemId: 'woven_cloth', count: 2 },
      { itemId: 'tin_bar', count: 2 }
    ]
  },
  {
    id: 'craft_boar_hood',
    outputId: 'boar_hunter_hood',
    outputCount: 1,
    tab: 'Armor',
    subTab: 'Archer',
    reqLevel: 18,
    xpReward: 410,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'woven_cloth', count: 3 },
      { itemId: 'frogling_legs', count: 2 },
      { itemId: 'brittle_catalyst', count: 1 }
    ]
  },
  {
    id: 'craft_wizard_hat',
    outputId: 'azure_wizard_hat',
    outputCount: 1,
    tab: 'Armor',
    subTab: 'Mage',
    reqLevel: 20,
    xpReward: 450,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'woven_cloth', count: 3 },
      { itemId: 'damp_moss', count: 1 },
      { itemId: 'brittle_catalyst', count: 1 }
    ]
  },
  {
    id: 'craft_sigtis_veil',
    outputId: 'sigtis_veil',
    outputCount: 1,
    tab: 'Armor',
    subTab: 'Bandit',
    reqLevel: 45,
    xpReward: 2752,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: true,
    ingredients: [
      { itemId: 'sprout_essence', count: 1 },
      { itemId: 'ancient_catalyst', count: 1 },
      { itemId: 'woven_cloth', count: 8 },
      { itemId: 'crimson_shard', count: 1 }
    ]
  },
  {
    id: 'craft_corrupted_signet',
    outputId: 'corrupted_signet_of_the_gods',
    outputCount: 1,
    tab: 'Jewelry',
    subTab: 'Generic',
    reqLevel: 30,
    xpReward: 1850,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: true,
    ingredients: [
      { itemId: 'ancient_catalyst', count: 2 },
      { itemId: 'cobalt_crystal', count: 2 },
      { itemId: 'crimson_shard', count: 2 },
      { itemId: 'silt_essence', count: 2 }
    ]
  },
  {
    id: 'craft_tin_axe',
    outputId: 'sturdy_iron_axe',
    outputCount: 1,
    tab: 'Tools',
    subTab: 'Generic',
    reqLevel: 2,
    xpReward: 65,
    skill: 'crafting',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'tin_bar', count: 1 },
      { itemId: 'namu_log', count: 2 }
    ]
  },
  {
    id: 'craft_frog_skewer',
    outputId: 'roasted_frog_skewer',
    outputCount: 2,
    tab: 'General',
    subTab: 'Generic',
    reqLevel: 2,
    xpReward: 40,
    skill: 'cooking',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'frogling_legs', count: 1 },
      { itemId: 'stick', count: 1 }
    ]
  },
  {
    id: 'craft_fortune_elixir',
    outputId: 'lucky_drop_elixir',
    outputCount: 1,
    tab: 'General',
    subTab: 'Generic',
    reqLevel: 5,
    xpReward: 75,
    skill: 'alchemy',
    discoveredByDefault: true,
    isNew: false,
    ingredients: [
      { itemId: 'sprout_essence', count: 1 },
      { itemId: 'bug_mush', count: 2 }
    ]
  },
  {
    id: 'craft_scroll_power',
    outputId: 'scroll_of_power',
    outputCount: 1,
    tab: 'Scrolls',
    subTab: 'Generic',
    reqLevel: 8,
    xpReward: 140,
    skill: 'imbuing',
    discoveredByDefault: true,
    isNew: true,
    ingredients: [
      { itemId: 'brittle_catalyst', count: 1 },
      { itemId: 'wood_splinter', count: 2 }
    ]
  }
];

// Bestiary Regions & Monsters (Matching ss_8.jpg + screenshots)
export const BESTIARY_REGIONS = [
  'Driftwood Shores',
  'Namu Forest',
  'Murkwater Passage',
  'Bayou Badlands',
  'Ashen Expanse',
  'Whispering Hollow',
  'Wildlands',
  'Special'
];

export const MONSTERS = {
  sand_crab: {
    id: 'sand_crab',
    name: 'Sand Crab',
    region: 'Driftwood Shores',
    zoneId: 'driftwood_shores',
    level: 1,
    hp: 65,
    atk: 6,
    def: 2,
    xp: 14,
    rasaMin: 4,
    rasaMax: 9,
    visual: 'sand_crab',
    card: {
      statLabel: 'Grants: +4 Defense',
      stat: 'def',
      value: 4,
      odds: 45
    },
    drops: [
      { itemId: 'sandy_crab_claw', chance: 0.75, oddsLabel: '75%' },
      { itemId: 'driftwood', chance: 0.45, oddsLabel: '45%' },
      { itemId: 'minor_hp_potion', chance: 0.2, oddsLabel: '1/5' }
    ]
  },
  coastal_hermit: {
    id: 'coastal_hermit',
    name: 'Shell Hermit',
    region: 'Driftwood Shores',
    zoneId: 'driftwood_shores',
    level: 3,
    hp: 110,
    atk: 9,
    def: 5,
    xp: 24,
    rasaMin: 7,
    rasaMax: 15,
    visual: 'shell_crab',
    card: {
      statLabel: 'Grants: +18 Max HP',
      stat: 'hp',
      value: 18,
      odds: 65
    },
    drops: [
      { itemId: 'sandy_crab_claw', chance: 0.65, oddsLabel: '65%' },
      { itemId: 'stick', chance: 0.55, oddsLabel: '55%' },
      { itemId: 'sea_salt_crystal', chance: 0.25, oddsLabel: '1/4' }
    ]
  },
  sproutling: {
    id: 'sproutling',
    name: 'Sproutling',
    region: 'Namu Forest',
    zoneId: 'sprout_forest',
    level: 5,
    hp: 150,
    atk: 11,
    def: 4,
    xp: 38,
    rasaMin: 10,
    rasaMax: 22,
    visual: 'sproutling',
    card: {
      statLabel: 'Grants: +25 Max HP',
      stat: 'hp',
      value: 25,
      odds: 80
    },
    drops: [
      { itemId: 'sprout_essence', chance: 0.65, oddsLabel: '65%' },
      { itemId: 'stick', chance: 0.5, oddsLabel: '50%' },
      { itemId: 'sproutling_pet_charm', chance: 0.04, oddsLabel: '1/25' }
    ]
  },
  berry_slime: {
    id: 'berry_slime',
    name: 'Blue Berry Slime',
    region: 'Namu Forest',
    zoneId: 'sprout_forest',
    level: 8,
    hp: 240,
    atk: 14,
    def: 6,
    xp: 52,
    rasaMin: 14,
    rasaMax: 28,
    visual: 'berry_slime',
    card: {
      statLabel: 'Grants: +20 Max Mana',
      stat: 'mp',
      value: 20,
      odds: 110
    },
    drops: [
      { itemId: 'bug_mush', chance: 0.72, oddsLabel: '72%' },
      { itemId: 'sprout_essence', chance: 0.35, oddsLabel: '35%' },
      { itemId: 'minor_mp_potion', chance: 0.22, oddsLabel: '1/5' }
    ]
  },
  moss_frog: {
    id: 'moss_frog',
    name: 'Croaking Bullfrog',
    region: 'Namu Forest',
    zoneId: 'sprout_forest',
    level: 12,
    hp: 360,
    atk: 19,
    def: 8,
    xp: 78,
    rasaMin: 18,
    rasaMax: 36,
    visual: 'moss_frog',
    card: {
      statLabel: 'Grants: +3% Crit Chance',
      stat: 'critChance',
      value: 0.03,
      odds: 140
    },
    drops: [
      { itemId: 'frogling_legs', chance: 0.68, oddsLabel: '68%' },
      { itemId: 'damp_moss', chance: 0.12, oddsLabel: '1/8' },
      { itemId: 'roasted_frog_skewer', chance: 0.15, oddsLabel: '1/7' }
    ]
  },
  forager_goblin: {
    id: 'forager_goblin',
    name: 'Forager Goblin',
    region: 'Namu Forest',
    zoneId: 'sprout_forest',
    level: 18,
    hp: 520,
    atk: 25,
    def: 11,
    xp: 125,
    rasaMin: 26,
    rasaMax: 52,
    visual: 'forager_goblin',
    spawnsAcornTree: true, // Signature emergent mechanic: drops an acorn that instantly sprouts into a harvestable tree!
    card: {
      statLabel: 'Grants: +15% Woodcutting Speed',
      stat: 'woodcuttingSpeed',
      value: 0.15,
      odds: 190
    },
    drops: [
      { itemId: 'namu_log', chance: 0.75, oddsLabel: '75%' },
      { itemId: 'sprout_essence', chance: 0.5, oddsLabel: '50%' },
      { itemId: 'brittle_catalyst', chance: 0.12, oddsLabel: '1/8' },
      { itemId: 'crimson_finch_charm', chance: 0.05, oddsLabel: '1/20' }
    ]
  },
  wood_golem: {
    id: 'wood_golem',
    name: 'Wood Golem',
    region: 'Namu Forest',
    zoneId: 'sprout_forest',
    level: 30,
    hp: 1150,
    atk: 38,
    def: 20,
    xp: 280,
    rasaMin: 55,
    rasaMax: 110,
    visual: 'wood_golem',
    card: {
      statLabel: 'Grants: +1 Spell Power',
      stat: 'spellPower',
      value: 1,
      odds: 649
    },
    drops: [
      { itemId: 'wood_golem_bark', chance: 0.7, oddsLabel: '70%' },
      { itemId: 'damp_moss', chance: 0.18, oddsLabel: '1/33' },
      { itemId: 'scroll_of_protection', chance: 0.12, oddsLabel: '1/67' },
      { itemId: 'brittle_catalyst', chance: 0.15, oddsLabel: '1/87' },
      { itemId: 'ancient_catalyst', chance: 0.06, oddsLabel: '1/571' },
      { itemId: 'barkplate_cuirass', chance: 0.04, oddsLabel: '1/3,030' },
      { itemId: 'corrupted_signet_of_the_gods', chance: 0.02, oddsLabel: '1/2,222' }
    ]
  },
  mutant_slime: {
    id: 'mutant_slime',
    name: 'Mutant Slime',
    region: 'Namu Forest',
    zoneId: 'sprout_forest',
    level: 35,
    hp: 8500,
    maxHpDisplay: 200000,
    isBoss: true,
    atk: 42,
    def: 16,
    xp: 950,
    rasaMin: 220,
    rasaMax: 450,
    visual: 'mutant_slime',
    card: {
      statLabel: 'Grants: +8% Attack & Spell Power',
      stat: 'atk',
      value: 8,
      odds: 320
    },
    drops: [
      { itemId: 'bug_mush', chance: 1.0, oddsLabel: '100%' },
      { itemId: 'brittle_catalyst', chance: 0.65, oddsLabel: '65%' },
      { itemId: 'ancient_catalyst', chance: 0.35, oddsLabel: '35%' },
      { itemId: 'scroll_of_power', chance: 0.4, oddsLabel: '40%' },
      { itemId: 'corrupted_signet_of_the_gods', chance: 0.08, oddsLabel: '1/12' }
    ]
  },
  goblin_miner: {
    id: 'goblin_miner',
    name: 'Goblin Miner',
    region: 'Murkwater Passage',
    zoneId: 'giblers_mines',
    level: 22,
    hp: 680,
    atk: 30,
    def: 15,
    xp: 165,
    rasaMin: 35,
    rasaMax: 70,
    visual: 'goblin_miner',
    card: {
      statLabel: 'Grants: +6 Attack Power',
      stat: 'atk',
      value: 6,
      odds: 210
    },
    drops: [
      { itemId: 'tin_ore', chance: 0.78, oddsLabel: '78%' },
      { itemId: 'tin_bar', chance: 0.25, oddsLabel: '25%' },
      { itemId: 'miner_hard_hat', chance: 0.08, oddsLabel: '1/12' },
      { itemId: 'crimson_shard', chance: 0.14, oddsLabel: '1/7' }
    ]
  },
  ore_crusher: {
    id: 'ore_crusher',
    name: 'Cavern Ore Golem',
    region: 'Murkwater Passage',
    zoneId: 'giblers_mines',
    level: 32,
    hp: 1350,
    atk: 40,
    def: 26,
    xp: 310,
    rasaMin: 60,
    rasaMax: 120,
    visual: 'sandstone_golem',
    card: {
      statLabel: 'Grants: +10 Defense',
      stat: 'def',
      value: 10,
      odds: 400
    },
    drops: [
      { itemId: 'tin_ore', chance: 0.85, oddsLabel: '85%' },
      { itemId: 'cobalt_crystal', chance: 0.35, oddsLabel: '35%' },
      { itemId: 'crimson_shard', chance: 0.22, oddsLabel: '1/5' },
      { itemId: 'ancient_catalyst', chance: 0.1, oddsLabel: '1/10' }
    ]
  },
  bayou_shroom: {
    id: 'bayou_shroom',
    name: 'Docwapo Shroom',
    region: 'Bayou Badlands',
    zoneId: 'bayou_ashen',
    level: 40,
    hp: 1550,
    atk: 45,
    def: 18,
    xp: 390,
    rasaMin: 75,
    rasaMax: 145,
    visual: 'bayou_shroom',
    card: {
      statLabel: 'Grants: +8 Spell Power',
      stat: 'spellPower',
      value: 8,
      odds: 420
    },
    drops: [
      { itemId: 'silt_essence', chance: 0.72, oddsLabel: '72%' },
      { itemId: 'damp_moss', chance: 0.4, oddsLabel: '40%' },
      { itemId: 'woven_cloth', chance: 0.3, oddsLabel: '30%' }
    ]
  },
  bayou_guardian: {
    id: 'bayou_guardian',
    name: 'Bayou Guardian',
    region: 'Bayou Badlands',
    zoneId: 'bayou_ashen',
    level: 48,
    hp: 2100,
    atk: 54,
    def: 24,
    xp: 520,
    rasaMin: 95,
    rasaMax: 180,
    visual: 'bayou_guardian',
    card: {
      statLabel: 'Grants: +4% Dodge Chance',
      stat: 'dodgeChance',
      value: 0.04,
      odds: 510
    },
    drops: [
      { itemId: 'silt_essence', chance: 0.8, oddsLabel: '80%' },
      { itemId: 'woven_cloth', chance: 0.45, oddsLabel: '45%' },
      { itemId: 'ancient_catalyst', chance: 0.16, oddsLabel: '1/6' },
      { itemId: 'sigtis_veil', chance: 0.05, oddsLabel: '1/20' }
    ]
  },
  sand_chomper: {
    id: 'sand_chomper',
    name: 'Mudmire Chomper',
    region: 'Ashen Expanse',
    zoneId: 'bayou_ashen',
    level: 55,
    hp: 2450,
    atk: 62,
    def: 28,
    xp: 640,
    rasaMin: 115,
    rasaMax: 220,
    visual: 'sand_chomper',
    card: {
      statLabel: 'Grants: +12 Attack Power',
      stat: 'atk',
      value: 12,
      odds: 550
    },
    drops: [
      { itemId: 'silt_essence', chance: 0.75, oddsLabel: '75%' },
      { itemId: 'cobalt_crystal', chance: 0.4, oddsLabel: '40%' },
      { itemId: 'crimson_shard', chance: 0.25, oddsLabel: '25%' },
      { itemId: 'shadow_wisp_charm', chance: 0.06, oddsLabel: '1/16' }
    ]
  },
  greed_spirit: {
    id: 'greed_spirit',
    name: 'Greed Spirit',
    region: 'Special',
    zoneId: 'any',
    level: 70,
    hp: 1650,
    atk: 32,
    def: 12,
    xp: 820,
    rasaMin: 280,
    rasaMax: 600,
    visual: 'greed_spirit',
    isLootThief: true,
    card: {
      statLabel: 'Grants: +25% Bonus Rasa & Loot Luck',
      stat: 'dropBonus',
      value: 0.25,
      odds: 250
    },
    drops: [
      { itemId: 'scroll_of_power', chance: 0.85, oddsLabel: '85%' },
      { itemId: 'ancient_catalyst', chance: 0.55, oddsLabel: '55%' },
      { itemId: 'crimson_shard', chance: 0.6, oddsLabel: '60%' },
      { itemId: 'sigtis_veil', chance: 0.18, oddsLabel: '18%' },
      { itemId: 'corrupted_signet_of_the_gods', chance: 0.12, oddsLabel: '1/8' }
    ]
  }
};

// Quests & Bounties (Matching ss_1, ss_5, ss_7, ss_8)
export const QUESTS = [
  {
    id: 'into_the_crab_pit',
    title: 'Into the Crab Pit',
    giver: 'Arbaldo',
    zoneId: 'driftwood_shores',
    description: 'Gather Driftwood and Sandy Crab Claws along Driftwood Shores, then speak to Arbaldo.',
    objectives: [
      { type: 'item', itemId: 'driftwood', target: 1, label: 'Driftwood' },
      { type: 'item', itemId: 'sandy_crab_claw', target: 1, label: 'Sandy Crab Claw' }
    ],
    rewards: { xp: 120, rasa: 85, items: [{ itemId: 'minor_hp_potion', count: 5 }] }
  },
  {
    id: 'getting_to_know_namu',
    title: 'Getting to Know Namu\'s Tenants',
    giver: 'Leyesha',
    zoneId: 'namu_rest',
    description: 'Meet the artisans and hunters of Namu\'s Rest village.',
    objectives: [
      { type: 'npc', npcId: 'leyesha', target: 1, label: 'Speak to Leyesha' },
      { type: 'npc', npcId: 'hunter', target: 1, label: 'Speak to Hunter' },
      { type: 'npc', npcId: 'tercaf', target: 1, label: 'Speak to Tercaf' }
    ],
    rewards: { xp: 260, rasa: 150, items: [{ itemId: 'sturdy_iron_axe', count: 1 }] }
  },
  {
    id: 'a_cawling',
    title: 'A Cawling',
    giver: 'Tercaf',
    zoneId: 'sprout_forest',
    description: 'Collect Bug Mush from Blue Berry Slimes and Humble Sticks from Namu Forest trees.',
    objectives: [
      { type: 'item', itemId: 'bug_mush', target: 5, label: 'Bug Mush' },
      { type: 'item', itemId: 'stick', target: 4, label: 'Twig / Stick' }
    ],
    rewards: { xp: 480, rasa: 240, items: [{ itemId: 'crimson_finch_charm', count: 1 }] }
  },
  {
    id: 'a_wisps_needs',
    title: 'A Wisp\'s Needs',
    giver: 'Will-o-Wisp',
    zoneId: 'sprout_forest',
    description: 'Bring Sprout Essence and Silt Essence to the ancient Will-o-Wisp stone circle.',
    objectives: [
      { type: 'item', itemId: 'sprout_essence', target: 4, label: 'Sprout Essence' },
      { type: 'item', itemId: 'silt_essence', target: 2, label: 'Silt Essence' }
    ],
    rewards: { xp: 820, rasa: 420, items: [{ itemId: 'scroll_of_power', count: 1 }, { itemId: 'ancient_catalyst', count: 1 }] }
  },
  {
    id: 'hunting_supplies',
    title: 'Hunting Supplies',
    giver: 'Hunter',
    zoneId: 'namu_rest',
    description: 'Mine Tin Ore in Gibler\'s Mines, craft Tin Arrows, and cull Mudmire Chompers.',
    objectives: [
      { type: 'item', itemId: 'tin_arrow', target: 25, label: 'Tin Arrow' },
      { type: 'kill', monsterId: 'forager_goblin', target: 3, label: 'Slay Forager Goblins' }
    ],
    rewards: { xp: 1150, rasa: 600, items: [{ itemId: 'boar_hunter_hood', count: 1 }] }
  }
];

// Simulated Leaderboard Adventurers (Taken directly from ss_4.jpg & other Steam screenshots!)
export const LEADERBOARD_ROSTER = [
  { name: 'Precision', classId: 'elementalist', tier: 'Elementalist', level: 118, guild: 'ArcaneOrder', guildIcon: 'slime', kills: 48210, quests: 42, cardsCollected: 16, cardsMaxed: 9, hat: 'wizard_hat_blue', skills: { woodcutting: 84, mining: 79, crafting: 91, artificing: 88, cooking: 76, monster_hunter: 95, imbuing: 82, processing: 85, taming: 74, alchemy: 90 } },
  { name: 'Boots', classId: 'elementalist', tier: 'Elementalist', level: 116, guild: 'Starlight', guildIcon: 'sparkle', kills: 45900, quests: 40, cardsCollected: 15, cardsMaxed: 8, hat: 'wizard_hat_blue', skills: { woodcutting: 80, mining: 83, crafting: 87, artificing: 92, cooking: 71, monster_hunter: 91, imbuing: 86, processing: 80, taming: 69, alchemy: 88 } },
  { name: 'Blood74', classId: 'ranger', tier: 'Ranger', level: 116, guild: 'Wildwood', guildIcon: 'frog', kills: 46450, quests: 39, cardsCollected: 16, cardsMaxed: 7, hat: 'boar_pelt_hood', skills: { woodcutting: 92, mining: 75, crafting: 89, artificing: 78, cooking: 82, monster_hunter: 94, imbuing: 79, processing: 88, taming: 91, alchemy: 73 } },
  { name: 'Ouro72', classId: 'ranger', tier: 'Ranger', level: 115, guild: 'Turtles', guildIcon: 'frog', kills: 41200, quests: 38, cardsCollected: 14, cardsMaxed: 6, hat: 'boar_pelt_hood', skills: { woodcutting: 88, mining: 74, crafting: 84, artificing: 76, cooking: 79, monster_hunter: 89, imbuing: 75, processing: 82, taming: 85, alchemy: 70 } },
  { name: 'HeadCrystal', classId: 'bushido', tier: 'Bushido', level: 113, guild: 'Turnips', guildIcon: 'slime', kills: 39800, quests: 36, cardsCollected: 14, cardsMaxed: 6, hat: 'samurai_headband', skills: { woodcutting: 72, mining: 86, crafting: 81, artificing: 83, cooking: 68, monster_hunter: 92, imbuing: 88, processing: 77, taming: 65, alchemy: 74 } },
  { name: 'ClubFeather', classId: 'elementalist', tier: 'Elementalist', level: 112, guild: 'TheCods', guildIcon: 'sparkle', kills: 37500, quests: 37, cardsCollected: 13, cardsMaxed: 5, hat: 'wizard_hat_blue', skills: { woodcutting: 76, mining: 71, crafting: 80, artificing: 85, cooking: 84, monster_hunter: 83, imbuing: 81, processing: 78, taming: 72, alchemy: 89 } },
  { name: 'MineSeer', classId: 'elementalist', tier: 'Elementalist', level: 112, guild: 'DeepVein', guildIcon: 'slime', kills: 36900, quests: 35, cardsCollected: 13, cardsMaxed: 5, hat: 'miner_helm', skills: { woodcutting: 70, mining: 96, crafting: 88, artificing: 84, cooking: 65, monster_hunter: 80, imbuing: 83, processing: 93, taming: 62, alchemy: 77 } },
  { name: 'NestHerb', classId: 'bushido', tier: 'Bushido', level: 111, guild: 'Turnips', guildIcon: 'frog', kills: 35400, quests: 34, cardsCollected: 12, cardsMaxed: 5, hat: 'samurai_headband', skills: { woodcutting: 85, mining: 68, crafting: 79, artificing: 75, cooking: 91, monster_hunter: 86, imbuing: 77, processing: 81, taming: 88, alchemy: 94 } },
  { name: 'BountyRotree', classId: 'juggernaut', tier: 'Juggernaut', level: 111, guild: 'IronVanguard', guildIcon: 'sparkle', kills: 38900, quests: 35, cardsCollected: 14, cardsMaxed: 6, hat: 'red_war_helm', skills: { woodcutting: 90, mining: 88, crafting: 85, artificing: 79, cooking: 74, monster_hunter: 97, imbuing: 80, processing: 86, taming: 71, alchemy: 68 } },
  { name: 'LegsMana', classId: 'elementalist', tier: 'Elementalist III', level: 110, guild: 'ArcaneOrder', guildIcon: 'slime', kills: 33200, quests: 33, cardsCollected: 12, cardsMaxed: 4, hat: 'wizard_hat_blue', skills: { woodcutting: 66, mining: 70, crafting: 78, artificing: 90, cooking: 80, monster_hunter: 79, imbuing: 85, processing: 74, taming: 64, alchemy: 92 } },
  { name: 'Treaders', classId: 'templar', tier: 'Templar', level: 110, guild: 'SunGuard', guildIcon: 'sparkle', kills: 31800, quests: 36, cardsCollected: 13, cardsMaxed: 5, hat: 'laurel_crown', skills: { woodcutting: 78, mining: 82, crafting: 86, artificing: 81, cooking: 85, monster_hunter: 84, imbuing: 89, processing: 83, taming: 77, alchemy: 80 } },
  { name: 'SeaSnailLover', classId: 'juggernaut', tier: 'Juggernaut III', level: 55, guild: 'Turtles', guildIcon: 'frog', kills: 9420, quests: 21, cardsCollected: 11, cardsMaxed: 3, hat: 'red_war_helm', skills: { woodcutting: 52, mining: 61, crafting: 58, artificing: 54, cooking: 49, monster_hunter: 63, imbuing: 51, processing: 57, taming: 46, alchemy: 44 } },
  { name: 'SeaSnailHater', classId: 'forest_warden', tier: 'Forest Warden', level: 56, guild: 'Turtles', guildIcon: 'frog', kills: 9850, quests: 22, cardsCollected: 12, cardsMaxed: 3, hat: 'leaf_wreath', skills: { woodcutting: 64, mining: 48, crafting: 55, artificing: 52, cooking: 60, monster_hunter: 59, imbuing: 50, processing: 58, taming: 67, alchemy: 59 } },
  { name: 'SamuraiLad', classId: 'bushido', tier: 'Bushido', level: 68, guild: 'Turnips', guildIcon: 'slime', kills: 14200, quests: 25, cardsCollected: 12, cardsMaxed: 4, hat: 'samurai_headband', skills: { woodcutting: 59, mining: 55, crafting: 64, artificing: 62, cooking: 53, monster_hunter: 72, imbuing: 68, processing: 60, taming: 51, alchemy: 50 } }
];
