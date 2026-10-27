import {
  LIFE_SKILLS,
  CLASSES,
  ITEMS,
  CRAFTING_RECIPES,
  BESTIARY_REGIONS,
  MONSTERS,
  QUESTS
} from './data/Catalog.js';
import { ZONES } from './data/Zones.js';
import { WorldSimulation } from './sim/WorldSimulation.js';
import { CanvasRenderer } from './client/CanvasRenderer.js';
import { SoundEngine } from './client/SoundEngine.js';

const ICON_EMOJI = {
  twig: '🪵',
  log: '🌲',
  claw: '🦀',
  leaf_essence: '🌿',
  silt_essence: '💧',
  slime_gel: '🫧',
  meat: '🍗',
  bark: '🛡️',
  moss: '🍀',
  catalyst: '🌀',
  orb_catalyst: '🔮',
  ore_tin: '🪨',
  ore_cobalt: '💎',
  cloth: '🧶',
  ruby_cluster: '♦️',
  ingot: '🪙',
  shaft: '🥢',
  arrow_bundle: '🏹',
  potion_red: '🧪',
  potion_blue: '⚗️',
  drumstick: '🍖',
  vial_gold: '✨',
  scroll_purple: '📜',
  sword_wood: '🗡️',
  katana: '⚔️',
  bow_wood: '🏹',
  staff_skull: '🪄',
  daggers: '🗡️',
  hat_miner: '⛑️',
  hat_boar: '🐗',
  hat_wizard: '🧙',
  hat_sigtis: '🥷',
  armor_bark: '🦺',
  ring_gods: '💍',
  axe: '🪓',
  pet_bird: '🐦',
  pet_sprout: '🌱',
  pet_imp: '👾'
};

const SKILL_SLOT_ICONS = {
  '1': '⚔️',
  '2': '☄️',
  '3': '🛡️',
  '4': '🌪️',
  '5': '✨',
  'R': '💥'
};

const sim = new WorldSimulation({
  playerName: 'Piper',
  guildName: 'Turtles',
  guildIcon: 'frog'
});

const worldCanvas = document.getElementById('uw-world-canvas');
const renderer = new CanvasRenderer(worldCanvas, sim);
const sound = new SoundEngine();

// Expose for debugging and automated QA verification
window.__UW_SIM__ = sim;
window.__UW_RENDERER__ = renderer;

const inputState = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false
};

let currentModal = null;
let modalState = {
  craftTab: 'Armor',
  craftSubTab: 'Bandit',
  selectedRecipeId: 'craft_sigtis_veil',
  bestiaryRegion: 'Namu Forest',
  selectedMonsterId: 'wood_golem',
  lbCategory: 'level',
  lbClassFilter: 'All'
};

// Keyboard Controls
window.addEventListener('keydown', (e) => {
  if (document.activeElement === document.getElementById('uw-chat-input')) {
    if (e.key === 'Enter') {
      handleChatSubmit();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      document.getElementById('uw-chat-input').blur();
    }
    return;
  }

  const key = e.key.toLowerCase();
  if (key === 'a' || e.key === 'ArrowLeft') inputState.left = true;
  if (key === 'd' || e.key === 'ArrowRight') inputState.right = true;
  if (key === 'w' || e.key === 'ArrowUp') inputState.up = true;
  if (key === 's' || e.key === 'ArrowDown') inputState.down = true;
  if (e.key === ' ') {
    inputState.jump = true;
    e.preventDefault();
  }

  // Class Skills: 1, 2, 3, 4, 5, R
  if (['1', '2', '3', '4', '5'].includes(key)) {
    if (sim.useSkill(key)) sound.playSlash();
  } else if (key === 'r') {
    if (sim.useSkill('R')) sound.playSlash();
  }

  // Hotbar Consumables & Quick Actions: F, V, X, 6, 7, 8
  if (key === 'f') sim.equipOrUseItem('minor_hp_potion');
  if (key === 'v') sim.equipOrUseItem('roasted_frog_skewer');
  if (key === 'x') sim.equipOrUseItem('minor_mp_potion');
  if (key === '6') sim.equipOrUseItem('lucky_drop_elixir');
  if (key === '7') sim.equipOrUseItem('scroll_of_power');
  if (key === '8') sim.spawnGreedSpirit();

  // Interact / Harvest / Speak / Portal: T or E or Z
  if (key === 't' || key === 'e') {
    const res = sim.interactNearest();
    if (res?.type === 'workstation' && res.target?.modal) {
      openModal(res.target.modal);
    }
    sound.playChime(440, 0.08);
  }
  if (key === 'z') {
    sim.pickupNearbyDrops(120);
  }

  // Modal Shortcuts
  if (key === 'i') toggleModal('inventory');
  if (key === 'c') toggleModal('classes');
  if (key === 'k') toggleModal('lifeskills');
  if (key === 'g') toggleModal('crafting');
  if (key === 'b') toggleModal('bestiary');
  if (key === 'l') toggleModal('leaderboard');
  if (key === 'm') {
    const muted = sound.toggleMute();
    document.getElementById('uw-audio-icon').textContent = muted ? '🔇' : '🔊';
  }
  if (e.key === 'Escape' && currentModal) {
    closeModal();
  }
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'a' || e.key === 'ArrowLeft') inputState.left = false;
  if (key === 'd' || e.key === 'ArrowRight') inputState.right = false;
  if (key === 'w' || e.key === 'ArrowUp') inputState.up = false;
  if (key === 's' || e.key === 'ArrowDown') inputState.down = false;
  if (e.key === ' ') inputState.jump = false;
});

