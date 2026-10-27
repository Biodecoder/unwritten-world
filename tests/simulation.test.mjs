import test from 'node:test';
import assert from 'node:assert/strict';
import { WorldSimulation } from '../src/sim/WorldSimulation.js';
import { CLASSES, LIFE_SKILLS, MONSTERS, CRAFTING_RECIPES } from '../src/data/Catalog.js';
import { ZONES } from '../src/data/Zones.js';

test('Unwritten World — All 8 specialist classes + starter Castaway switch freely with zero level gates', () => {
  const sim = new WorldSimulation({ playerName: 'Tester' });
  const classIds = Object.keys(CLASSES);
  assert.equal(classIds.length, 9); // Castaway + 8 specialist classes

  for (const cid of classIds) {
    assert.equal(sim.changeClass(cid), true);
    assert.equal(sim.player.classId, cid);
    assert.equal(CLASSES[cid].skills.length, 6);
  }

  assert.equal(sim.promoteClassTier(), true);
  assert.equal(sim.player.classTier, 2);
});

test('Unwritten World — Side-scrolling movement, jumping, rope climbing, and 5 zone transitions', () => {
  const sim = new WorldSimulation();
  assert.equal(Object.keys(ZONES).length, 5);

  const startX = sim.player.x;
  sim.step(0.1, { right: true });
  assert.ok(sim.player.x > startX, 'Player moves right');

  // Test rope grabbing & climbing on Driftwood Shores rope (x=960)
  const rope = sim.zone.ropes[0];
  sim.player.x = rope.x;
  sim.player.y = rope.yBottom - 10;
  sim.step(0.1, { up: true });
  assert.ok(sim.player.onRope, 'Player grabs rope when pressing up near rope X');

  // Zone transitions across all 5 zones
  for (const zId of Object.keys(ZONES)) {
    assert.equal(sim.loadZone(zId), true);
    assert.equal(sim.zoneId, zId);
    assert.ok(sim.zone.platforms.length >= 3);
  }
});

test('Unwritten World — Emergent Events: Forager Goblin Acorn -> Harvestable Tree & Greed Spirit Ambush', () => {
  const sim = new WorldSimulation();
  sim.loadZone('sprout_forest');

  const initialNodes = sim.resourceNodes.length;
  const goblin = sim.monsters.find((m) => m.monsterId === 'forager_goblin');
  assert.ok(goblin, 'Sprout Forest has Forager Goblin');

  // Slay Forager Goblin and verify emergent Acorn Tree sprouts on the platform
  sim.applyMultiHitToMonster(goblin, 5, 500);
  assert.equal(goblin.dead, true);
  assert.equal(sim.resourceNodes.length, initialNodes + 1, 'Forager Goblin death sprouts an emergent harvestable Tree');
  assert.ok(sim.statsTracked.emergentTreesGrown >= 1);

  // Spawn a Greed Spirit ambush and slay it to recover its stolen hoard
  const greed = sim.spawnGreedSpirit(sim.player.x + 40, sim.player.y);
  assert.equal(greed.isLootThief, true);
  const dropsBefore = sim.groundDrops.length;
  sim.applyMultiHitToMonster(greed, 6, 800);
  assert.equal(greed.dead, true);
  assert.ok(sim.groundDrops.length > dropsBefore, 'Slaying Greed Spirit showers recovered items on the ground');
  assert.equal(sim.statsTracked.greedSpiritsCaught, 1);
});

test('Unwritten World — All 10 Life Skills, Crafter Name Inscriptions, Artificing Salvage & Wearable Monster Cards', () => {
  const sim = new WorldSimulation({ playerName: 'ArtisanHero' });
  assert.equal(LIFE_SKILLS.length, 10);

  // 1. Harvest a driftwood node
  const node = sim.resourceNodes[0];
  sim.startHarvestNode(node);
  for (let i = 0; i < 40; i++) {
    sim.step(0.05, {});
  }
  assert.equal(node.depleted, true);
  assert.ok(sim.statsTracked.treesChopped >= 1);

  // 2. Craft Sigtis Veil and verify Crafter Name Inscription
  const veilRecipe = CRAFTING_RECIPES.find((r) => r.id === 'craft_sigtis_veil');
  for (const ing of veilRecipe.ingredients) {
    sim.addItem(ing.itemId, ing.count);
  }
  const craftRes = sim.craftRecipe('craft_sigtis_veil');
  assert.equal(craftRes.ok, true);
  const veilEntry = sim.inventory.get('sigtis_veil');
  assert.equal(veilEntry.craftedBy, 'ArtisanHero');

  // Equip Sigtis Veil and Imbue Weapon with a Scroll
  assert.equal(sim.equipOrUseItem('sigtis_veil'), true);
  assert.equal(sim.equipment.hat.itemId, 'sigtis_veil');
  assert.equal(sim.equipment.hat.craftedBy, 'ArtisanHero');

  sim.addItem('scroll_of_power', 1);
  const imbueRes = sim.imbueEquipment('scroll_of_power', 'weapon');
  assert.equal(imbueRes.ok, true);
  assert.equal(sim.equipment.weapon.imbueLevel, 1);

  // 3. Artificing Research & Salvage
  sim.addItem('wood_golem_bark', 1);
  const artRes = sim.researchAndSalvageItem('wood_golem_bark');
  assert.equal(artRes.ok, true);
  assert.ok(sim.artificingKnowledge.wood_golem_bark.researchedCount >= 1);

  // 4. Wearable Monster Card in Bestiary
  sim.bestiary.wood_golem.cardsOwned = 1;
  sim.bestiary.wood_golem.cardTier = 2;
  const spellBefore = sim.player.spellPower;
  const cardRes = sim.toggleMonsterCard('wood_golem');
  assert.equal(cardRes.ok, true);
  assert.equal(cardRes.equipped, true);
  assert.ok(sim.player.spellPower > spellBefore, 'Equipped Wood Golem Card increases Spell Power');

  // 5. Leaderboard sorting includes player
  const lb = sim.getLeaderboard('level', 'All');
  assert.ok(lb.length >= 15);
  assert.ok(lb.some((r) => r.isYou && r.name === 'ArtisanHero'));
});
