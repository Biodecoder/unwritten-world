import {
  LIFE_SKILLS,
  CLASSES,
  ITEMS,
  CRAFTING_RECIPES,
  BESTIARY_REGIONS,
  MONSTERS,
  QUESTS,
  LEADERBOARD_ROSTER
} from '../data/Catalog.js';
import { ZONES } from '../data/Zones.js';

export class WorldSimulation {
  constructor(options = {}) {
    this.playerName = options.playerName || 'Piper';
    this.guildName = options.guildName || 'Turtles';
    this.guildIcon = options.guildIcon || 'frog';
    this.onEvent = options.onEvent || (() => {});

    this.time = 0;
    this.zoneId = 'driftwood_shores';
    this.zone = ZONES[this.zoneId];

    // Core Player State
    this.player = {
      name: this.playerName,
      guild: this.guildName,
      guildIcon: this.guildIcon,
      classId: 'castaway',
      classTier: 1,
      level: 1,
      xp: 0,
      xpNext: 100,
      rasa: 120,
      x: this.zone.spawnX,
      y: this.zone.spawnY,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: true,
      onRope: null,
      dropThroughTimer: 0,
      animState: 'idle',
      animTimer: 0,
      attackAnimTimer: 0,
      activeSkillVfx: null,
      hp: 180,
      maxHp: 180,
      mp: 90,
      maxMp: 90,
      shield: 0,
      attackCounter: 0,
      skillCooldowns: {},
      skillPoints: 3,
      skillRanks: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, 'R': 1 },
      buffs: [],
      harvestAction: null // { node, timer, duration, skill }
    };

    // Equipped Gear & Inscriptions
    this.equipment = {
      weapon: { itemId: 'driftwood_club', craftedBy: 'Arbaldo', imbueLevel: 0 },
      hat: null,
      armor: null,
      ring: null,
      tool: { itemId: 'sturdy_iron_axe', craftedBy: 'Namu Guild', imbueLevel: 0 },
      pet: { itemId: 'crimson_finch_charm', craftedBy: 'Wild', imbueLevel: 0 }
    };

    // Activity Feed & Chat Log
    this.activityFeed = [
      { id: 'act-1', text: 'Welcome to Unwritten World! Every item matters.', color: '#ffd54f', time: 0 }
    ];
    this.chatLog = [
      { id: 'chat-1', sender: 'System', channel: 'World', text: 'Welcome to Unwritten World! No level gates—press [C] to try all 8 classes anytime.', color: '#ffd54f' },
      { id: 'chat-2', sender: 'SeaSnailLover', channel: 'All', text: 'Average loadout: 9 items. Lv 55 Juggernaut III.', color: '#90caf9' },
      { id: 'chat-3', sender: 'Precision', channel: 'All', text: 'Watch out for Greed Spirits in Croaking Rapids, one just tried to run off with my Scroll!', color: '#ce93d8' }
    ];

    // Quests & Bounties
    this.questState = {};
    for (const q of QUESTS) {
      this.questState[q.id] = {
        id: q.id,
        accepted: true,
        completed: false,
        turnedIn: false,
        progress: q.objectives.map(() => 0)
      };
    }

    // Inventory Bag (itemId -> { count, craftedBy, imbueLevel })
    this.inventory = new Map();
    this.addItem('stick', 6);
    this.addItem('driftwood', 2);
    this.addItem('minor_hp_potion', 15);
    this.addItem('minor_mp_potion', 10);
    this.addItem('roasted_frog_skewer', 3);
    this.addItem('scroll_of_power', 1);

    // 10 Life Skills State
    this.lifeSkills = {};
    for (const sk of LIFE_SKILLS) {
      this.lifeSkills[sk.id] = {
        id: sk.id,
        name: sk.name,
        level: 1,
        xp: 0,
        xpNext: 60
      };
    }

    // Artificing Knowledge (itemId -> { researchedCount, unlocked })
    this.artificingKnowledge = {};

    // Bestiary & Wearable Monster Cards
    this.bestiary = {};
    for (const mId of Object.keys(MONSTERS)) {
      this.bestiary[mId] = {
        kills: mId === 'wood_golem' ? 12 : 0,
        cardsOwned: mId === 'sand_crab' ? 1 : 0,
        cardTier: mId === 'sand_crab' ? 1 : 0,
        discoveredDrops: new Set()
      };
    }
    // Pre-discover Wood Golem common drops like ss_8.jpg
    this.bestiary.wood_golem.discoveredDrops.add('wood_golem_bark');
    this.bestiary.wood_golem.discoveredDrops.add('damp_moss');
    this.bestiary.wood_golem.discoveredDrops.add('brittle_catalyst');

    this.equippedCards = new Set(['sand_crab']);
    this.maxEquippedCards = 3;

    this.bounties = [
      { id: 'bounty_crabs', title: 'Coastal Cull: Sand Crabs', monsterId: 'sand_crab', target: 5, kills: 0, xpReward: 95, rasaReward: 120, completed: false },
      { id: 'bounty_goblins', title: 'Acorn Raiders: Forager Goblins', monsterId: 'forager_goblin', target: 4, kills: 0, xpReward: 240, rasaReward: 280, completed: false },
      { id: 'bounty_golems', title: 'Heartwood Threat: Wood Golems', monsterId: 'wood_golem', target: 3, kills: 0, xpReward: 420, rasaReward: 480, completed: false }
    ];

    // Complete Stat Tracking (Steam Desc: "If you do it, it's probably tracked")
    this.statsTracked = {
      monstersSlain: 12,
      bossesSlain: 0,
      greedSpiritsCaught: 0,
      emergentTreesGrown: 0,
      treesChopped: 0,
      oresMined: 0,
      itemsCrafted: 0,
      itemsResearched: 0,
      scrollsImbued: 0,
      totalRasaEarned: 120,
      questsCompleted: 0
    };

    // Dynamic World Entities in Current Zone
    this.monsters = [];
    this.resourceNodes = [];
    this.groundDrops = [];
    this.projectiles = [];
    this.vfxEffects = [];
    this.floatingTexts = [];
    this.ambientAdventurers = [];
    this.remotePeers = [];

    // Boss Encounter Bar Tracker (Matching ss_6.jpg: Mutant Slime x281 -198,258)
    this.activeBossHud = null;

    // Pet companion state
    this.petEntity = {
      x: this.player.x - 42,
      y: this.player.y,
      facing: 1,
      bobPhase: 0
    };

