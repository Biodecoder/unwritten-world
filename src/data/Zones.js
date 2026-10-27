// 5 Interconnected 2D Side-Scrolling Zones for Unwritten World

export const ZONES = {
  driftwood_shores: {
    id: 'driftwood_shores',
    regionName: 'Driftwood Shores',
    subZoneName: 'Lost At Sea',
    theme: 'beach',
    width: 2200,
    height: 760,
    spawnX: 280,
    spawnY: 590,
    platforms: [
      { id: 'ground_main', x: 0, y: 600, w: 2200, h: 160, style: 'sand', oneWay: false },
      { id: 'mid_crab_ledge', x: 220, y: 430, w: 980, h: 46, style: 'sand', oneWay: true },
      { id: 'high_shrine_ledge', x: 1120, y: 270, w: 560, h: 52, style: 'sand', oneWay: true },
      { id: 'east_cliff', x: 1580, y: 450, w: 520, h: 46, style: 'sand', oneWay: true }
    ],
    ropes: [
      { id: 'rope_mid', x: 960, yTop: 430, yBottom: 595, style: 'rope' },
      { id: 'rope_shrine', x: 1210, yTop: 270, yBottom: 430, style: 'rope' },
      { id: 'rope_east', x: 1680, yTop: 450, yBottom: 595, style: 'rope' }
    ],
    shrines: [
      { id: 'elwha_shrine', name: 'Elwha Resurrection Shrine', x: 1410, y: 270, visual: 'whale_skull_shrine' }
    ],
    portals: [
      { id: 'to_namu_rest', x: 2050, y: 600, targetZoneId: 'namu_rest', targetX: 160, targetY: 590, label: 'To Namu\'s Rest', color: '#4dd0e1' }
    ],
    workstations: [],
    npcs: [
      {
        id: 'arbaldo',
        name: 'Arbaldo',
        title: 'Castaway Guide',
        x: 680,
        y: 600,
        visual: 'npc_arbaldo',
        questId: 'into_the_crab_pit',
        dialog: 'Washed ashore too, eh? Grab some Sun-Bleached Driftwood and a Sandy Crab Claw from these Sand Crabs so we can outfit you properly!'
      }
    ],
    resourceNodes: [
      { id: 'drift_1', name: 'Driftwood Pile', skill: 'woodcutting', x: 430, y: 600, visual: 'driftwood_node', yieldItemId: 'driftwood', bonusItemId: 'stick', xp: 18, respawnSec: 6 },
      { id: 'drift_2', name: 'Driftwood Pile', skill: 'woodcutting', x: 540, y: 430, visual: 'driftwood_node', yieldItemId: 'driftwood', bonusItemId: 'stick', xp: 18, respawnSec: 6 },
      { id: 'drift_3', name: 'Driftwood Pile', skill: 'woodcutting', x: 1290, y: 600, visual: 'driftwood_node', yieldItemId: 'driftwood', bonusItemId: 'sea_salt_crystal', xp: 20, respawnSec: 6 },
      { id: 'drift_4', name: 'Coastal Scrub Tree', skill: 'woodcutting', x: 1790, y: 450, visual: 'scrub_tree', yieldItemId: 'stick', bonusItemId: 'driftwood', xp: 22, respawnSec: 7 }
    ],
    monsterSpawns: [
      { monsterId: 'sand_crab', x: 840, y: 600, minX: 740, maxX: 1180, respawnSec: 4 },
      { monsterId: 'sand_crab', x: 1060, y: 600, minX: 820, maxX: 1450, respawnSec: 4 },
      { monsterId: 'sand_crab', x: 390, y: 430, minX: 250, maxX: 750, respawnSec: 4 },
      { monsterId: 'sand_crab', x: 780, y: 430, minX: 500, maxX: 1100, respawnSec: 4 },
      { monsterId: 'coastal_hermit', x: 1520, y: 600, minX: 1320, maxX: 1920, respawnSec: 5 },
      { monsterId: 'coastal_hermit', x: 1880, y: 450, minX: 1620, maxX: 2060, respawnSec: 5 }
    ],
    ambientAdventurers: [
      { name: 'Cape', classId: 'templar', level: 14, guild: 'Turtles', guildIcon: 'frog', x: 920, y: 430, minX: 460, maxX: 1080 }
    ]
  },

  namu_rest: {
    id: 'namu_rest',
    regionName: 'Namu Forest',
    subZoneName: 'Namu\'s Rest',
    theme: 'forest_village',
    width: 2300,
    height: 760,
    spawnX: 220,
    spawnY: 590,
    platforms: [
      { id: 'village_ground', x: 0, y: 600, w: 2300, h: 160, style: 'forest_earth', oneWay: false },
      { id: 'bounty_terrace', x: 120, y: 390, w: 860, h: 48, style: 'forest_earth', oneWay: true },
      { id: 'treehouse_balcony', x: 1160, y: 410, w: 740, h: 48, style: 'forest_earth', oneWay: true }
    ],
    ropes: [
      { id: 'vine_bounty', x: 540, yTop: 390, yBottom: 595, style: 'vine' },
      { id: 'vine_balcony', x: 1420, yTop: 410, yBottom: 595, style: 'vine' }
    ],
    shrines: [
      { id: 'namu_shrine', name: 'Namu Resurrection Shrine', x: 340, y: 600, visual: 'vine_obelisk' },
      { id: 'treehouse_left', name: 'Moss Treehouse', x: 640, y: 600, visual: 'hobbit_treehouse' },
      { id: 'treehouse_center', name: 'Elder Canopy Lodge', x: 1240, y: 600, visual: 'canopy_cottage' }
    ],
    portals: [
      { id: 'back_to_shores', x: 80, y: 600, targetZoneId: 'driftwood_shores', targetX: 1940, targetY: 590, label: 'To Driftwood Shores', color: '#4dd0e1' },
      { id: 'to_sprout_forest', x: 2180, y: 600, targetZoneId: 'sprout_forest', targetX: 160, targetY: 590, label: 'To Sprout Forest', color: '#6ec25a' },
      { id: 'to_giblers_mines', x: 1840, y: 410, targetZoneId: 'giblers_mines', targetX: 180, targetY: 590, label: 'To Gibler\'s Mines', color: '#ffb74d' }
    ],
    workstations: [
      { id: 'artificing_station', name: 'Artificing Station', x: 520, y: 600, visual: 'artificing_table', modal: 'lifeskills', subTab: 'artificing' },
      { id: 'bounty_board', name: 'Bounty Board', x: 420, y: 390, visual: 'bounty_board', modal: 'quests', subTab: 'bounties' },
      { id: 'stone_forge', name: 'Stone Forge', x: 770, y: 390, visual: 'stone_forge', modal: 'crafting', subTab: 'General' },
      { id: 'crafting_table', name: 'Crafting Table', x: 1020, y: 600, visual: 'anvil_bench', modal: 'crafting', subTab: 'Armor' },
      { id: 'storage_chest', name: 'Storage', x: 1480, y: 600, visual: 'storage_chest', modal: 'inventory', subTab: 'bag' },
      { id: 'cooking_pot', name: 'Cooking Pot', x: 1690, y: 600, visual: 'cooking_pot', modal: 'crafting', subTab: 'General' },
      { id: 'sawmill', name: 'Sawmill', x: 1940, y: 600, visual: 'sawmill', modal: 'crafting', subTab: 'General' }
    ],
    npcs: [
      {
        id: 'leyesha',
        name: 'Leyesha',
        title: 'Village Steward',
        x: 1580,
        y: 600,
        visual: 'npc_leyesha',
        questId: 'getting_to_know_namu',
        dialog: 'Welcome to Namu\'s Rest! Every item you find has value here—use the Artificing Station, Sawmill, and Forge to leave your name on the gear you craft.'
      },
      {
        id: 'hunter',
        name: 'Hunter',
        title: 'Monster Hunter Guild',
        x: 260,
        y: 390,
        visual: 'npc_hunter',
        questId: 'hunting_supplies',
        dialog: 'Check the Bounty Board! Every monster in Unwritten World can drop its Wearable Monster Card for your Bestiary.'
      },
      {
        id: 'tercaf',
        name: 'Tercaf',
        title: 'Class & Lore Master',
        x: 1320,
        y: 410,
        visual: 'npc_tercaf',
        questId: 'a_cawling',
        dialog: 'In Unwritten World there are no level gates on class advancement. Try all 8 classes whenever you wish!'
      }
    ],
    resourceNodes: [
      { id: 'namu_town_tree_1', name: 'Namu Sapling', skill: 'woodcutting', x: 1120, y: 600, visual: 'oak_tree', yieldItemId: 'namu_log', bonusItemId: 'stick', xp: 28, respawnSec: 6 },
      { id: 'namu_town_tree_2', name: 'Elder Oak Tree', skill: 'woodcutting', x: 2060, y: 600, visual: 'oak_tree', yieldItemId: 'namu_log', bonusItemId: 'sprout_essence', xp: 32, respawnSec: 7 }
    ],
    monsterSpawns: [],
    ambientAdventurers: [
      { name: 'Remidum', classId: 'juggernaut', level: 55, guild: 'IronVanguard', guildIcon: 'sparkle', x: 980, y: 600, minX: 700, maxX: 1300 },
      { name: 'SigtisBoots', classId: 'shaman', level: 64, guild: 'Starlight', guildIcon: 'slime', x: 1520, y: 410, minX: 1220, maxX: 1760 }
    ]
  },

  sprout_forest: {
    id: 'sprout_forest',
    regionName: 'Namu Forest',
    subZoneName: 'Sprout Forest & Croaking Rapids',
    theme: 'deep_forest',
    width: 2600,
    height: 760,
    spawnX: 180,
    spawnY: 590,
    platforms: [
      { id: 'forest_ground', x: 0, y: 600, w: 2600, h: 160, style: 'forest_earth', oneWay: false },
      { id: 'west_canopy', x: 160, y: 430, w: 720, h: 46, style: 'forest_earth', oneWay: true },
      { id: 'statue_altar_plat', x: 960, y: 390, w: 680, h: 52, style: 'forest_earth', oneWay: true },
      { id: 'upper_boss_arena', x: 860, y: 220, w: 880, h: 46, style: 'forest_earth', oneWay: true },
      { id: 'east_goblin_plat', x: 1740, y: 420, w: 740, h: 46, style: 'forest_earth', oneWay: true }
    ],
    ropes: [
      { id: 'vine_west', x: 480, yTop: 430, yBottom: 595, style: 'vine' },
      { id: 'vine_statue', x: 1120, yTop: 390, yBottom: 595, style: 'vine' },
      { id: 'vine_boss_left', x: 1020, yTop: 220, yBottom: 390, style: 'vine' },
      { id: 'vine_boss_right', x: 1560, yTop: 220, yBottom: 390, style: 'vine' },
      { id: 'vine_east', x: 2080, yTop: 420, yBottom: 595, style: 'vine' }
    ],
    shrines: [
      { id: 'ancient_statue', name: 'Ancient Vine Guardian Statue', x: 1300, y: 390, visual: 'ancient_statue' },
      { id: 'wisp_altar', name: 'Will-o-Wisp Stone Circle', x: 520, y: 430, visual: 'wisp_stone_circle' },
      { id: 'goblin_hut', name: 'Forager Goblin Totem Hut', x: 2180, y: 420, visual: 'goblin_hut' }
    ],
    portals: [
      { id: 'back_to_namu_rest', x: 80, y: 600, targetZoneId: 'namu_rest', targetX: 2080, targetY: 590, label: 'To Namu\'s Rest', color: '#6ec25a' },
      { id: 'to_bayou_ashen', x: 2490, y: 600, targetZoneId: 'bayou_ashen', targetX: 160, targetY: 590, label: 'To Bayou & Expanse', color: '#ab47bc' }
    ],
    workstations: [],
    npcs: [
      {
        id: 'will_o_wisp',
        name: 'Will-o-Wisp',
        title: 'Ancient Forest Spirit',
        x: 520,
        y: 430,
        visual: 'npc_wisp',
        questId: 'a_wisps_needs',
        dialog: 'The stones remember the old pact... Bring me Sprout Essence and Silt Essence, and I shall bless your journey.'
      }
    ],
    resourceNodes: [
      { id: 'sprout_tree_1', name: 'Namu Fruit Tree', skill: 'woodcutting', x: 340, y: 600, visual: 'fruit_tree', yieldItemId: 'namu_log', bonusItemId: 'sprout_essence', xp: 38, respawnSec: 7 },
      { id: 'sprout_tree_2', name: 'Ancient Moss Oak', skill: 'woodcutting', x: 1460, y: 600, visual: 'oak_tree', yieldItemId: 'namu_log', bonusItemId: 'damp_moss', xp: 45, respawnSec: 8 },
      { id: 'sprout_tree_3', name: 'Canopy Timber Tree', skill: 'woodcutting', x: 1920, y: 420, visual: 'fruit_tree', yieldItemId: 'namu_log', bonusItemId: 'stick', xp: 42, respawnSec: 7 }
    ],
    monsterSpawns: [
      { monsterId: 'sproutling', x: 420, y: 600, minX: 240, maxX: 720, respawnSec: 4 },
      { monsterId: 'sproutling', x: 650, y: 600, minX: 380, maxX: 880, respawnSec: 4 },
      { monsterId: 'berry_slime', x: 310, y: 430, minX: 180, maxX: 820, respawnSec: 4 },
      { monsterId: 'berry_slime', x: 740, y: 430, minX: 260, maxX: 840, respawnSec: 4 },
      { monsterId: 'moss_frog', x: 980, y: 600, minX: 780, maxX: 1380, respawnSec: 5 },
      { monsterId: 'moss_frog', x: 1240, y: 600, minX: 880, maxX: 1520, respawnSec: 5 },
      { monsterId: 'forager_goblin', x: 1760, y: 600, minX: 1540, maxX: 2240, respawnSec: 6 },
      { monsterId: 'forager_goblin', x: 1860, y: 420, minX: 1760, maxX: 2420, respawnSec: 6 },
      { monsterId: 'wood_golem', x: 1180, y: 390, minX: 980, maxX: 1600, respawnSec: 7 },
      { monsterId: 'wood_golem', x: 2280, y: 600, minX: 1950, maxX: 2440, respawnSec: 7 },
      { monsterId: 'mutant_slime', x: 1300, y: 220, minX: 920, maxX: 1680, respawnSec: 18 }
    ],
    ambientAdventurers: [
      { name: 'Weaponize', classId: 'juggernaut', level: 72, guild: 'TheCods', guildIcon: 'sparkle', x: 1380, y: 220, minX: 940, maxX: 1640 },
      { name: 'DeepMeanings', classId: 'elementalist', level: 56, guild: 'Turtles', guildIcon: 'frog', x: 1820, y: 600, minX: 1560, maxX: 2200 },
      { name: 'Piper', classId: 'ranger', level: 76, guild: 'Wildwood', guildIcon: 'frog', x: 640, y: 430, minX: 220, maxX: 820 }
    ]
  },

  giblers_mines: {
    id: 'giblers_mines',
    regionName: 'Namu Forest',
    subZoneName: 'Gibler\'s Mines',
    theme: 'mines',
    width: 2200,
    height: 760,
    spawnX: 200,
    spawnY: 590,
    platforms: [
      { id: 'mine_floor', x: 0, y: 600, w: 2200, h: 160, style: 'mine_rock', oneWay: false },
      { id: 'mine_mid_left', x: 140, y: 420, w: 780, h: 48, style: 'mine_rock', oneWay: true },
      { id: 'mine_mid_right', x: 1060, y: 420, w: 960, h: 48, style: 'mine_rock', oneWay: true },
      { id: 'mine_upper_vein', x: 360, y: 240, w: 1420, h: 48, style: 'mine_rock', oneWay: true }
    ],
    ropes: [
      { id: 'bone_rope_1', x: 460, yTop: 420, yBottom: 595, style: 'bone_rope' },
      { id: 'bone_rope_2', x: 1340, yTop: 420, yBottom: 595, style: 'bone_rope' },
      { id: 'bone_rope_3', x: 820, yTop: 240, yBottom: 420, style: 'bone_rope' },
      { id: 'bone_rope_4', x: 1580, yTop: 240, yBottom: 420, style: 'bone_rope' }
    ],
    shrines: [
      { id: 'mine_cart_1', name: 'Abandoned Ore Cart', x: 640, y: 240, visual: 'mine_cart' },
      { id: 'mine_cart_2', name: 'Smuggler Rubble Pile', x: 1480, y: 420, visual: 'mine_cart' }
    ],
    portals: [
      { id: 'exit_to_namu_rest', x: 90, y: 600, targetZoneId: 'namu_rest', targetX: 1780, targetY: 400, label: 'To Namu\'s Rest', color: '#ffb74d' }
    ],
    workstations: [],
    npcs: [],
    resourceNodes: [
      { id: 'tin_vein_1', name: 'Tin Ore Vein', skill: 'mining', x: 360, y: 600, visual: 'tin_vein', yieldItemId: 'tin_ore', bonusItemId: 'crimson_shard', xp: 40, respawnSec: 6 },
      { id: 'tin_vein_2', name: 'Tin Ore Vein', skill: 'mining', x: 280, y: 420, visual: 'tin_vein', yieldItemId: 'tin_ore', bonusItemId: 'tin_ore', xp: 40, respawnSec: 6 },
      { id: 'tin_vein_3', name: 'Rich Tin Cluster', skill: 'mining', x: 1220, y: 420, visual: 'tin_vein', yieldItemId: 'tin_ore', bonusItemId: 'crimson_shard', xp: 48, respawnSec: 7 },
      { id: 'cobalt_vein_mine', name: 'Deep Cobalt Vein', skill: 'mining', x: 1120, y: 240, visual: 'cobalt_vein', yieldItemId: 'cobalt_crystal', bonusItemId: 'crimson_shard', xp: 65, respawnSec: 9 }
    ],
    monsterSpawns: [
      { monsterId: 'goblin_miner', x: 680, y: 600, minX: 480, maxX: 1120, respawnSec: 5 },
      { monsterId: 'goblin_miner', x: 1180, y: 600, minX: 880, maxX: 1600, respawnSec: 5 },
      { monsterId: 'goblin_miner', x: 580, y: 420, minX: 200, maxX: 880, respawnSec: 5 },
      { monsterId: 'goblin_miner', x: 1640, y: 420, minX: 1140, maxX: 1960, respawnSec: 5 },
      { monsterId: 'ore_crusher', x: 960, y: 240, minX: 440, maxX: 1680, respawnSec: 7 },
      { monsterId: 'ore_crusher', x: 1720, y: 600, minX: 1420, maxX: 2080, respawnSec: 7 }
    ],
    ambientAdventurers: [
      { name: 'SeaSnailLover', classId: 'juggernaut', level: 55, guild: 'Turtles', guildIcon: 'frog', x: 740, y: 420, minX: 320, maxX: 880 }
    ]
  },

  bayou_ashen: {
    id: 'bayou_ashen',
    regionName: 'Bayou Badlands & Ashen Expanse',
    subZoneName: 'Docwapo Lane → Into the Expanse',
    theme: 'bayou_desert',
    width: 2600,
    height: 760,
    spawnX: 180,
    spawnY: 590,
    platforms: [
      { id: 'frontier_ground', x: 0, y: 600, w: 2600, h: 160, style: 'swamp_sand', oneWay: false },
      { id: 'bayou_canopy_left', x: 140, y: 410, w: 940, h: 48, style: 'swamp_moss', oneWay: true },
      { id: 'ashen_mesa_right', x: 1240, y: 390, w: 1220, h: 52, style: 'desert_sandstone', oneWay: true },
      { id: 'high_desert_arch', x: 1520, y: 220, w: 760, h: 46, style: 'desert_sandstone', oneWay: true }
    ],
    ropes: [
      { id: 'bayou_vine_1', x: 520, yTop: 410, yBottom: 595, style: 'vine' },
      { id: 'bayou_vine_2', x: 980, yTop: 410, yBottom: 595, style: 'vine' },
      { id: 'desert_rope_1', x: 1420, yTop: 390, yBottom: 595, style: 'rope' },
      { id: 'desert_rope_2', x: 1860, yTop: 220, yBottom: 390, style: 'rope' }
    ],
    shrines: [
      { id: 'desert_egg', name: 'Fossilized Wyrm Egg', x: 1480, y: 390, visual: 'desert_egg' },
      { id: 'acacia_landmark', name: 'Scorched Acacia Oasis', x: 2240, y: 600, visual: 'acacia_tree' }
    ],
    portals: [
      { id: 'back_to_sprout', x: 80, y: 600, targetZoneId: 'sprout_forest', targetX: 2380, targetY: 590, label: 'To Sprout Forest', color: '#ab47bc' }
    ],
    workstations: [],
    npcs: [],
    resourceNodes: [
      { id: 'deadwood_1', name: 'Ashen Deadwood Tree', skill: 'woodcutting', x: 1320, y: 600, visual: 'deadwood_tree', yieldItemId: 'namu_log', bonusItemId: 'silt_essence', xp: 58, respawnSec: 7 },
      { id: 'deadwood_2', name: 'Sun-Scorched Tree', skill: 'woodcutting', x: 1620, y: 600, visual: 'deadwood_tree', yieldItemId: 'namu_log', bonusItemId: 'brittle_catalyst', xp: 62, respawnSec: 7 },
      { id: 'cobalt_expanse_1', name: 'Cobalt Crystal Outcrop', skill: 'mining', x: 1960, y: 600, visual: 'cobalt_vein', yieldItemId: 'cobalt_crystal', bonusItemId: 'silt_essence', xp: 75, respawnSec: 8 },
      { id: 'cobalt_expanse_2', name: 'Mesa Cobalt Vein', skill: 'mining', x: 2040, y: 390, visual: 'cobalt_vein', yieldItemId: 'cobalt_crystal', bonusItemId: 'ancient_catalyst', xp: 85, respawnSec: 9 }
    ],
    monsterSpawns: [
      { monsterId: 'bayou_shroom', x: 420, y: 600, minX: 200, maxX: 900, respawnSec: 5 },
      { monsterId: 'bayou_shroom', x: 780, y: 600, minX: 400, maxX: 1120, respawnSec: 5 },
      { monsterId: 'bayou_guardian', x: 460, y: 410, minX: 180, maxX: 1020, respawnSec: 6 },
      { monsterId: 'bayou_guardian', x: 840, y: 410, minX: 260, maxX: 1040, respawnSec: 6 },
      { monsterId: 'sand_chomper', x: 1480, y: 600, minX: 1220, maxX: 2100, respawnSec: 6 },
      { monsterId: 'sand_chomper', x: 1760, y: 390, minX: 1280, maxX: 2380, respawnSec: 6 },
      { monsterId: 'sand_chomper', x: 1880, y: 220, minX: 1540, maxX: 2240, respawnSec: 6 }
    ],
    ambientAdventurers: [
      { name: 'SeaSnailHater', classId: 'forest_warden', level: 56, guild: 'Turtles', guildIcon: 'frog', x: 680, y: 600, minX: 300, maxX: 1040 },
      { name: 'SamuraiLad', classId: 'bushido', level: 68, guild: 'Turnips', guildIcon: 'slime', x: 1720, y: 390, minX: 1320, maxX: 2260 }
    ]
  }
};