// Canvas Click: Harvest clicked node, speak to clicked NPC, or attack toward click
worldCanvas.addEventListener('mousedown', (e) => {
  const pt = renderer.screenToWorld(e.clientX, e.clientY);

  // Check NPC click
  for (const npc of sim.zone.npcs || []) {
    if (Math.hypot(npc.x - pt.x, npc.y - 30 - pt.y) <= 52) {
      sim.speakToNpc(npc);
      updateHud();
      return;
    }
  }
  // Check Workstation click
  for (const ws of sim.zone.workstations || []) {
    if (Math.hypot(ws.x - pt.x, ws.y - 30 - pt.y) <= 55) {
      if (ws.modal) openModal(ws.modal);
      return;
    }
  }
  // Check Resource Node click
  for (const node of sim.resourceNodes) {
    if (!node.depleted && Math.hypot(node.x - pt.x, node.y - 35 - pt.y) <= 55) {
      sim.player.x = Math.max(40, Math.min(sim.zone.width - 40, node.x - 32));
      sim.player.y = node.y;
      sim.startHarvestNode(node);
      return;
    }
  }

  // Otherwise face click and trigger Primary Skill [1]
  sim.player.facing = pt.x >= sim.player.x ? 1 : -1;
  if (sim.useSkill('1')) sound.playSlash();
});

// Zone Dropdown Fast Travel
const zoneSelect = document.getElementById('uw-zone-select');
zoneSelect.addEventListener('change', () => {
  sim.loadZone(zoneSelect.value);
  updateHud();
});

// Minimap & Quest Tracker Collapse Toggles
document.getElementById('uw-minimap-toggle').addEventListener('click', () => {
  const body = document.getElementById('uw-minimap-body');
  body.classList.toggle('hidden');
});
document.getElementById('uw-quest-toggle').addEventListener('click', () => {
  const list = document.getElementById('uw-quest-list');
  list.classList.toggle('hidden');
});

// Emergent Event Quick Buttons in Minimap Card
document.getElementById('uw-btn-spawn-greed').addEventListener('click', () => {
  sim.spawnGreedSpirit();
  updateHud();
});
document.getElementById('uw-btn-spawn-tree').addEventListener('click', () => {
  sim.triggerAcornTreeSprout(
    Math.min(sim.zone.width - 100, sim.player.x + sim.player.facing * 85),
    sim.player.y
  );
  updateHud();
});

// Audio Button
document.getElementById('uw-btn-audio').addEventListener('click', () => {
  const muted = sound.toggleMute();
  document.getElementById('uw-audio-icon').textContent = muted ? '🔇' : '🔊';
});

// System Tray & Modal Navigation Buttons
document.querySelectorAll('[data-open-modal]').forEach((btn) => {
  btn.addEventListener('click', () => {
    toggleModal(btn.getAttribute('data-open-modal'));
  });
});

document.querySelectorAll('.uw-nav-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    openModal(btn.getAttribute('data-modal'));
  });
});

document.getElementById('uw-modal-close').addEventListener('click', closeModal);

export function openModal(modalName) {
  currentModal = modalName;
  document.getElementById('uw-modal-backdrop').classList.remove('hidden');
  document.querySelectorAll('.uw-nav-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-modal') === modalName);
  });
  renderModalContent();
}

export function closeModal() {
  currentModal = null;
  document.getElementById('uw-modal-backdrop').classList.add('hidden');
}

function toggleModal(modalName) {
  if (currentModal === modalName) closeModal();
  else openModal(modalName);
}

// Render Interactive Modal Content
function renderModalContent() {
  const container = document.getElementById('uw-modal-content');
  const titleEl = document.getElementById('uw-modal-title');
  const iconEl = document.getElementById('uw-modal-icon');
  if (!currentModal || !container) return;

  if (currentModal === 'leaderboard') {
    iconEl.textContent = '👑';
    titleEl.textContent = 'Leaderboard';
    renderLeaderboardModal(container);
  } else if (currentModal === 'bestiary') {
    iconEl.textContent = '📖';
    titleEl.textContent = 'Bestiary';
    renderBestiaryModal(container);
  } else if (currentModal === 'crafting') {
    iconEl.textContent = '🔨';
    titleEl.textContent = 'Crafting';
    renderCraftingModal(container);
  } else if (currentModal === 'classes') {
    iconEl.textContent = '⚔️';
    titleEl.textContent = '8 Playable Classes & Advancement (Zero Level Gates)';
    renderClassesModal(container);
  } else if (currentModal === 'lifeskills') {
    iconEl.textContent = '🌿';
    titleEl.textContent = '10 Life Skills & Artificing Research';
    renderLifeSkillsModal(container);
  } else if (currentModal === 'inventory') {
    iconEl.textContent = '🎒';
    titleEl.textContent = 'Inventory, Inscribed Equipment & Scroll Imbuing';
    renderInventoryModal(container);
  }
}