    this.recalculateStats(true);
    this.loadZone(this.zoneId, this.zone.spawnX, this.zone.spawnY);
    this.syncQuestItems();
  }

  // Compute total player stats from Class + Level + Gear + Equipped Monster Cards + Active Buffs
  recalculateStats(fullRestore = false) {
    const cls = CLASSES[this.player.classId] || CLASSES.castaway;
    const lvl = this.player.level;
    const tierMult = 1 + (this.player.classTier - 1) * 0.18;

    let maxHp = Math.round((cls.baseStats.hp + (lvl - 1) * 28) * tierMult);
    let maxMp = Math.round((cls.baseStats.mp + (lvl - 1) * 14) * tierMult);
    let atk = Math.round((cls.baseStats.atk + (lvl - 1) * 4.5) * tierMult);
    let spellPower = Math.round((cls.baseStats.spellPower + (lvl - 1) * 4.5) * tierMult);
    let def = Math.round(cls.baseStats.def + (lvl - 1) * 2.2);
    let critChance = cls.baseStats.critChance;
    let dodgeChance = cls.baseStats.dodgeChance;
    let speed = cls.baseStats.speed;
    let woodcuttingSpeed = 1.0;
    let dropBonus = 0;
    let hpRegen = Math.max(4, Math.round(maxHp * 0.015));
    let mpRegen = Math.max(5, Math.round(maxMp * 0.025));

    // Add Equipment stats + Imbue bonuses
    for (const slot of Object.keys(this.equipment)) {
      const eq = this.equipment[slot];
      if (!eq) continue;
      const item = ITEMS[eq.itemId];
      if (!item || !item.stats) continue;
      const imbue = eq.imbueLevel || 0;
      if (item.stats.hp) maxHp += item.stats.hp + imbue * 25;
      if (item.stats.mp) maxMp += item.stats.mp + imbue * 15;
      if (item.stats.atk) atk += item.stats.atk + imbue * 5;
      if (item.stats.spellPower) spellPower += item.stats.spellPower + imbue * 5;
      if (item.stats.def) def += item.stats.def + imbue * 4;
      if (item.stats.critChance) critChance += item.stats.critChance;
      if (item.stats.dodgeChance) dodgeChance += item.stats.dodgeChance;
      if (item.stats.speed) speed += item.stats.speed;
      if (item.stats.woodcuttingSpeed) woodcuttingSpeed += item.stats.woodcuttingSpeed;
    }

    // Add Wearable Monster Card bonuses
    for (const mId of this.equippedCards) {
      const m = MONSTERS[mId];
      const entry = this.bestiary[mId];
      if (!m || !m.card) continue;
      const tierScale = Math.max(1, entry?.cardTier || 1);
      const val = m.card.value * tierScale;
      if (m.card.stat === 'hp') maxHp += val;
      if (m.card.stat === 'mp') maxMp += val;
      if (m.card.stat === 'atk') atk += val;
      if (m.card.stat === 'spellPower') spellPower += val;
      if (m.card.stat === 'def') def += val;
      if (m.card.stat === 'critChance') critChance += val;
      if (m.card.stat === 'dodgeChance') dodgeChance += val;
      if (m.card.stat === 'woodcuttingSpeed') woodcuttingSpeed += val;
      if (m.card.stat === 'dropBonus') dropBonus += val;
    }

    // Add Active Buffs
    let atkMult = 1;
    for (const buff of this.player.buffs) {
      if (buff.atkBonus) atkMult += buff.atkBonus;
      if (buff.defBonus) def += buff.defBonus;
      if (buff.critBonus) critChance += buff.critBonus;
      if (buff.dodgeBonus) dodgeChance += buff.dodgeBonus;
      if (buff.speedBonus) speed *= 1 + buff.speedBonus;
      if (buff.hpRegenBonus) hpRegen += buff.hpRegenBonus;
      if (buff.mpRegenBonus) mpRegen += buff.mpRegenBonus;
      if (buff.dropBonus) dropBonus += buff.dropBonus;
    }

    this.player.maxHp = Math.round(maxHp);
    this.player.maxMp = Math.round(maxMp);
    this.player.atk = Math.round(atk * atkMult);
    this.player.spellPower = Math.round(spellPower * atkMult);
    this.player.def = Math.round(def);
    this.player.critChance = Math.min(0.85, critChance);
    this.player.dodgeChance = Math.min(0.65, dodgeChance);
    this.player.speed = Math.round(speed);
    this.player.woodcuttingSpeed = woodcuttingSpeed;
    this.player.dropBonus = dropBonus;
    this.player.hpRegen = hpRegen;
    this.player.mpRegen = mpRegen;

    if (fullRestore) {
      this.player.hp = this.player.maxHp;
      this.player.mp = this.player.maxMp;
    } else {
      this.player.hp = Math.min(this.player.hp, this.player.maxHp);
      this.player.mp = Math.min(this.player.mp, this.player.maxMp);
    }
  }

  loadZone(zoneId, spawnX = null, spawnY = null) {
    const z = ZONES[zoneId];
    if (!z) return false;
    this.zoneId = zoneId;
    this.zone = z;
    this.player.x = spawnX !== null ? spawnX : z.spawnX;
    this.player.y = spawnY !== null ? spawnY : z.spawnY;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.onRope = null;
    this.player.harvestAction = null;
    this.activeBossHud = null;

    this.petEntity.x = this.player.x - 40;
    this.petEntity.y = this.player.y;

    // Populate Resource Nodes
    this.resourceNodes = z.resourceNodes.map((n) => ({
      ...n,
      depleted: false,
      respawnTimer: 0,
      isEmergent: false
    }));

    // Populate Monsters
    this.monsters = z.monsterSpawns.map((s, idx) => {
      const tpl = MONSTERS[s.monsterId];
      return {
        uid: `mob-${zoneId}-${idx}`,
        monsterId: s.monsterId,
        name: tpl.name,
        level: tpl.level,
        visual: tpl.visual,
        isBoss: Boolean(tpl.isBoss),
        isLootThief: Boolean(tpl.isLootThief),
        spawnsAcornTree: Boolean(tpl.spawnsAcornTree),
        x: s.x,
        y: s.y,
        spawnX: s.x,
        spawnY: s.y,
        minX: s.minX,
        maxX: s.maxX,
        vx: (idx % 2 === 0 ? 1 : -1) * 42,
        facing: idx % 2 === 0 ? 1 : -1,
        hp: tpl.hp,
        maxHp: tpl.hp,
        maxHpDisplay: tpl.maxHpDisplay || tpl.hp,
        atk: tpl.atk,
        def: tpl.def,
        xp: tpl.xp,
        dead: false,
        respawnTimer: 0,
        respawnSec: s.respawnSec || 5,
        aggroTimer: 0,
        attackCooldown: 1.5,
        hitFlash: 0,
        comboHits: 0,
        cumulativeDamage: 0
      };
    });

    // Populate Ambient AI Adventurers
    this.ambientAdventurers = (z.ambientAdventurers || []).map((a, i) => ({
      ...a,
      uid: `adv-${zoneId}-${i}`,
      vx: (i % 2 === 0 ? 1 : -1) * 58,
      facing: i % 2 === 0 ? 1 : -1,
      attackTimer: 1.2 + i * 0.6,
      animPhase: i * 1.7
    }));

    this.groundDrops = [];
    this.projectiles = [];
    this.vfxEffects = [];

    this.pushActivity(`Entered ${z.regionName} — ${z.subZoneName}`, '#80deea');
    this.onEvent({ type: 'zone_changed', zoneId });
    return true;
  }

  pushActivity(text, color = '#e0e6ed') {
    this.activityFeed.push({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text,
      color,
      time: this.time
    });
    if (this.activityFeed.length > 8) {
      this.activityFeed.shift();
    }
  }

  pushChat(sender, text, channel = 'All', color = '#ffffff') {
    this.chatLog.push({
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender,
      channel,
      text,
      color
    });
    if (this.chatLog.length > 40) {
      this.chatLog.shift();
    }
  }

  spawnFloatingText(x, y, text, style = 'normal', subText = null) {
    this.floatingTexts.push({
      id: `fct-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x,
      y,
      vy: -52,
      text: String(text),
      subText,
      style, // 'normal' | 'crit' | 'dodge' | 'miss' | 'heal' | 'extra' | 'xp'
      timer: 1.15,
      maxTimer: 1.15
    });
  }

  addItem(itemId, count = 1, meta = {}) {
    if (!ITEMS[itemId] || count <= 0) return;
    const existing = this.inventory.get(itemId);
    const isFirstDiscovery = !existing;
    if (existing) {
      existing.count += count;
      if (meta.craftedBy) existing.craftedBy = meta.craftedBy;
      if (meta.imbueLevel) existing.imbueLevel = Math.max(existing.imbueLevel || 0, meta.imbueLevel);
    } else {
      this.inventory.set(itemId, {
        itemId,
        count,
        craftedBy: meta.craftedBy || null,
        imbueLevel: meta.imbueLevel || 0
      });
    }
    if (isFirstDiscovery && ITEMS[itemId].category === 'Material') {
      this.pushChat('You', `New resource discovered: ${ITEMS[itemId].name}!`, 'All', '#a5d6a7');
    }
    this.syncQuestItems();
  }

  getItemCount(itemId) {
    return this.inventory.get(itemId)?.count || 0;
  }

  removeItem(itemId, count = 1) {
    const entry = this.inventory.get(itemId);
    if (!entry || entry.count < count) return false;
    entry.count -= count;
    if (entry.count <= 0) {
      this.inventory.delete(itemId);
    }
    this.syncQuestItems();
    return true;
  }

  // Switch or advance class at any time (Steam Desc: "Class advancements and quests have no level requirements")
  changeClass(classId, promoteTier = null) {
    if (!CLASSES[classId]) return false;
    this.player.classId = classId;
    if (promoteTier !== null) {
      this.player.classTier = Math.max(1, Math.min(3, promoteTier));
    }
    this.recalculateStats(false);
    const cls = CLASSES[classId];
    const roman = this.player.classTier === 3 ? ' III' : this.player.classTier === 2 ? ' II' : '';
    this.pushActivity(`Advanced to ${cls.name}${roman}!`, cls.color);
    this.pushChat('You', `Loadout updated: Lv ${this.player.level} ${cls.name}${roman}.`, 'All', '#81d4fa');
    this.onEvent({ type: 'class_changed', classId });
    return true;
  }

  promoteClassTier() {
    if (this.player.classTier >= 3) return false;
    this.player.classTier += 1;
    this.recalculateStats(true);
    const cls = CLASSES[this.player.classId];
    const roman = this.player.classTier === 3 ? 'III' : 'II';
    this.pushChat('World', `[Milestone] ${this.player.name} promoted to ${cls.name} ${roman}!`, 'World', '#ffd54f');
    this.spawnFloatingText(this.player.x, this.player.y - 70, `${cls.name.toUpperCase()} ${roman}!`, 'crit');
    return true;
  }

  gainXp(amount) {
    this.player.xp += amount;
    this.pushActivity(`Experience +${amount}`, '#fff59d');
    while (this.player.xp >= this.player.xpNext) {
      this.player.xp -= this.player.xpNext;
      this.player.level += 1;
      this.player.xpNext = Math.round(100 * Math.pow(this.player.level, 1.35));
      this.player.skillPoints += 1;
      this.recalculateStats(true);
      this.pushChat('You', `Level up! You are now level ${this.player.level}.`, 'All', '#ffd54f');
      this.spawnFloatingText(this.player.x, this.player.y - 68, `LEVEL ${this.player.level}!`, 'crit');
      this.onEvent({ type: 'level_up', level: this.player.level });
    }
  }

  gainLifeSkillXp(skillId, amount) {
    const sk = this.lifeSkills[skillId];
    if (!sk) return;
    sk.xp += amount;
    this.pushActivity(`${sk.name} +${amount} Exp`, '#a5d6a7');
    while (sk.xp >= sk.xpNext) {
      sk.xp -= sk.xpNext;
      sk.level += 1;
      sk.xpNext = Math.round(60 * Math.pow(sk.level, 1.28));
      this.pushChat('You', `${sk.name} skill increased to Level ${sk.level}!`, 'All', '#81c784');
      this.spawnFloatingText(this.player.x, this.player.y - 60, `${sk.name} Lv.${sk.level}!`, 'extra');
    }
  }

  // Use a class skill (Slots 1, 2, 3, 4, 5, R)
  useSkill(slotKey) {
    const cls = CLASSES[this.player.classId] || CLASSES.castaway;
    const skill = cls.skills.find((s) => s.slot.toUpperCase() === String(slotKey).toUpperCase());
    if (!skill) return false;

    const cdLeft = this.player.skillCooldowns[skill.id] || 0;
    if (cdLeft > 0) return false;
    if (this.player.mp < skill.mpCost) {
      this.spawnFloatingText(this.player.x, this.player.y - 45, 'NO MANA', 'miss');
      return false;
    }

    // Interrupt harvesting if attacking
    this.player.harvestAction = null;
    this.player.mp -= skill.mpCost;
    this.player.skillCooldowns[skill.id] = skill.cooldown;
    this.player.attackAnimTimer = 0.36;
    this.player.activeSkillVfx = { type: skill.vfx, timer: 0.42 };

    // Apply dash if skill has one
    if (skill.dash) {
      const newX = this.player.x + this.player.facing * skill.dash;
      this.player.x = Math.max(40, Math.min(this.zone.width - 40, newX));
    }

    // Apply Ward Shield if skill grants one
    if (skill.shieldPct) {
      const shieldAdd = Math.round(this.player.maxHp * skill.shieldPct);
      this.player.shield = Math.min(this.player.maxHp, this.player.shield + shieldAdd);
      this.spawnFloatingText(this.player.x, this.player.y - 50, `+${shieldAdd} SHIELD`, 'heal');
    }

    // Apply Buff if skill has one
    if (skill.buff) {
      this.applyBuff(skill.buff);
      if (skill.buff.healPct) {
        const healAmt = Math.round(this.player.maxHp * skill.buff.healPct);
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmt);
        this.spawnFloatingText(this.player.x, this.player.y - 45, `+${healAmt}`, 'heal');
      }
      if (skill.id === 'mana_conduit') {
        const mpAmt = Math.round(this.player.maxMp * 0.35);
        this.player.mp = Math.min(this.player.maxMp, this.player.mp + mpAmt);
      }
    }

    // Spawn VFX at player or forward
    this.vfxEffects.push({
      id: `vfx-${Date.now()}-${Math.random()}`,
      type: skill.vfx,
      x: this.player.x + this.player.facing * Math.min(90, (skill.range || 80) * 0.45),
      y: this.player.y - 28,
      facing: this.player.facing,
      timer: 0.45,
      maxTimer: 0.45
    });

    // If offensive skill, hit monsters in range
    if (skill.hits && skill.range) {
      const rank = this.player.skillRanks[skill.slot] || 1;
      const rankMult = 1 + (rank - 1) * 0.12;
      const basePower = Math.max(this.player.atk, this.player.spellPower);

      // Find targets in facing direction (or all around for AoE / Ultimate R)
      const isAllAround = skill.slot === 'R' || skill.id === 'whirlwind_tempest' || skill.id === 'sacred_scripture';
      const targets = this.monsters.filter((m) => {
        if (m.dead) return false;
        const dx = m.x - this.player.x;
        const dy = Math.abs(m.y - this.player.y);
        if (dy > 95) return false;
        if (isAllAround) return Math.abs(dx) <= skill.range;
        return (this.player.facing > 0 ? dx >= -35 && dx <= skill.range : dx <= 35 && dx >= -skill.range);
      });

      // Spawn visual projectile if ranged
      if (skill.projectile) {
        this.projectiles.push({
          id: `proj-${Date.now()}-${Math.random()}`,
          type: skill.projectile,
          x: this.player.x + this.player.facing * 24,
          y: this.player.y - 28,
          vx: this.player.facing * 560,
          timer: 0.55
        });
      }

      // Unique item passive: Corrupted Signet of the Gods triggers every 5th attack
      this.player.attackCounter += 1;
      const hasGodSignet = this.equipment.ring?.itemId === 'corrupted_signet_of_the_gods';
      const procGodNova = hasGodSignet && this.player.attackCounter % 5 === 0;

      for (const mob of targets.slice(0, 5)) {
        this.applyMultiHitToMonster(mob, skill.hits, basePower * skill.dmgMult * rankMult, skill.bonusRasa || 0);
        if (procGodNova) {
          this.vfxEffects.push({
            id: `vfx-god-${Date.now()}`,
            type: 'lightning_pillar',
            x: mob.x,
            y: mob.y - 30,
            facing: 1,
            timer: 0.5,
            maxTimer: 0.5
          });
          this.applyMultiHitToMonster(mob, 2, basePower * 1.8, 0);
        }
      }
    }

    this.onEvent({ type: 'skill_used', skillId: skill.id });
    return true;
  }

  applyBuff(buffDef) {
    const existingIdx = this.player.buffs.findIndex((b) => b.id === buffDef.id);
    const newBuff = { ...buffDef, remaining: buffDef.duration };
    if (existingIdx >= 0) {
      this.player.buffs[existingIdx] = newBuff;
    } else {
      this.player.buffs.push(newBuff);
    }
    this.recalculateStats(false);
  }

  applyMultiHitToMonster(mob, hitCount, rawDamagePerHit, bonusRasa = 0) {
    if (mob.dead) return;
    mob.aggroTimer = 8.0;
    mob.hitFlash = 0.22;

    let totalDealt = 0;
    for (let i = 0; i < hitCount; i++) {
      const variance = 0.9 + Math.random() * 0.22;
      const isCrit = Math.random() < this.player.critChance;
      const critMult = isCrit ? 1.85 : 1.0;
      const mitigated = Math.max(1, rawDamagePerHit * variance * critMult - mob.def * 0.35);
      const dmg = Math.round(mitigated);
      totalDealt += dmg;

      // MapleStory-style stacked damage cascade
      const offsetY = -38 - i * 24;
      const offsetX = (i % 2 === 0 ? -1 : 1) * 8;
      this.spawnFloatingText(
        mob.x + offsetX,
        mob.y + offsetY,
        dmg.toLocaleString(),
        isCrit ? 'crit' : 'normal',
        isCrit && i === hitCount - 1 ? 'LUCKY!' : null
      );
    }

    mob.hp = Math.max(0, mob.hp - totalDealt);
    mob.comboHits += hitCount;
    mob.cumulativeDamage += totalDealt;

    if (bonusRasa > 0) {
      this.spawnGroundDrop(mob.x, mob.y, { type: 'rasa', amount: bonusRasa });
    }

    // Update top-center Boss Health Bar (ss_6.jpg style)
    if (mob.isBoss || mob.isLootThief) {
      const displayScale = mob.maxHpDisplay / mob.maxHp;
      this.activeBossHud = {
        name: mob.name,
        visual: mob.visual,
        hp: Math.round(mob.hp * displayScale),
        maxHp: mob.maxHpDisplay,
        comboHits: mob.comboHits,
        cumulativeDamage: Math.round(mob.cumulativeDamage * displayScale)
      };
    }

    if (mob.hp <= 0) {
      this.handleMonsterDeath(mob);
    }
  }

  handleMonsterDeath(mob) {
    mob.dead = true;
    mob.respawnTimer = mob.respawnSec;
    this.statsTracked.monstersSlain += 1;

    const tpl = MONSTERS[mob.monsterId];
    const bEntry = this.bestiary[mob.monsterId];
    if (bEntry) {
      bEntry.kills += 1;
    }

    // Grant XP and Monster Hunter XP
    this.gainXp(mob.xp);
    this.gainLifeSkillXp('monster_hunter', Math.max(6, Math.round(mob.xp * 0.25)));

    // Update Quest & Bounty kill objectives
    this.recordKillForQuestsAndBounties(mob.monsterId);

    // Drop Rasa coins
    const rasaAmt = Math.round(tpl.rasaMin + Math.random() * (tpl.rasaMax - tpl.rasaMin));
    this.spawnGroundDrop(mob.x - 14, mob.y, { type: 'rasa', amount: rasaAmt });

    // Roll regional drop table
    const luckMult = 1 + (this.player.dropBonus || 0);
    for (const drop of tpl.drops) {
      if (Math.random() < drop.chance * luckMult) {
        this.spawnGroundDrop(mob.x + (Math.random() - 0.5) * 38, mob.y, {
          type: 'item',
          itemId: drop.itemId,
          count: 1
        });
        if (bEntry) {
          bEntry.discoveredDrops.add(drop.itemId);
        }
      }
    }

    // Roll Wearable Monster Card drop!
    const cardChance = Math.min(0.35, (1 / Math.max(15, tpl.card.odds * 0.12)) * luckMult);
    if (Math.random() < cardChance && bEntry) {
      bEntry.cardsOwned += 1;
      bEntry.cardTier = Math.min(5, Math.max(1, Math.floor(Math.log2(bEntry.cardsOwned + 1))));
      this.pushActivity(`Discovered ${tpl.name} Monster Card!`, '#ce93d8');
      this.pushChat('World', `[Bestiary] ${this.player.name} found a ${tpl.name} Card (${tpl.card.statLabel})!`, 'World', '#ce93d8');
      this.spawnFloatingText(mob.x, mob.y - 65, 'MONSTER CARD!', 'crit');
    }

    // EMERGENT EVENT 1: Slaying a Forager Goblin drops an acorn that instantly sprouts into a harvestable tree!
    if (mob.spawnsAcornTree) {
      this.triggerAcornTreeSprout(mob.x, mob.y);
    }

    // EMERGENT EVENT 2: Slaying a Greed Spirit explodes into a jackpot loot shower of stolen items!
    if (mob.isLootThief) {
      this.statsTracked.greedSpiritsCaught += 1;
      const stolenList = mob.stolenItems || [
        { itemId: 'scroll_of_power', count: 1 },
        { itemId: 'ancient_catalyst', count: 1 },
        { itemId: 'crimson_shard', count: 2 }
      ];
      for (let i = 0; i < stolenList.length; i++) {
        this.spawnGroundDrop(mob.x + (i - 1) * 28, mob.y, {
          type: 'item',
          itemId: stolenList[i].itemId,
          count: stolenList[i].count
        });
      }
      this.spawnGroundDrop(mob.x, mob.y, { type: 'rasa', amount: 350 });
      this.pushChat('World', `[Emergent Event] ${this.player.name} caught a fleeing Greed Spirit and recovered its stolen hoard!`, 'World', '#ffd54f');
      this.spawnFloatingText(mob.x, mob.y - 75, 'HOARD RECOVERED!', 'crit');
      this.activeBossHud = null;
    } else if (mob.isBoss) {
      this.statsTracked.bossesSlain += 1;
      this.pushChat('World', `[Boss Defeated] ${this.player.name} vanquished the Mutant Slime!`, 'World', '#ff8a65');
      this.activeBossHud = null;
    } else {
      // 14% chance on normal monster kill to attract a shadowy Greed Spirit ambush if none active!
      const hasActiveGreed = this.monsters.some((m) => m.isLootThief && !m.dead);
      if (!hasActiveGreed && this.groundDrops.length >= 2 && Math.random() < 0.14) {
        this.spawnGreedSpirit(mob.x + 90, mob.y);
      }
    }
  }

  // Signature Emergent Event: Forager Goblin Acorn -> Instant Harvestable Tree (frames 10 & 11 of trailer)
  triggerAcornTreeSprout(x, y) {
    this.statsTracked.emergentTreesGrown += 1;
    // Blossom star flash VFX (frame_10.jpg)
    this.vfxEffects.push({
      id: `vfx-acorn-${Date.now()}`,
      type: 'acorn_blossom',
      x,
      y: y - 35,
      facing: 1,
      timer: 0.75,
      maxTimer: 0.75
    });
    // Spawn harvestable emergent tree right on the platform (frame_11.jpg)
    const emergentNode = {
      id: `emergent-tree-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: 'Tree (Sprouted Acorn)',
      skill: 'woodcutting',
      x,
      y,
      visual: 'emergent_acorn_tree',
      yieldItemId: 'namu_log',
      bonusItemId: 'sprout_essence',
      xp: 65,
      respawnSec: 0,
      depleted: false,
      isEmergent: true
    };
    this.resourceNodes.push(emergentNode);
    this.pushActivity('A slain Forager Goblin\'s acorn sprouted into a harvestable Tree!', '#69f0ae');
    this.spawnFloatingText(x, y - 55, 'ACORN SPROUTED!', 'extra');
    this.onEvent({ type: 'emergent_tree', x, y });
  }

  // Signature Emergent Event: Greed Spirit Ambush & Loot Theft (ss_3.jpg & vid_3_combat.mp4)
  spawnGreedSpirit(x = null, y = null) {
    const spawnX = x !== null ? Math.max(100, Math.min(this.zone.width - 100, x)) : Math.min(this.zone.width - 160, this.player.x + 140);
    const spawnY = y !== null ? y : this.player.y;
    const tpl = MONSTERS.greed_spirit;

    // Steal up to 2 ground drops if any are nearby, plus carry a stolen Scroll overhead (like ss_3.jpg!)
    const stolenItems = [{ itemId: 'scroll_of_power', count: 1 }, { itemId: 'brittle_catalyst', count: 1 }];
    for (let i = this.groundDrops.length - 1; i >= 0 && stolenItems.length < 4; i--) {
      const d = this.groundDrops[i];
      if (d.type === 'item') {
        stolenItems.push({ itemId: d.itemId, count: d.count });
        this.groundDrops.splice(i, 1);
      }
    }

    const greedMob = {
      uid: `greed-${Date.now()}`,
      monsterId: 'greed_spirit',
      name: 'Lv 70 Greed Spirit',
      level: 70,
      visual: 'greed_spirit',
      isBoss: false,
      isLootThief: true,
      stolenIcon: 'scroll_purple',
      stolenItems,
      escapeTimer: 22.0,
      x: spawnX,
      y: spawnY,
      spawnX,
      spawnY,
      minX: 80,
      maxX: this.zone.width - 80,
      vx: this.player.x < spawnX ? 75 : -75,
      facing: this.player.x < spawnX ? 1 : -1,
      hp: tpl.hp,
      maxHp: tpl.hp,
      maxHpDisplay: tpl.hp,
      atk: tpl.atk,
      def: tpl.def,
      xp: tpl.xp,
      dead: false,
      respawnTimer: 0,
      respawnSec: 0,
      aggroTimer: 20,
      attackCooldown: 2.0,
      hitFlash: 0,
      comboHits: 0,
      cumulativeDamage: 0
    };

    this.monsters.push(greedMob);
    this.pushChat('World', '[Emergent Event] A Greed Spirit ambushed the area and stole a Scroll! Chase it down before it flees!', 'World', '#ce93d8');
    this.spawnFloatingText(spawnX, spawnY - 60, 'GREED SPIRIT AMBUSH!', 'crit');
    this.onEvent({ type: 'greed_spirit_spawned', mob: greedMob });
    return greedMob;
  }

  spawnGroundDrop(x, y, payload) {
    this.groundDrops.push({
      id: `drop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: Math.max(40, Math.min(this.zone.width - 40, x)),
      y,
      vy: -140,
      ...payload,
      timer: 45
    });
  }

  pickupNearbyDrops(radius = 85) {
    let picked = 0;
    for (let i = this.groundDrops.length - 1; i >= 0; i--) {
      const d = this.groundDrops[i];
      const dist = Math.hypot(d.x - this.player.x, d.y - this.player.y);
      const petDist = this.equipment.pet ? Math.hypot(d.x - this.petEntity.x, d.y - this.petEntity.y) : 9999;
      if (dist <= radius || petDist <= 75) {
        if (d.type === 'rasa') {
          this.player.rasa += d.amount;
          this.statsTracked.totalRasaEarned += d.amount;
          this.pushActivity(`+${d.amount} Rasa`, '#ffd54f');
        } else if (d.type === 'item') {
          const item = ITEMS[d.itemId];
          this.addItem(d.itemId, d.count || 1);
          if (item) {
            this.pushActivity(`Looted ${item.name} x${d.count || 1}`, '#b3e5fc');
          }
        }
        this.groundDrops.splice(i, 1);
        picked += 1;
      }
    }
    return picked;
  }

  // Start harvesting a tree or ore vein (Overhead progress bar like ss_5.jpg & vid_3_combat.mp4)
  startHarvestNode(node) {
    if (!node || node.depleted) return false;
    const baseTime = node.skill === 'woodcutting' ? 1.5 / (this.player.woodcuttingSpeed || 1) : 1.6;
    this.player.harvestAction = {
      node,
      skill: node.skill,
      timer: 0,
      duration: Math.max(0.55, baseTime)
    };
    return true;
  }

  completeHarvestNode(node) {
    if (!node || node.depleted) return;
    node.depleted = true;
    node.respawnTimer = node.respawnSec || 6;

    // Remove one-time emergent acorn trees once chopped
    if (node.isEmergent) {
      this.resourceNodes = this.resourceNodes.filter((n) => n.id !== node.id);
    }

    const yieldCount = 1;
    this.addItem(node.yieldItemId, yieldCount);
    const mainItem = ITEMS[node.yieldItemId];
    this.pushActivity(`Looted ${mainItem?.name || node.yieldItemId} x${yieldCount}`, '#a5d6a7');

    // Roll EXTRA! proc (shown at 00:00 in vid_3_combat.mp4!)
    const extraChance = 0.35;
    if (Math.random() < extraChance) {
      const bonusId = node.bonusItemId || node.yieldItemId;
      this.addItem(bonusId, 1);
      this.spawnFloatingText(node.x, node.y - 55, `+${node.xp} Exp`, 'xp', 'EXTRA!');
    } else {
      this.spawnFloatingText(node.x, node.y - 50, `+${node.xp} Exp`, 'xp');
    }

    this.gainLifeSkillXp(node.skill, node.xp);
    this.gainXp(Math.round(node.xp * 0.6));

    if (node.skill === 'woodcutting') this.statsTracked.treesChopped += 1;
    if (node.skill === 'mining') this.statsTracked.oresMined += 1;
  }

  // Craft an item from CRAFTING_RECIPES (Inscribes player's name on crafted equipment!)
  craftRecipe(recipeId) {
    const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return { ok: false, reason: 'Recipe not found' };

    for (const ing of recipe.ingredients) {
      if (this.getItemCount(ing.itemId) < ing.count) {
        return { ok: false, reason: `Missing ${ITEMS[ing.itemId]?.name || ing.itemId}` };
      }
    }

    for (const ing of recipe.ingredients) {
      this.removeItem(ing.itemId, ing.count);
    }

    const outItem = ITEMS[recipe.outputId];
    const isEquip = outItem && ['Weapon', 'Armor', 'Jewelry', 'Tool'].includes(outItem.category);
    this.addItem(recipe.outputId, recipe.outputCount, {
      craftedBy: isEquip ? this.player.name : null
    });

    recipe.isNew = false;
    this.statsTracked.itemsCrafted += 1;
    this.gainLifeSkillXp(recipe.skill || 'crafting', recipe.xpReward);
    this.gainXp(Math.max(10, Math.round(recipe.xpReward * 0.25)));

    const msg = isEquip
      ? `Crafted ${outItem.name} (Inscribed: Crafted by ${this.player.name})!`
      : `Crafted ${outItem.name} x${recipe.outputCount}!`;
    this.pushActivity(msg, '#ffd54f');
    this.spawnFloatingText(this.player.x, this.player.y - 58, `CRAFTED +${recipe.xpReward} XP`, 'extra');
    return { ok: true, item: outItem };
  }

  // Artificing: Research & break down an item for knowledge and exclusive catalysts
  researchAndSalvageItem(itemId) {
    const item = ITEMS[itemId];
    if (!item || this.getItemCount(itemId) < 1) {
      return { ok: false, reason: 'Item not in inventory' };
    }
    this.removeItem(itemId, 1);
    if (!this.artificingKnowledge[itemId]) {
      this.artificingKnowledge[itemId] = { researchedCount: 0, unlocked: true };
    }
    this.artificingKnowledge[itemId].researchedCount += 1;
    this.statsTracked.itemsResearched += 1;

    const xp = item.artificingXp || 25;
    this.gainLifeSkillXp('artificing', xp);

    const salvageList = item.salvage || [{ itemId: 'brittle_catalyst', count: 1 }];
    for (const s of salvageList) {
      this.addItem(s.itemId, s.count);
    }

    const rewardsText = salvageList.map((s) => `${ITEMS[s.itemId]?.name || s.itemId} x${s.count}`).join(', ');
    this.pushActivity(`Artificing: Researched ${item.name} → ${rewardsText}`, '#ce93d8');
    this.spawnFloatingText(this.player.x, this.player.y - 55, `ARTIFICING +${xp} XP`, 'crit');
    return { ok: true, salvageList };
  }

  // Imbuing: Use a Scroll to enhance equipped Weapon or Hat/Armor
  imbueEquipment(scrollItemId, targetSlot = 'weapon') {
    if (this.getItemCount(scrollItemId) < 1) {
      return { ok: false, reason: 'No scroll in inventory' };
    }
    const eq = this.equipment[targetSlot];
    if (!eq) {
      return { ok: false, reason: `No item equipped in ${targetSlot}` };
    }
    this.removeItem(scrollItemId, 1);
    eq.imbueLevel = (eq.imbueLevel || 0) + 1;
    this.statsTracked.scrollsImbued += 1;
    this.gainLifeSkillXp('imbuing', 85);
    this.recalculateStats(false);

    const item = ITEMS[eq.itemId];
    this.pushActivity(`Imbued ${item.name} to +${eq.imbueLevel}!`, '#4dd0e1');
    this.spawnFloatingText(this.player.x, this.player.y - 60, `IMBUED +${eq.imbueLevel}!`, 'crit');
    return { ok: true, imbueLevel: eq.imbueLevel };
  }

  // Equip an item or consumable from inventory
  equipOrUseItem(itemId) {
    const item = ITEMS[itemId];
    if (!item) return false;

    if (item.category === 'Consumable') {
      if (this.getItemCount(itemId) < 1) return false;
      this.removeItem(itemId, 1);
      if (item.useEffect?.healHp) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.useEffect.healHp);
        this.spawnFloatingText(this.player.x, this.player.y - 45, `+${item.useEffect.healHp}`, 'heal');
      }
      if (item.useEffect?.healMp) {
        this.player.mp = Math.min(this.player.maxMp, this.player.mp + item.useEffect.healMp);
        this.spawnFloatingText(this.player.x, this.player.y - 45, `+${item.useEffect.healMp} MP`, 'xp');
      }
      if (item.useEffect?.buff) {
        this.applyBuff(item.useEffect.buff);
      }
      if (itemId === 'roasted_frog_skewer') {
        this.gainLifeSkillXp('cooking', 20);
      } else {
        this.gainLifeSkillXp('alchemy', 18);
      }
      return true;
    }

    if (item.category === 'Scroll') {
      const targetSlot = itemId === 'scroll_of_protection' ? (this.equipment.hat ? 'hat' : 'armor') : 'weapon';
      return this.imbueEquipment(itemId, targetSlot).ok;
    }

    if (item.slot) {
      const invEntry = this.inventory.get(itemId);
      if (!invEntry || invEntry.count < 1) return false;
      const craftedBy = invEntry.craftedBy || this.player.name;
      const imbueLevel = invEntry.imbueLevel || 0;
      this.removeItem(itemId, 1);

      const prev = this.equipment[item.slot];
      if (prev) {
        this.addItem(prev.itemId, 1, { craftedBy: prev.craftedBy, imbueLevel: prev.imbueLevel });
      }
      this.equipment[item.slot] = { itemId, craftedBy, imbueLevel };
      if (item.slot === 'pet') {
        this.gainLifeSkillXp('taming', 45);
      }
      this.recalculateStats(false);
      this.pushActivity(`Equipped ${item.name}`, '#81d4fa');
      return true;
    }
    return false;
  }

  // Toggle Wearable Monster Card in Bestiary (ss_8.jpg [Equip Card])
  toggleMonsterCard(monsterId) {
    const b = this.bestiary[monsterId];
    if (!b || b.cardsOwned < 1) {
      // Allow unlocking/equipping directly in Bestiary if player wants to test or has kills
      if (b && b.kills > 0) {
        b.cardsOwned = 1;
        b.cardTier = 1;
      } else {
        return { ok: false, reason: 'Defeat this monster first to collect its Monster Card!' };
      }
    }
    if (this.equippedCards.has(monsterId)) {
      this.equippedCards.delete(monsterId);
      this.recalculateStats(false);
      return { ok: true, equipped: false };
    }
    if (this.equippedCards.size >= this.maxEquippedCards) {
      const first = this.equippedCards.values().next().value;
      this.equippedCards.delete(first);
    }
    this.equippedCards.add(monsterId);
    this.recalculateStats(false);
    this.pushActivity(`Equipped ${MONSTERS[monsterId].name} Card (${MONSTERS[monsterId].card.statLabel})`, '#ce93d8');
    return { ok: true, equipped: true };
  }

  // Interact with nearby NPC, Workstation, Resource Node, or Portal (Key [T] / [E])
  interactNearest() {
    // 1. Check NPCs
    for (const npc of this.zone.npcs) {
      if (Math.hypot(npc.x - this.player.x, npc.y - this.player.y) <= 95) {
        this.speakToNpc(npc);
        return { type: 'npc', target: npc };
      }
    }
    // 2. Check Workstations
    for (const ws of this.zone.workstations) {
      if (Math.hypot(ws.x - this.player.x, ws.y - this.player.y) <= 95) {
        this.onEvent({ type: 'open_workstation', workstation: ws });
        return { type: 'workstation', target: ws };
      }
    }
    // 3. Check Portals
    for (const portal of this.zone.portals) {
      if (Math.hypot(portal.x - this.player.x, portal.y - this.player.y) <= 85) {
        this.loadZone(portal.targetZoneId, portal.targetX, portal.targetY);
        return { type: 'portal', target: portal };
      }
    }
    // 4. Check Resource Nodes
    for (const node of this.resourceNodes) {
      if (!node.depleted && Math.hypot(node.x - this.player.x, node.y - this.player.y) <= 95) {
        this.startHarvestNode(node);
        return { type: 'resource', target: node };
      }
    }
    return null;
  }

  speakToNpc(npc) {
    this.pushChat(npc.name, npc.dialog, 'NPC', '#a5d6a7');
    // Update NPC conversation objectives
    for (const q of QUESTS) {
      const st = this.questState[q.id];
      if (!st || st.turnedIn) continue;
      q.objectives.forEach((obj, idx) => {
        if (obj.type === 'npc' && obj.npcId === npc.id) {
          st.progress[idx] = 1;
        }
      });
    }
    this.syncQuestItems();

    // If this NPC's quest is ready to turn in, turn it in!
    if (npc.questId) {
      const q = QUESTS.find((item) => item.id === npc.questId);
      const st = this.questState[npc.questId];
      if (q && st && st.completed && !st.turnedIn) {
        this.turnInQuest(npc.questId);
      }
    }
    this.onEvent({ type: 'npc_dialog', npc });
  }

  syncQuestItems() {
    for (const q of QUESTS) {
      const st = this.questState[q.id];
      if (!st || st.turnedIn) continue;
      let allDone = true;
      q.objectives.forEach((obj, idx) => {
        if (obj.type === 'item') {
          st.progress[idx] = Math.min(obj.target, this.getItemCount(obj.itemId));
        }
        if (st.progress[idx] < obj.target) {
          allDone = false;
        }
      });
      st.completed = allDone;
    }
  }

  recordKillForQuestsAndBounties(monsterId) {
    for (const q of QUESTS) {
      const st = this.questState[q.id];
      if (!st || st.turnedIn) continue;
      q.objectives.forEach((obj, idx) => {
        if (obj.type === 'kill' && obj.monsterId === monsterId) {
          st.progress[idx] = Math.min(obj.target, st.progress[idx] + 1);
        }
      });
    }
    this.syncQuestItems();

    for (const b of this.bounties) {
      if (!b.completed && b.monsterId === monsterId) {
        b.kills += 1;
        if (b.kills >= b.target) {
          b.completed = true;
          this.gainXp(b.xpReward);
          this.gainLifeSkillXp('monster_hunter', b.xpReward);
          this.player.rasa += b.rasaReward;
          this.pushActivity(`Bounty Completed: ${b.title} (+${b.rasaReward} Rasa)!`, '#ffd54f');
        }
      }
    }
  }

  turnInQuest(questId) {
    const q = QUESTS.find((item) => item.id === questId);
    const st = this.questState[questId];
    if (!q || !st || !st.completed || st.turnedIn) return false;

    st.turnedIn = true;
    this.statsTracked.questsCompleted += 1;
    this.gainXp(q.rewards.xp);
    this.player.rasa += q.rewards.rasa;
    this.statsTracked.totalRasaEarned += q.rewards.rasa;
    for (const rw of q.rewards.items || []) {
      this.addItem(rw.itemId, rw.count);
    }
    this.pushChat('System', `Quest Completed: "${q.title}"! Earned ${q.rewards.xp} XP & ${q.rewards.rasa} Rasa.`, 'World', '#ffd54f');
    this.spawnFloatingText(this.player.x, this.player.y - 70, 'QUEST COMPLETE!', 'crit');
    return true;
  }

  // Generate dynamic sorted Leaderboard entries including the live player & connected peers
  getLeaderboard(category = 'level', classFilter = 'All') {
    const cls = CLASSES[this.player.classId] || CLASSES.castaway;
    const roman = this.player.classTier === 3 ? ' III' : this.player.classTier === 2 ? ' II' : '';
    const cardsCollected = Object.values(this.bestiary).filter((b) => b.cardsOwned > 0).length;
    const cardsMaxed = Object.values(this.bestiary).filter((b) => b.cardTier >= 5).length;

    const playerSkills = {};
    for (const [k, v] of Object.entries(this.lifeSkills)) {
      playerSkills[k] = v.level;
    }

    const playerRow = {
      name: this.player.name,
      isYou: true,
      classId: this.player.classId,
      archetype: cls.archetype,
      tier: `${cls.name}${roman}`,
      level: this.player.level,
      guild: this.player.guild,
      guildIcon: this.player.guildIcon,
      kills: this.statsTracked.monstersSlain,
      quests: this.statsTracked.questsCompleted,
      cardsCollected,
      cardsMaxed,
      hat: this.equipment.hat ? ITEMS[this.equipment.hat.itemId]?.visualHat : cls.visual.hat,
      skills: playerSkills
    };

    const rows = [
      ...LEADERBOARD_ROSTER.map((r) => ({
        ...r,
        isYou: false,
        archetype: CLASSES[r.classId]?.archetype || 'Warrior'
      })),
      playerRow
    ];

    const filtered = classFilter === 'All'
      ? rows
      : rows.filter((r) => r.archetype.toLowerCase() === classFilter.toLowerCase() || r.classId.toLowerCase() === classFilter.toLowerCase());

    const getScore = (r) => {
      if (category === 'level') return r.level;
      if (category === 'kills') return r.kills;
      if (category === 'quests') return r.quests;
      if (category === 'cards_collected') return r.cardsCollected;
      if (category === 'cards_maxed') return r.cardsMaxed;
      if (r.skills && r.skills[category] !== undefined) return r.skills[category];
      return r.level;
    };

    filtered.sort((a, b) => getScore(b) - getScore(a));
    return filtered.map((r, idx) => ({
      ...r,
      rank: idx + 1,
      score: getScore(r)
    }));
  }

  // Main 60 Hz Simulation Step
  step(dt, input = {}) {
    const clampedDt = Math.min(0.05, Math.max(0.001, dt));
    this.time += clampedDt;

    // 1. Update cooldowns & buffs
    for (const k of Object.keys(this.player.skillCooldowns)) {
      this.player.skillCooldowns[k] = Math.max(0, this.player.skillCooldowns[k] - clampedDt);
    }
    let buffsChanged = false;
    for (let i = this.player.buffs.length - 1; i >= 0; i--) {
      this.player.buffs[i].remaining -= clampedDt;
      if (this.player.buffs[i].remaining <= 0) {
        this.player.buffs.splice(i, 1);
        buffsChanged = true;
      }
    }
    if (buffsChanged) this.recalculateStats(false);

    // Passive HP/MP regen every second
    if (Math.floor(this.time) !== Math.floor(this.time - clampedDt)) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.player.hpRegen);
      this.player.mp = Math.min(this.player.maxMp, this.player.mp + this.player.mpRegen);
    }

    // 2. Player Movement, Jumping & Rope/Vine Climbing
    const moveDir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (moveDir !== 0) {
      this.player.facing = moveDir;
      this.player.harvestAction = null;
    }

    if (this.player.dropThroughTimer > 0) {
      this.player.dropThroughTimer = Math.max(0, this.player.dropThroughTimer - clampedDt);
    }

    // Check rope/vine grabbing with W/S or Up/Down
    if (!this.player.onRope && (input.up || input.down)) {
      for (const rope of this.zone.ropes) {
        if (
          Math.abs(this.player.x - rope.x) <= 22 &&
          this.player.y >= rope.yTop - 10 &&
          this.player.y <= rope.yBottom + 18
        ) {
          this.player.onRope = rope;
          this.player.x = rope.x;
          this.player.vx = 0;
          this.player.vy = 0;
          this.player.harvestAction = null;
          break;
        }
      }
    }

    if (this.player.onRope) {
      const rope = this.player.onRope;
      this.player.x = rope.x;
      this.player.vx = 0;
      const climbSpeed = 190;
      if (input.up) {
        this.player.vy = -climbSpeed;
      } else if (input.down) {
        this.player.vy = climbSpeed;
      } else {
        this.player.vy = 0;
      }
      this.player.y += this.player.vy * clampedDt;

      // Jump off rope
      if (input.jump && moveDir !== 0) {
        this.player.onRope = null;
        this.player.vy = -440;
        this.player.vx = moveDir * this.player.speed;
      } else if (this.player.y <= rope.yTop) {
        this.player.y = rope.yTop;
        this.player.onRope = null;
        this.player.onGround = true;
      } else if (this.player.y >= rope.yBottom) {
        this.player.y = rope.yBottom;
        this.player.onRope = null;
      }
    } else {
      // Standard side-scrolling platform physics
      this.player.vx = moveDir * this.player.speed;
      this.player.x = Math.max(32, Math.min(this.zone.width - 32, this.player.x + this.player.vx * clampedDt));

      // Down + Jump drops through one-way platforms
      if (input.down && input.jump && this.player.onGround) {
        const standingPlat = this.zone.platforms.find(
          (p) => p.oneWay && Math.abs(this.player.y - p.y) <= 6 && this.player.x >= p.x && this.player.x <= p.x + p.w
        );
        if (standingPlat) {
          this.player.dropThroughTimer = 0.28;
          this.player.onGround = false;
          this.player.vy = 120;
        }
      } else if (input.jump && this.player.onGround) {
        this.player.vy = -540;
        this.player.onGround = false;
        this.player.harvestAction = null;
      }

      const prevY = this.player.y;
      this.player.vy += 1280 * clampedDt; // Gravity
      this.player.y += this.player.vy * clampedDt;
      this.player.onGround = false;

      // Platform collision
      for (const plat of this.zone.platforms) {
        if (this.player.x < plat.x || this.player.x > plat.x + plat.w) continue;
        if (plat.oneWay && this.player.dropThroughTimer > 0) continue;
        if (this.player.vy >= 0 && prevY <= plat.y + 8 && this.player.y >= plat.y) {
          this.player.y = plat.y;
          this.player.vy = 0;
          this.player.onGround = true;
          break;
        }
      }

      // Floor safety clamp
      if (this.player.y > 600) {
        this.player.y = 600;
        this.player.vy = 0;
        this.player.onGround = true;
      }
    }

    // Update player animation state
    if (this.player.attackAnimTimer > 0) {
      this.player.attackAnimTimer = Math.max(0, this.player.attackAnimTimer - clampedDt);
      this.player.animState = 'attack';
    } else if (this.player.onRope) {
      this.player.animState = 'climb';
    } else if (!this.player.onGround) {
      this.player.animState = 'jump';
    } else if (Math.abs(this.player.vx) > 5) {
      this.player.animState = 'walk';
    } else {
      this.player.animState = 'idle';
    }

    // 3. Update Harvesting Progress Bar
    if (this.player.harvestAction) {
      const ha = this.player.harvestAction;
      ha.timer += clampedDt;
      if (ha.timer >= ha.duration) {
        this.completeHarvestNode(ha.node);
        this.player.harvestAction = null;
      }
    }

    // 4. Update Pet Companion & Auto-Loot
    const targetPetX = this.player.x - this.player.facing * 42;
    this.petEntity.x += (targetPetX - this.petEntity.x) * Math.min(1, clampedDt * 7);
    this.petEntity.y += (this.player.y - this.petEntity.y) * Math.min(1, clampedDt * 9);
    this.petEntity.facing = this.player.facing;
    this.petEntity.bobPhase += clampedDt * 6;
    this.pickupNearbyDrops(65);

    // 5. Update Resource Nodes respawn
    for (const node of this.resourceNodes) {
      if (node.depleted) {
        node.respawnTimer -= clampedDt;
        if (node.respawnTimer <= 0) {
          node.depleted = false;
        }
      }
    }

    // 6. Update Monsters & Emergent Greed Spirit AI
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const mob = this.monsters[i];
      if (mob.dead) {
        if (mob.isLootThief) {
          this.monsters.splice(i, 1);
          continue;
        }
        mob.respawnTimer -= clampedDt;
        if (mob.respawnTimer <= 0) {
          mob.dead = false;
          mob.hp = mob.maxHp;
          mob.x = mob.spawnX;
          mob.y = mob.spawnY;
          mob.comboHits = 0;
          mob.cumulativeDamage = 0;
        }
        continue;
      }

      if (mob.hitFlash > 0) mob.hitFlash = Math.max(0, mob.hitFlash - clampedDt);

      // Greed Spirit flees away from the player and steals ground drops along its path!
      if (mob.isLootThief) {
        mob.escapeTimer -= clampedDt;
        const fleeDir = mob.x >= this.player.x ? 1 : -1;
        mob.vx = fleeDir * 95;
        mob.facing = fleeDir;
        mob.x += mob.vx * clampedDt;
        if (mob.x <= mob.minX + 10 || mob.x >= mob.maxX - 10) {
          mob.vx *= -1;
          mob.x = Math.max(mob.minX, Math.min(mob.maxX, mob.x));
        }
        // Steal any drop it passes over
        for (let dIdx = this.groundDrops.length - 1; dIdx >= 0; dIdx--) {
          const d = this.groundDrops[dIdx];
          if (Math.hypot(d.x - mob.x, d.y - mob.y) <= 45) {
            if (d.type === 'item') mob.stolenItems.push({ itemId: d.itemId, count: d.count });
            this.groundDrops.splice(dIdx, 1);
            this.spawnFloatingText(mob.x, mob.y - 45, 'STOLEN!', 'dodge');
          }
        }
        if (mob.escapeTimer <= 0) {
          this.pushChat('World', 'The Greed Spirit vanished into the shadows with its stolen items!', 'World', '#ef9a9a');
          this.monsters.splice(i, 1);
          this.activeBossHud = null;
        }
        continue;
      }

      // Standard Monster Patrol & Aggro
      if (mob.aggroTimer > 0) {
        mob.aggroTimer -= clampedDt;
        const dirToPlayer = Math.sign(this.player.x - mob.x) || 1;
        mob.vx = dirToPlayer * (mob.isBoss ? 48 : 62);
        mob.facing = dirToPlayer;
      }

      mob.x += mob.vx * clampedDt;
      if (mob.x <= mob.minX) {
        mob.x = mob.minX;
        mob.vx = Math.abs(mob.vx);
        mob.facing = 1;
      } else if (mob.x >= mob.maxX) {
        mob.x = mob.maxX;
        mob.vx = -Math.abs(mob.vx);
        mob.facing = -1;
      }

      // Monster contact/melee attack against player
      mob.attackCooldown -= clampedDt;
      if (
        mob.attackCooldown <= 0 &&
        Math.abs(mob.x - this.player.x) <= (mob.isBoss ? 75 : 44) &&
        Math.abs(mob.y - this.player.y) <= 48
      ) {
        mob.attackCooldown = 1.65;
        this.applyMonsterAttackToPlayer(mob);
      }
    }

    // 7. Update Ambient AI Adventurers
    for (const adv of this.ambientAdventurers) {
      adv.animPhase += clampedDt * 5;
      adv.x += adv.vx * clampedDt;
      if (adv.x <= adv.minX) {
        adv.x = adv.minX;
        adv.vx = Math.abs(adv.vx);
        adv.facing = 1;
      } else if (adv.x >= adv.maxX) {
        adv.x = adv.maxX;
        adv.vx = -Math.abs(adv.vx);
        adv.facing = -1;
      }
    }

    // 8. Update Projectiles, VFX & Floating Combat Text
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * clampedDt;
      p.timer -= clampedDt;
      if (p.timer <= 0) this.projectiles.splice(i, 1);
    }

    for (let i = this.vfxEffects.length - 1; i >= 0; i--) {
      this.vfxEffects[i].timer -= clampedDt;
      if (this.vfxEffects[i].timer <= 0) this.vfxEffects.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * clampedDt;
      ft.vy *= 0.94;
      ft.timer -= clampedDt;
      if (ft.timer <= 0) this.floatingTexts.splice(i, 1);
    }

    for (let i = this.groundDrops.length - 1; i >= 0; i--) {
      const d = this.groundDrops[i];
      if (d.vy < 0) {
        d.y += d.vy * clampedDt;
        d.vy += 600 * clampedDt;
        if (d.vy >= 0) d.vy = 0;
      }
      d.timer -= clampedDt;
      if (d.timer <= 0) this.groundDrops.splice(i, 1);
    }
  }

  applyMonsterAttackToPlayer(mob) {
    // Roll DODGE (shown in vid_3_combat.mp4 & frame_09.jpg!)
    if (Math.random() < this.player.dodgeChance) {
      this.spawnFloatingText(this.player.x, this.player.y - 52, 'DODGE', 'dodge');
      return;
    }

    const raw = Math.max(1, Math.round(mob.atk - this.player.def * 0.45));
    let remainingDmg = raw;

    // Absorb with Ward Shield first
    if (this.player.shield > 0) {
      const absorbed = Math.min(this.player.shield, remainingDmg);
      this.player.shield -= absorbed;
      remainingDmg -= absorbed;
    }

    this.player.hp = Math.max(0, this.player.hp - remainingDmg);
    this.spawnFloatingText(this.player.x, this.player.y - 48, `-${raw}`, 'miss');

    // Resurrection Shrine respawn if HP hits 0
    if (this.player.hp <= 0) {
      const shrine = this.zone.shrines[0];
      this.player.hp = this.player.maxHp;
      this.player.mp = this.player.maxMp;
      if (shrine) {
        this.player.x = shrine.x;
        this.player.y = shrine.y;
      } else {
        this.player.x = this.zone.spawnX;
        this.player.y = this.zone.spawnY;
      }
      this.pushChat('System', `Resurrected at ${shrine?.name || 'Resurrection Shrine'}.`, 'World', '#80cbc4');
    }
  }
}