// 1. LEADERBOARD MODAL (Exact match to ss_4.jpg!)
function renderLeaderboardModal(container) {
  const rows = sim.getLeaderboard(modalState.lbCategory, modalState.lbClassFilter);
  const top3 = rows.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  container.innerHTML = `
    <div class="uw-sidebar">
      <div class="uw-side-section">Overall</div>
      ${['level', 'kills', 'quests'].map((cat) => `
        <button class="uw-side-btn ${modalState.lbCategory === cat ? 'active' : ''}" data-lb-cat="${cat}">
          <span>${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
        </button>
      `).join('')}
      <div class="uw-side-section">Life Skills</div>
      ${LIFE_SKILLS.map((sk) => `
        <button class="uw-side-btn ${modalState.lbCategory === sk.id ? 'active' : ''}" data-lb-cat="${sk.id}">
          <span>${sk.name}</span>
          <span style="color:${sk.color}">Lv.${sim.lifeSkills[sk.id].level}</span>
        </button>
      `).join('')}
      <div class="uw-side-section">Collections</div>
      <button class="uw-side-btn ${modalState.lbCategory === 'cards_collected' ? 'active' : ''}" data-lb-cat="cards_collected">
        <span>Cards Collected</span>
      </button>
      <button class="uw-side-btn ${modalState.lbCategory === 'cards_maxed' ? 'active' : ''}" data-lb-cat="cards_maxed">
        <span>Cards Maxed</span>
      </button>
    </div>

    <div class="uw-main-pane">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <h3 style="font-size:15px;text-transform:capitalize;">${modalState.lbCategory.replace('_', ' ')}</h3>
        <div style="display:flex;gap:6px;">
          ${['All', 'Castaway', 'Bandit', 'Ranger', 'Mage', 'Warrior'].map((cf) => `
            <button class="uw-nav-tab ${modalState.lbClassFilter === cf ? 'active' : ''}" data-lb-class="${cf}">${cf}</button>
          `).join('')}
        </div>
      </div>

      <div class="uw-podium-row">
        ${podiumOrder.map((p) => {
          const medal = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : '🥉';
          const emoji = p.classId === 'elementalist' ? '🧙' : p.classId === 'ranger' ? '🏹' : '⚔️';
          return `
            <div class="uw-podium-card">
              <div class="uw-podium-medal">${medal}</div>
              <div class="uw-podium-avatar">${emoji}</div>
              <div style="font-size:12px;font-weight:700;">${p.name}</div>
              <div style="font-size:10.5px;color:#4fc3f7;">${p.tier}</div>
              <div style="font-size:11px;color:#ffd54f;font-weight:700;">Lvl. ${p.score}</div>
            </div>
          `;
        }).join('')}
      </div>

      <table class="uw-lb-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Class</th>
            <th>Score / Level</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r) => `
            <tr class="${r.isYou ? 'uw-lb-you' : ''}">
              <td>${r.rank}</td>
              <td><strong>${r.name}</strong> ${r.isYou ? '<span style="color:#ffd54f">(You)</span>' : ''}</td>
              <td style="color:${CLASSES[r.classId]?.color || '#81d4fa'}">${r.tier}</td>
              <td style="color:#ffd54f;font-weight:700;">Lvl. ${r.score}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('[data-lb-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      modalState.lbCategory = btn.getAttribute('data-lb-cat');
      renderModalContent();
    });
  });
  container.querySelectorAll('[data-lb-class]').forEach((btn) => {
    btn.addEventListener('click', () => {
      modalState.lbClassFilter = btn.getAttribute('data-lb-class');
      renderModalContent();
    });
  });
}

// 2. BESTIARY & WEARABLE MONSTER CARDS MODAL (Exact match to ss_8.jpg!)
function renderBestiaryModal(container) {
  const mob = MONSTERS[modalState.selectedMonsterId] || MONSTERS.wood_golem;
  const bEntry = sim.bestiary[mob.id] || { kills: 0, cardsOwned: 0, cardTier: 0, discoveredDrops: new Set() };
  const isCardEquipped = sim.equippedCards.has(mob.id);

  container.innerHTML = `
    <div class="uw-sidebar" style="width:270px;">
      ${BESTIARY_REGIONS.map((reg) => {
        const regMobs = Object.values(MONSTERS).filter((m) => m.region === reg);
        const foundCount = regMobs.filter((m) => (sim.bestiary[m.id]?.kills || 0) > 0).length;
        const isOpen = modalState.bestiaryRegion === reg || regMobs.some((m) => m.id === mob.id);
        return `
          <div style="margin-bottom:6px;">
            <button class="uw-side-btn ${isOpen ? 'active' : ''}" data-bestiary-reg="${reg}" style="width:100%;background:rgba(40,52,70,0.85);">
              <span><strong>${reg}</strong> <span style="color:#ffb74d">${foundCount}/${regMobs.length}</span></span>
              <span>▾</span>
            </button>
            ${regMobs.length > 0 ? `
              <div class="uw-bestiary-grid">
                ${regMobs.map((m) => {
                  const mb = sim.bestiary[m.id];
                  const eq = sim.equippedCards.has(m.id);
                  const pips = Math.max(1, mb?.cardTier || (mb?.kills > 0 ? 1 : 0));
                  return `
                    <div class="uw-mob-tile ${m.id === mob.id ? 'active' : ''} ${eq ? 'equipped' : ''}" data-select-mob="${m.id}">
                      <span style="font-size:18px;">${m.isLootThief ? '👻' : m.isBoss ? '👾' : '👹'}</span>
                      <div class="uw-card-pips">
                        ${[1, 2, 3, 4, 5].map((idx) => `<span class="uw-pip ${idx <= pips ? 'lit' : ''}"></span>`).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <div class="uw-main-pane">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <h3 style="font-size:20px;color:#ffffff;">${mob.name}</h3>
          <div style="font-size:12px;color:#4fc3f7;font-weight:700;margin-top:2px;">${mob.card.statLabel}</div>
          <div style="font-size:11px;color:#b0bec5;margin-top:2px;">Region: ${mob.region} • Level ${mob.level}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11.5px;color:#ff8a65;font-weight:700;">Kills: ${bEntry.kills}</div>
          <div style="font-size:11.5px;color:#cfd8dc;">Odds: 1/${mob.card.odds}</div>
          <button id="uw-btn-equip-card" class="uw-action-btn" style="margin-top:6px;">
            ${isCardEquipped ? '✓ Card Equipped (Unequip)' : 'Equip Card'}
          </button>
        </div>
      </div>

      <div style="flex:1;display:flex;align-items:center;justify-content:center;my:10px;background:rgba(15,19,28,0.65);border-radius:6px;margin:12px 0;min-height:150px;flex-direction:column;">
        <div style="font-size:64px;">${mob.id === 'wood_golem' ? '🪵🗿' : mob.isLootThief ? '👻📜' : mob.isBoss ? '🟣👾' : '👹'}</div>
        <div style="font-size:12px;color:#a5d6a7;margin-top:6px;">
          Equipped Cards (${sim.equippedCards.size}/${sim.maxEquippedCards}): ${Array.from(sim.equippedCards).map((id) => MONSTERS[id]?.name).join(', ') || 'None'}
        </div>
      </div>

      <div style="font-size:12px;font-weight:700;color:#ffd54f;">Regional Drop Table</div>
      <div class="uw-drops-grid">
        ${mob.drops.map((d) => {
          const item = ITEMS[d.itemId];
          const discovered = bEntry.discoveredDrops.has(d.itemId) || bEntry.kills > 0;
          return `
            <div class="uw-drop-card">
              <span style="font-size:20px;filter:${discovered ? 'none' : 'brightness(0)'};">${ICON_EMOJI[item?.icon] || '📦'}</span>
              <div>
                <div style="font-weight:700;color:${discovered ? '#ffffff' : '#78909c'};">${discovered ? (item?.name || d.itemId) : '???'}</div>
                <div style="color:#b0bec5;font-size:10px;">${d.oddsLabel}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-select-mob]').forEach((el) => {
    el.addEventListener('click', () => {
      modalState.selectedMonsterId = el.getAttribute('data-select-mob');
      renderModalContent();
    });
  });

  const equipBtn = container.querySelector('#uw-btn-equip-card');
  if (equipBtn) {
    equipBtn.addEventListener('click', () => {
      const b = sim.bestiary[mob.id];
      if (b && b.cardsOwned < 1) {
        b.cardsOwned = 1;
        b.cardTier = 1;
      }
      sim.toggleMonsterCard(mob.id);
      renderModalContent();
      updateHud();
    });
  }
}

// 3. CRAFTING MODAL (Exact match to ss_9.jpg & vid_3_combat.mp4!)
function renderCraftingModal(container) {
  const tabs = ['General', 'Weapons', 'Armor', 'Jewelry', 'Tools', 'Scrolls'];
  const subTabs = ['Generic', 'Archer', 'Bandit', 'Mage', 'Warrior'];

  const matchingRecipes = CRAFTING_RECIPES.filter((r) => {
    if (r.tab !== modalState.craftTab) return false;
    if (modalState.craftTab === 'General' || modalState.craftTab === 'Tools' || modalState.craftTab === 'Scrolls') return true;
    return r.subTab === modalState.craftSubTab || r.subTab === 'Generic';
  });

  let selectedRecipe = CRAFTING_RECIPES.find((r) => r.id === modalState.selectedRecipeId);
  if (!selectedRecipe) {
    selectedRecipe = matchingRecipes[0] || CRAFTING_RECIPES[0];
  }
  const outItem = ITEMS[selectedRecipe.outputId];

  container.innerHTML = `
    <div class="uw-main-pane" style="flex:1.1;">
      <div style="display:flex;gap:8px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:6px;">
        ${tabs.map((t) => `
          <button class="uw-nav-tab ${modalState.craftTab === t ? 'active' : ''}" data-craft-tab="${t}">${t}</button>
        `).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:6px;">
        ${subTabs.map((st) => `
          <button class="uw-side-btn ${modalState.craftSubTab === st ? 'active' : ''}" data-craft-sub="${st}">${st}</button>
        `).join('')}
      </div>

      <div class="uw-craft-grid">
        ${matchingRecipes.map((r) => {
          const item = ITEMS[r.outputId];
          return `
            <div class="uw-recipe-slot ${r.id === selectedRecipe.id ? 'active' : ''}" data-select-recipe="${r.id}" title="${item?.name}">
              ${r.isNew ? '<span class="uw-new-badge">New!</span>' : ''}
              <span>${ICON_EMOJI[item?.icon] || '⚒️'}</span>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-top:auto;font-size:11px;color:#b0bec5;padding-top:10px;">
        💡 Tip: Every weapon or armor piece you craft is permanently inscribed with <strong>"Crafted by ${sim.player.name}"</strong>!
      </div>
    </div>

    <div class="uw-main-pane" style="flex:1;align-items:center;text-align:center;">
      <div style="width:64px;height:64px;background:rgba(15,19,28,0.9);border:2px solid #ffd54f;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:8px;">
        ${ICON_EMOJI[outItem?.icon] || '⚒️'}
      </div>
      <h3 style="font-size:18px;color:#ffd54f;">${outItem?.name || selectedRecipe.outputId} ${selectedRecipe.outputCount > 1 ? `x${selectedRecipe.outputCount}` : ''}</h3>
      <div style="font-size:11.5px;color:#cfd8dc;margin-top:4px;">Req Lvl: ${selectedRecipe.reqLevel}</div>
      <div style="font-size:11.5px;color:#a5d6a7;">Experience +${selectedRecipe.xpReward}</div>
      <div style="font-size:11px;color:#90caf9;margin-top:4px;max-width:280px;">${outItem?.desc || ''}</div>

      <div style="font-size:11.5px;font-weight:700;margin-top:12px;align-self:flex-start;">Required</div>
      <div class="uw-ing-row">
        ${[0, 1, 2, 3].map((slotIdx) => {
          const ing = selectedRecipe.ingredients[slotIdx];
          if (!ing) {
            return `<div class="uw-ing-box" style="opacity:0.35;"></div>`;
          }
          const ingItem = ITEMS[ing.itemId];
          const have = sim.getItemCount(ing.itemId);
          const enough = have >= ing.count;
          return `
            <div class="uw-ing-box" title="${ingItem?.name}">
              <span style="font-size:20px;">${ICON_EMOJI[ingItem?.icon] || '📦'}</span>
              <span style="margin-top:4px;font-weight:700;color:${enough ? '#69f0ae' : '#ef5350'};">${have}/${ing.count}</span>
            </div>
          `;
        }).join('')}
      </div>

      <div style="display:flex;gap:8px;margin-top:auto;">
        <button id="uw-btn-craft-exec" class="uw-anvil-btn">⚒️ Craft Item</button>
        <button id="uw-btn-craft-grant" class="uw-action-btn" title="Gather/Grant Materials for Testing">+ Gather Mats</button>
      </div>
    </div>
  `;

  container.querySelectorAll('[data-craft-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      modalState.craftTab = btn.getAttribute('data-craft-tab');
      const first = CRAFTING_RECIPES.find((r) => r.tab === modalState.craftTab);
      if (first) modalState.selectedRecipeId = first.id;
      renderModalContent();
    });
  });

  container.querySelectorAll('[data-craft-sub]').forEach((btn) => {
    btn.addEventListener('click', () => {
      modalState.craftSubTab = btn.getAttribute('data-craft-sub');
      const first = CRAFTING_RECIPES.find((r) => r.tab === modalState.craftTab && r.subTab === modalState.craftSubTab);
      if (first) modalState.selectedRecipeId = first.id;
      renderModalContent();
    });
  });

  container.querySelectorAll('[data-select-recipe]').forEach((el) => {
    el.addEventListener('click', () => {
      modalState.selectedRecipeId = el.getAttribute('data-select-recipe');
      renderModalContent();
    });
  });

  container.querySelector('#uw-btn-craft-exec')?.addEventListener('click', () => {
    const res = sim.craftRecipe(selectedRecipe.id);
    if (res.ok) sound.playLevelUp();
    renderModalContent();
    updateHud();
  });

  container.querySelector('#uw-btn-craft-grant')?.addEventListener('click', () => {
    for (const ing of selectedRecipe.ingredients) {
      sim.addItem(ing.itemId, ing.count);
    }
    renderModalContent();
    updateHud();
  });
}

// 4. EIGHT PLAYABLE CLASSES MODAL
function renderClassesModal(container) {
  const allClasses = Object.values(CLASSES);
  const currentCls = CLASSES[sim.player.classId];

  container.innerHTML = `
    <div class="uw-main-pane">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <span style="font-size:13px;color:#b0bec5;">Active Class:</span>
          <strong style="font-size:16px;color:${currentCls.color};margin-left:6px;">
            ${currentCls.name} ${sim.player.classTier === 3 ? 'III' : sim.player.classTier === 2 ? 'II' : 'I'}
          </strong>
          <span style="font-size:11.5px;color:#ffd54f;margin-left:10px;">
            ATK ${sim.player.atk} • SPELL ${sim.player.spellPower} • DEF ${sim.player.def} • CRIT ${Math.round(sim.player.critChance * 100)}% • DODGE ${Math.round(sim.player.dodgeChance * 100)}%
          </span>
        </div>
        <button id="uw-btn-promote-tier" class="uw-action-btn">
          ⬆️ Promote Class Tier (${sim.player.classTier}/3)
        </button>
      </div>

      <div class="uw-class-grid">
        ${allClasses.map((cls) => {
          const isCurrent = cls.id === sim.player.classId;
          return `
            <div class="uw-class-card ${isCurrent ? 'active' : ''}" data-switch-class="${cls.id}">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <strong style="color:${cls.color};font-size:14px;">${cls.name}</strong>
                <span class="uw-class-tag">${cls.archetype}</span>
              </div>
              <div style="font-size:10.5px;color:#ffd54f;">${cls.weaponType} • ${cls.difficulty}</div>
              <div style="font-size:11px;color:#cfd8dc;line-height:1.35;">${cls.description}</div>
              <div style="margin-top:auto;padding-top:4px;font-size:10px;color:#80deea;">
                Skills: ${cls.skills.map((s) => `[${s.slot}] ${s.name}`).slice(0, 3).join(' • ')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-switch-class]').forEach((card) => {
    card.addEventListener('click', () => {
      sim.changeClass(card.getAttribute('data-switch-class'));
      sound.playLevelUp();
      renderModalContent();
      updateHud();
    });
  });

  container.querySelector('#uw-btn-promote-tier')?.addEventListener('click', () => {
    sim.promoteClassTier();
    sound.playLevelUp();
    renderModalContent();
    updateHud();
  });
}

// 5. TEN LIFE SKILLS & ARTIFICING RESEARCH MODAL
function renderLifeSkillsModal(container) {
  const bagItems = Array.from(sim.inventory.values());

  container.innerHTML = `
    <div class="uw-main-pane" style="flex:1.1;">
      <h3 style="font-size:14px;margin-bottom:8px;color:#ffd54f;">Master All 10 Interconnected Life Skills</h3>
      <div style="display:flex;flex-direction:column;gap:7px;">
        ${LIFE_SKILLS.map((sk) => {
          const st = sim.lifeSkills[sk.id];
          const pct = Math.min(100, (st.xp / st.xpNext) * 100);
          return `
            <div style="background:rgba(16,20,29,0.82);border:1px solid #37474f;border-radius:5px;padding:6px 10px;">
              <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;">
                <span style="color:${sk.color}">${sk.name}</span>
                <span>Lv. ${st.level} <span style="color:#90caf9;font-size:10.5px;">(${st.xp}/${st.xpNext} XP)</span></span>
              </div>
              <div style="height:6px;background:#111622;border-radius:3px;margin:4px 0;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${sk.color};"></div>
              </div>
              <div style="font-size:10px;color:#b0bec5;">${sk.description}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="uw-main-pane" style="flex:0.95;">
      <h3 style="font-size:14px;color:#ce93d8;margin-bottom:4px;">🔬 Artificing Station — Item Research & Salvage</h3>
      <p style="font-size:11px;color:#b0bec5;margin-bottom:10px;">
        Research and break down items you find to gain permanent Item Knowledge and extract exclusive Artificing catalysts!
      </p>
      <div style="display:flex;flex-direction:column;gap:6px;overflow-y:auto;">
        ${bagItems.map((entry) => {
          const item = ITEMS[entry.itemId];
          const know = sim.artificingKnowledge[entry.itemId]?.researchedCount || 0;
          return `
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(16,20,29,0.88);border:1px solid #3c4a63;border-radius:5px;padding:6px 8px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:20px;">${ICON_EMOJI[item?.icon] || '📦'}</span>
                <div>
                  <div style="font-size:12px;font-weight:700;">${item?.name} <span style="color:#ffd54f;">x${entry.count}</span></div>
                  <div style="font-size:10px;color:#ce93d8;">Knowledge Tier: ${know} • +${item?.artificingXp || 20} Artificing XP</div>
                </div>
              </div>
              <button class="uw-action-btn" data-artifice-item="${entry.itemId}" style="background:#6a1b9a;border-color:#ce93d8;">
                Research & Salvage
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-artifice-item]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sim.researchAndSalvageItem(btn.getAttribute('data-artifice-item'));
      sound.playChime(660, 0.14);
      renderModalContent();
      updateHud();
    });
  });
}

// 6. INVENTORY, INSCRIBED EQUIPMENT & IMBUING MODAL
function renderInventoryModal(container) {
  const bagItems = Array.from(sim.inventory.values());
  const slots = [
    { key: 'weapon', label: 'Weapon' },
    { key: 'hat', label: 'Headgear' },
    { key: 'armor', label: 'Body Armor' },
    { key: 'ring', label: 'Signet / Ring' },
    { key: 'tool', label: 'Gathering Tool' },
    { key: 'pet', label: 'Tamed Companion' }
  ];

  container.innerHTML = `
    <div class="uw-sidebar" style="width:280px;">
      <div class="uw-side-section">Equipped Loadout & Crafter Inscriptions</div>
      ${slots.map((s) => {
        const eq = sim.equipment[s.key];
        const item = eq ? ITEMS[eq.itemId] : null;
        return `
          <div style="background:rgba(16,20,29,0.88);border:1px solid #45526b;border-radius:5px;padding:7px 9px;margin-bottom:4px;">
            <div style="font-size:10px;color:#90caf9;text-transform:uppercase;">${s.label}</div>
            ${item ? `
              <div style="font-size:12.5px;font-weight:700;color:#ffd54f;">
                ${ICON_EMOJI[item.icon] || '⚔️'} ${item.name} ${eq.imbueLevel > 0 ? `<span style="color:#69f0ae">+${eq.imbueLevel}</span>` : ''}
              </div>
              <div style="font-size:10px;color:#a5d6a7;">✍️ Inscribed: Crafted by <strong>${eq.craftedBy || sim.player.name}</strong></div>
            ` : `<div style="font-size:11.5px;color:#78909c;">Empty Slot</div>`}
          </div>
        `;
      }).join('')}
      <button id="uw-btn-imbue-weapon" class="uw-action-btn" style="margin-top:6px;">
        📜 Imbue Weapon (+1 Star) [Scrolls: ${sim.getItemCount('scroll_of_power')}]
      </button>
    </div>

    <div class="uw-main-pane">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h3 style="font-size:14px;">Adventurer Backpack (${bagItems.length} Unique Items — Zero Junk Items)</h3>
        <span style="color:#ffd54f;font-weight:700;">⚡ ${sim.player.rasa} Rasa</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:8px;">
        ${bagItems.map((entry) => {
          const item = ITEMS[entry.itemId];
          const canUseOrEquip = item && (item.slot || item.category === 'Consumable' || item.category === 'Scroll');
          return `
            <div style="background:rgba(16,20,29,0.88);border:1px solid #3c4a63;border-radius:5px;padding:8px;display:flex;justify-content:space-between;align-items:center;">
              <div style="display:flex;gap:8px;align-items:center;">
                <span style="font-size:22px;">${ICON_EMOJI[item?.icon] || '📦'}</span>
                <div>
                  <div style="font-size:12px;font-weight:700;color:#ffffff;">
                    ${item?.name} <span style="color:#ffd54f;">x${entry.count}</span>
                  </div>
                  ${entry.craftedBy ? `<div style="font-size:10px;color:#69f0ae;">Inscribed: Crafted by ${entry.craftedBy}</div>` : ''}
                  <div style="font-size:10px;color:#b0bec5;">${item?.desc || ''}</div>
                </div>
              </div>
              ${canUseOrEquip ? `
                <button class="uw-action-btn" data-use-item="${entry.itemId}">
                  ${item.slot ? 'Equip' : 'Use'}
                </button>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-use-item]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sim.equipOrUseItem(btn.getAttribute('data-use-item'));
      sound.playChime(520, 0.1);
      renderModalContent();
      updateHud();
    });
  });

  container.querySelector('#uw-btn-imbue-weapon')?.addEventListener('click', () => {
    if (sim.getItemCount('scroll_of_power') < 1) {
      sim.addItem('scroll_of_power', 1);
    }
    sim.imbueEquipment('scroll_of_power', 'weapon');
    sound.playLevelUp();
    renderModalContent();
    updateHud();
  });
}

// Chat Input & Slash Commands
function handleChatSubmit() {
  const inputEl = document.getElementById('uw-chat-input');
  const raw = inputEl.value.trim();
  inputEl.value = '';
  inputEl.blur();
  if (!raw) return;

  if (raw.startsWith('/class ')) {
    const targetClass = raw.slice(7).trim().toLowerCase();
    sim.changeClass(targetClass);
  } else if (raw.startsWith('/zone ')) {
    const targetZone = raw.slice(6).trim().toLowerCase();
    sim.loadZone(targetZone);
  } else if (raw === '/greed') {
    sim.spawnGreedSpirit();
  } else if (raw === '/tree') {
    sim.triggerAcornTreeSprout(sim.player.x + 70, sim.player.y);
  } else {
    sim.pushChat(sim.player.name, raw, document.getElementById('uw-chat-channel').value, '#ffffff');
  }
  updateHud();
}

// Render Top-Left Minimap Canvas
const minimapCanvas = document.getElementById('uw-minimap-canvas');
const mmCtx = minimapCanvas.getContext('2d');

function renderMinimap() {
  const w = minimapCanvas.width;
  const h = minimapCanvas.height;
  const z = sim.zone;
  const scaleX = w / z.width;
  const scaleY = h / z.height;

  mmCtx.clearRect(0, 0, w, h);
  mmCtx.fillStyle = '#182232';
  mmCtx.fillRect(0, 0, w, h);

  // Platforms
  mmCtx.fillStyle = '#6d4c41';
  for (const p of z.platforms) {
    mmCtx.fillRect(p.x * scaleX, p.y * scaleY, p.w * scaleX, Math.max(4, p.h * scaleY));
    mmCtx.fillStyle = '#66bb6a';
    mmCtx.fillRect(p.x * scaleX, p.y * scaleY, p.w * scaleX, 2);
    mmCtx.fillStyle = '#6d4c41';
  }

  // Ropes
  mmCtx.strokeStyle = '#ffd54f';
  mmCtx.lineWidth = 1;
  for (const r of z.ropes) {
    mmCtx.beginPath();
    mmCtx.moveTo(r.x * scaleX, r.yTop * scaleY);
    mmCtx.lineTo(r.x * scaleX, r.yBottom * scaleY);
    mmCtx.stroke();
  }

  // Portals
  mmCtx.fillStyle = '#4dd0e1';
  for (const pt of z.portals) {
    mmCtx.beginPath();
    mmCtx.arc(pt.x * scaleX, (pt.y - 12) * scaleY, 4, 0, Math.PI * 2);
    mmCtx.fill();
  }

  // Monsters
  for (const m of sim.monsters) {
    if (m.dead) continue;
    mmCtx.fillStyle = m.isLootThief ? '#ce93d8' : m.isBoss ? '#ff5252' : '#ef5350';
    mmCtx.fillRect(m.x * scaleX - 2, (m.y - 8) * scaleY - 2, 4, 4);
  }

  // Player Dot
  mmCtx.fillStyle = '#ffd54f';
  mmCtx.beginPath();
  mmCtx.arc(sim.player.x * scaleX, (sim.player.y - 12) * scaleY, 4.5, 0, Math.PI * 2);
  mmCtx.fill();
}

// Update DOM HUD Elements
function updateHud() {
  const p = sim.player;
  const cls = CLASSES[p.classId] || CLASSES.castaway;
  const roman = p.classTier === 3 ? ' III' : p.classTier === 2 ? ' II' : '';

  document.getElementById('uw-region-name').textContent = sim.zone.regionName;
  document.getElementById('uw-subzone-name').textContent = sim.zone.subZoneName;
  if (zoneSelect.value !== sim.zoneId) zoneSelect.value = sim.zoneId;

  // Shield, HP, MP, XP Bars
  document.getElementById('uw-shield-fill').style.width = `${Math.min(100, (p.shield / p.maxHp) * 100)}%`;
  document.getElementById('uw-shield-text').textContent = p.shield.toLocaleString();

  document.getElementById('uw-hp-fill').style.width = `${Math.min(100, (p.hp / p.maxHp) * 100)}%`;
  document.getElementById('uw-hp-text').textContent = `${p.hp.toLocaleString()}/${p.maxHp.toLocaleString()}`;
  document.getElementById('uw-hp-regen').textContent = `+${p.hpRegen}`;

  document.getElementById('uw-mp-fill').style.width = `${Math.min(100, (p.mp / p.maxMp) * 100)}%`;
  document.getElementById('uw-mp-text').textContent = `${p.mp.toLocaleString()}/${p.maxMp.toLocaleString()}`;
  document.getElementById('uw-mp-regen').textContent = `+${p.mpRegen}`;

  document.getElementById('uw-char-level').textContent = `Lv. ${p.level}`;
  document.getElementById('uw-char-name').textContent = p.name;
  document.getElementById('uw-char-class-badge').textContent = `${cls.name}${roman}`;
  document.getElementById('uw-char-rasa').textContent = `⚡ ${p.rasa.toLocaleString()}`;

  const xpPct = Math.min(100, (p.xp / p.xpNext) * 100);
  document.getElementById('uw-xp-fill').style.width = `${xpPct}%`;
  document.getElementById('uw-xp-text').textContent = `${p.xp.toLocaleString()}/${p.xpNext.toLocaleString()} (${xpPct.toFixed(2)}%)`;

  // Top-Left Active Buffs
  const buffStrip = document.getElementById('uw-buff-strip');
  buffStrip.innerHTML = p.buffs.map((b) => `
    <div class="uw-buff-box" title="${b.name}">
      <span>${b.icon === 'drumstick' ? '🍖' : b.icon === 'vial_gold' ? '✨' : '🛡️'}</span>
      <span class="uw-buff-timer">${Math.ceil(b.remaining)}s</span>
    </div>
  `).join('');

  // Top-Center Boss Health Bar (ss_6.jpg)
  const bossBar = document.getElementById('uw-boss-bar');
  if (sim.activeBossHud) {
    bossBar.classList.remove('hidden');
    const bh = sim.activeBossHud;
    document.getElementById('uw-boss-name').textContent = bh.name;
    document.getElementById('uw-boss-combo').textContent = `x${bh.comboHits}`;
    document.getElementById('uw-boss-total-dmg').textContent = `-${bh.cumulativeDamage.toLocaleString()}`;
    const bPct = Math.max(0, Math.min(100, (bh.hp / bh.maxHp) * 100));
    document.getElementById('uw-boss-hp-fill').style.width = `${bPct}%`;
    document.getElementById('uw-boss-hp-text').textContent = `${bh.hp.toLocaleString()} / ${bh.maxHp.toLocaleString()}`;
  } else {
    bossBar.classList.add('hidden');
  }

  // Top-Right Quest Tracker
  const activeQuests = QUESTS.filter((q) => !sim.questState[q.id]?.turnedIn);
  document.getElementById('uw-quest-count').textContent = `Quests ${activeQuests.length}/${QUESTS.length}`;
  const questListEl = document.getElementById('uw-quest-list');
  questListEl.innerHTML = activeQuests.map((q) => {
    const st = sim.questState[q.id];
    return `
      <div class="uw-quest-item">
        <div class="uw-quest-title">
          <span>${q.title}</span>
          ${st.completed ? `<button class="uw-turnin-btn" data-turnin-quest="${q.id}">✓ Turn In</button>` : ''}
        </div>
        ${q.objectives.map((obj, idx) => {
          const cur = st.progress[idx] || 0;
          const done = cur >= obj.target;
          return `
            <div class="uw-quest-obj">
              <span>${obj.label}</span>
              <span class="${done ? 'uw-obj-done' : 'uw-obj-pending'}">${cur}/${obj.target}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  questListEl.querySelectorAll('[data-turnin-quest]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sim.turnInQuest(btn.getAttribute('data-turnin-quest'));
      sound.playLevelUp();
      updateHud();
    });
  });

  // Bottom-Right Ready-to-Turn-In Toast (ss_7.jpg)
  const readyQuest = activeQuests.find((q) => sim.questState[q.id]?.completed);
  const toastEl = document.getElementById('uw-quest-toast');
  if (readyQuest) {
    toastEl.classList.remove('hidden');
    toastEl.innerHTML = `<strong>${readyQuest.title}</strong><br/><span style="color:#69f0ae">Ready to turn in! Click to complete (${readyQuest.giver})</span>`;
    toastEl.onclick = () => {
      sim.turnInQuest(readyQuest.id);
      sound.playLevelUp();
      updateHud();
    };
  } else {
    toastEl.classList.add('hidden');
  }

  // 12-Slot Hotbar
  const hotbarEl = document.getElementById('uw-hotbar');
  const skillSlotsHtml = cls.skills.map((sk) => {
    const cd = p.skillCooldowns[sk.id] || 0;
    return `
      <div class="uw-hotbar-slot" data-hotbar-skill="${sk.slot}" title="${sk.name}: ${sk.desc}">
        <span class="uw-slot-icon">${SKILL_SLOT_ICONS[sk.slot] || '⚔️'}</span>
        <span class="uw-slot-key">${sk.slot}</span>
        ${cd > 0.05 ? `<div class="uw-slot-cd">${cd.toFixed(1)}</div>` : ''}
      </div>
    `;
  }).join('');

  const itemSlots = [
    { key: 'F', itemId: 'minor_hp_potion', icon: '🧪', label: 'Crimson Vitality Draught' },
    { key: 'V', itemId: 'roasted_frog_skewer', icon: '🍖', label: 'Roasted Frogling Skewer' },
    { key: 'X', itemId: 'minor_mp_potion', icon: '⚗️', label: 'Azure Mana Draught' },
    { key: '6', itemId: 'lucky_drop_elixir', icon: '✨', label: 'Elixir of Fortune' },
    { key: '7', itemId: 'scroll_of_power', icon: '📜', label: 'Scroll of Weapon Mastery' },
    { key: '8', action: 'greed', icon: '👻', label: 'Ambush: Spawn Greed Spirit' }
  ];

  const itemSlotsHtml = itemSlots.map((s) => {
    const count = s.itemId ? sim.getItemCount(s.itemId) : '';
    return `
      <div class="uw-hotbar-slot" data-hotbar-item="${s.itemId || ''}" data-hotbar-action="${s.action || ''}" title="${s.label}">
        <span class="uw-slot-icon">${s.icon}</span>
        ${s.itemId ? `<span class="uw-slot-count">${count}</span>` : ''}
        <span class="uw-slot-key">${s.key}</span>
      </div>
    `;
  }).join('');

  hotbarEl.innerHTML = skillSlotsHtml + itemSlotsHtml;

  hotbarEl.querySelectorAll('[data-hotbar-skill]').forEach((el) => {
    el.addEventListener('click', () => {
      if (sim.useSkill(el.getAttribute('data-hotbar-skill'))) sound.playSlash();
      updateHud();
    });
  });

  hotbarEl.querySelectorAll('[data-hotbar-item]').forEach((el) => {
    el.addEventListener('click', () => {
      const act = el.getAttribute('data-hotbar-action');
      const itemId = el.getAttribute('data-hotbar-item');
      if (act === 'greed') sim.spawnGreedSpirit();
      else if (itemId) sim.equipOrUseItem(itemId);
      updateHud();
    });
  });

  // Activity Feed & Chat Log
  const actEl = document.getElementById('uw-activity-feed');
  actEl.innerHTML = sim.activityFeed.slice(-5).map((a) => `
    <div style="color:${a.color}">${a.text}</div>
  `).join('');

  const chatMsgEl = document.getElementById('uw-chat-messages');
  chatMsgEl.innerHTML = sim.chatLog.slice(-8).map((c) => `
    <div style="color:${c.color}">[${c.sender}] ${c.text}</div>
  `).join('');
  chatMsgEl.scrollTop = chatMsgEl.scrollHeight;
}

// Multi-Client MMO Heartbeat Sync
const clientId = `uw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
setInterval(async () => {
  try {
    const res = await fetch('/api/mmo/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        name: sim.player.name,
        guild: sim.player.guild,
        guildIcon: sim.player.guildIcon,
        classId: sim.player.classId,
        classTier: sim.player.classTier,
        level: sim.player.level,
        zoneId: sim.zoneId,
        x: Math.round(sim.player.x),
        y: Math.round(sim.player.y),
        facing: sim.player.facing,
        animState: sim.player.animState
      })
    });
    if (res.ok) {
      const data = await res.json();
      sim.remotePeers = data.peers || [];
    }
  } catch {
    // Offline/single-player fallback
  }
}, 2000);

// Main 60 FPS Animation Loop
let lastTime = performance.now();
let hudTick = 0;

function animate(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  sim.step(dt, inputState);
  renderer.render();
  renderMinimap();

  hudTick += dt;
  if (hudTick >= 0.15) {
    hudTick = 0;
    updateHud();
  }

  requestAnimationFrame(animate);
}

updateHud();
requestAnimationFrame(animate);
