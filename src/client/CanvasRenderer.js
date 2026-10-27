import { CLASSES, ITEMS } from '../data/Catalog.js';

export class CanvasRenderer {
  constructor(canvas, sim) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sim = sim;
    this.cameraX = 0;
    this.cameraY = 0;
    this.particles = [];
    for (let i = 0; i < 42; i++) {
      this.particles.push({
        x: Math.random() * 2400,
        y: Math.random() * 600,
        r: 2 + Math.random() * 3.5,
        speedX: (Math.random() - 0.5) * 18,
        speedY: -8 - Math.random() * 14,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (this.canvas.width !== Math.floor(w * dpr) || this.canvas.height !== Math.floor(h * dpr)) {
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.viewW = w;
    this.viewH = h;
  }

  screenToWorld(clientX, clientY) {
    return {
      x: clientX + this.cameraX,
      y: clientY + this.cameraY
    };
  }

  render() {
    this.resize();
    const ctx = this.ctx;
    const sim = this.sim;
    const zone = sim.zone;

    // Smooth camera tracking
    const targetCamX = Math.max(0, Math.min(zone.width - this.viewW, sim.player.x - this.viewW * 0.5));
    const targetCamY = Math.max(-60, Math.min(zone.height - this.viewH + 90, sim.player.y - this.viewH * 0.62));
    this.cameraX += (targetCamX - this.cameraX) * 0.14;
    this.cameraY += (targetCamY - this.cameraY) * 0.14;

    ctx.clearRect(0, 0, this.viewW, this.viewH);

    // 1. Multi-layer Parallax Biome Background
    this.drawParallaxBackground(ctx, zone, sim.time);

    ctx.save();
    ctx.translate(-Math.round(this.cameraX), -Math.round(this.cameraY));

    // 2. Background Landmarks, Shrines & Treehouses
    for (const shrine of zone.shrines || []) {
      this.drawLandmark(ctx, shrine, sim.time);
    }

    // 3. Workstations in Village Hub
    for (const ws of zone.workstations || []) {
      this.drawWorkstation(ctx, ws, sim.time);
    }

    // 4. Platforms (Hand-drawn cobblestone/earth + lush grass/sand/moss tops)
    for (const plat of zone.platforms) {
      this.drawPlatform(ctx, plat);
    }

    // 5. Climbing Ropes & Vines
    for (const rope of zone.ropes) {
      this.drawRope(ctx, rope);
    }

    // 6. Zone Portals
    for (const portal of zone.portals) {
      this.drawPortal(ctx, portal, sim.time);
    }

    // 7. Harvestable Resource Nodes (Trees, Emergent Acorn Trees, Ore Veins)
    for (const node of sim.resourceNodes) {
      if (!node.depleted) {
        this.drawResourceNode(ctx, node, sim.time);
      }
    }

    // 8. NPCs
    for (const npc of zone.npcs || []) {
      this.drawNpc(ctx, npc, sim.time);
    }

    // 9. Ambient AI Adventurers & Connected Multi-Tab Peers
    for (const adv of sim.ambientAdventurers) {
      const cls = CLASSES[adv.classId] || CLASSES.castaway;
      this.drawChibiCharacter(ctx, {
        x: adv.x,
        y: adv.y,
        facing: adv.facing,
        name: adv.name,
        guild: adv.guild,
        guildIcon: adv.guildIcon,
        hairColor: cls.visual.hairColor,
        outfitColor: cls.visual.outfitColor,
        capeColor: cls.visual.capeColor,
        hat: cls.visual.hat,
        weaponStyle: cls.visual.weaponStyle,
        aura: cls.visual.aura,
        animState: 'walk',
        animTime: adv.animPhase,
        isLocalPlayer: false
      });
    }

    for (const peer of sim.remotePeers || []) {
      if (peer.zoneId === sim.zoneId) {
        const cls = CLASSES[peer.classId] || CLASSES.castaway;
        this.drawChibiCharacter(ctx, {
          x: peer.x,
          y: peer.y,
          facing: peer.facing || 1,
          name: peer.name,
          guild: peer.guild || 'Wanderers',
          guildIcon: peer.guildIcon || 'frog',
          hairColor: cls.visual.hairColor,
          outfitColor: cls.visual.outfitColor,
          capeColor: cls.visual.capeColor,
          hat: peer.hatId || cls.visual.hat,
          weaponStyle: cls.visual.weaponStyle,
          aura: cls.visual.aura,
          animState: peer.animState || 'idle',
          animTime: sim.time * 5,
          isLocalPlayer: false
        });
      }
    }

    // 10. Monsters & Emergent Greed Spirit
    for (const mob of sim.monsters) {
      if (!mob.dead) {
        this.drawMonster(ctx, mob, sim.time);
      }
    }

    // 11. Ground Drops (Rasa Lightning Coins + Item Drops with Rarity Beams)
    for (const drop of sim.groundDrops) {
      this.drawGroundDrop(ctx, drop, sim.time);
    }

    // 12. Following Pet Companion
    if (sim.equipment.pet) {
      const petItem = ITEMS[sim.equipment.pet.itemId];
      if (petItem) {
        this.drawPet(ctx, sim.petEntity, petItem.petVisual, sim.time);
      }
    }

    // 13. Local Player Character
    const pCls = CLASSES[sim.player.classId] || CLASSES.castaway;
    const equippedHat = sim.equipment.hat ? ITEMS[sim.equipment.hat.itemId]?.visualHat : pCls.visual.hat;
    this.drawChibiCharacter(ctx, {
      x: sim.player.x,
      y: sim.player.y,
      facing: sim.player.facing,
      name: sim.player.name,
      guild: sim.player.guild,
      guildIcon: sim.player.guildIcon,
      hairColor: pCls.visual.hairColor,
      outfitColor: pCls.visual.outfitColor,
      capeColor: pCls.visual.capeColor,
      hat: equippedHat || pCls.visual.hat,
      weaponStyle: pCls.visual.weaponStyle,
      aura: pCls.visual.aura,
      animState: sim.player.animState,
      animTime: sim.time * 6,
      attackAnimTimer: sim.player.attackAnimTimer,
      isLocalPlayer: true
    });

    // Overhead Harvesting Bar (ss_5.jpg & vid_3_combat.mp4 style)
    if (sim.player.harvestAction) {
      this.drawHarvestProgressBar(ctx, sim.player);
    }

    // Interaction Prompt [T] above player when near NPC/Workstation/Portal
    this.drawInteractionPrompt(ctx, sim);

    // 14. Projectiles & Skill VFX
    for (const proj of sim.projectiles) {
      this.drawProjectile(ctx, proj);
    }
    for (const vfx of sim.vfxEffects) {
      this.drawSkillVfx(ctx, vfx);
    }

    // 15. MapleStory-Style Stacked Floating Combat Text (FCT)
    for (const ft of sim.floatingTexts) {
      this.drawFloatingText(ctx, ft);
    }

    ctx.restore();
  }

  drawParallaxBackground(ctx, zone, time) {
    const w = this.viewW;
    const h = this.viewH;
    const grad = ctx.createLinearGradient(0, 0, 0, h);

    if (zone.theme === 'beach') {
      grad.addColorStop(0, '#56b4e9');
      grad.addColorStop(0.55, '#b3e5fc');
      grad.addColorStop(0.65, '#26a69a');
      grad.addColorStop(1, '#00796b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Puffy clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
      for (let i = 0; i < 6; i++) {
        const cx = ((i * 340 - this.cameraX * 0.15) % (w + 300) + (w + 300)) % (w + 300) - 150;
        const cy = 70 + (i % 3) * 45;
        ctx.beginPath();
        ctx.arc(cx, cy, 42, 0, Math.PI * 2);
        ctx.arc(cx + 35, cy - 10, 52, 0, Math.PI * 2);
        ctx.arc(cx + 75, cy, 38, 0, Math.PI * 2);
        ctx.fill();
      }

      // Distant islands & shipwreck silhouette (ss_7.jpg)
      const shipX = 240 - this.cameraX * 0.25;
      ctx.save();
      ctx.translate(shipX, h * 0.56);
      ctx.fillStyle = '#5d6d6e';
      ctx.beginPath();
      ctx.moveTo(-60, 20);
      ctx.lineTo(50, 0);
      ctx.lineTo(35, 35);
      ctx.lineTo(-45, 35);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#4a5859';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(15, -55);
      ctx.stroke();
      ctx.restore();
    } else if (zone.theme === 'mines') {
      grad.addColorStop(0, '#1e1610');
      grad.addColorStop(0.5, '#3b2b1a');
      grad.addColorStop(1, '#1a130c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Cavern pillars
      ctx.fillStyle = 'rgba(20, 14, 9, 0.55)';
      for (let i = 0; i < 7; i++) {
        const px = ((i * 290 - this.cameraX * 0.25) % (w + 240) + (w + 240)) % (w + 240) - 120;
        ctx.fillRect(px, 0, 68, h);
      }
    } else if (zone.theme === 'bayou_desert') {
      grad.addColorStop(0, '#546e7a');
      grad.addColorStop(0.5, '#8d99ae');
      grad.addColorStop(1, '#c29b61');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant desert mesa & swamp trees
      ctx.fillStyle = 'rgba(74, 88, 89, 0.35)';
      for (let i = 0; i < 6; i++) {
        const tx = ((i * 320 - this.cameraX * 0.22) % (w + 260) + (w + 260)) % (w + 260) - 100;
        ctx.beginPath();
        ctx.moveTo(tx, h);
        ctx.lineTo(tx + 40, h * 0.35);
        ctx.lineTo(tx + 120, h * 0.35);
        ctx.lineTo(tx + 160, h);
        ctx.fill();
      }
    } else {
      // Namu Forest / Sprout Forest (ss_0, ss_4, ss_6, ss_8, ss_9)
      grad.addColorStop(0, '#4f6f58');
      grad.addColorStop(0.55, '#789c7e');
      grad.addColorStop(1, '#557a5e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant giant tree trunks
      ctx.fillStyle = 'rgba(54, 78, 58, 0.55)';
      for (let i = 0; i < 7; i++) {
        const tx = ((i * 310 - this.cameraX * 0.2) % (w + 260) + (w + 260)) % (w + 260) - 120;
        ctx.fillRect(tx, 0, 74, h);
      }

      // Midground warm brown tree trunks
      ctx.fillStyle = 'rgba(104, 78, 52, 0.65)';
      for (let i = 0; i < 5; i++) {
        const tx = ((i * 440 - this.cameraX * 0.38) % (w + 340) + (w + 340)) % (w + 340) - 150;
        ctx.fillRect(tx, 0, 96, h);
      }
    }

    // Floating fireflies / ambient dust motes (ss_0.jpg)
    for (const pt of this.particles) {
      const sx = ((pt.x - this.cameraX * 0.5 + time * pt.speedX) % w + w) % w;
      const sy = ((pt.y - this.cameraY * 0.3 + time * pt.speedY) % h + h) % h;
      const alpha = 0.35 + 0.35 * Math.sin(time * 2.5 + pt.phase);
      ctx.fillStyle = `rgba(255, 230, 140, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, pt.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPlatform(ctx, plat) {
    const { x, y, w, h, style } = plat;
    ctx.save();

    // Base rocky dirt body
    let bodyColor = '#4a331f';
    let pebbleColor = '#66482c';
    let topCapColor = '#4caf50';
    let topHighlight = '#81c784';

    if (style === 'sand' || style === 'desert_sandstone') {
      bodyColor = '#9c7844';
      pebbleColor = '#b89158';
      topCapColor = '#edd087';
      topHighlight = '#fff3c4';
    } else if (style === 'mine_rock') {
      bodyColor = '#3d2b1d';
      pebbleColor = '#59402b';
      topCapColor = '#75563b';
      topHighlight = '#947050';
    } else if (style === 'swamp_moss' || style === 'swamp_sand') {
      bodyColor = '#3a3022';
      pebbleColor = '#524431';
      topCapColor = '#558b2f';
      topHighlight = '#8bc34a';
    }

    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = '#1f140b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Cobblestone / pebble pattern inside platform (matching ss_0 - ss_9)
    ctx.fillStyle = pebbleColor;
    const cols = Math.floor(w / 28);
    const rows = Math.min(4, Math.floor(h / 22));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = x + 14 + c * 28 + (r % 2) * 10;
        const py = y + 18 + r * 20;
        if (px + 10 < x + w && py + 8 < y + h) {
          ctx.beginPath();
          ctx.ellipse(px, py, 10, 7, 0.15 * ((c + r) % 3 - 1), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    // Lush Grass / Sand Top Cap
    ctx.fillStyle = topCapColor;
    ctx.beginPath();
    ctx.roundRect(x - 2, y - 4, w + 4, 12, 6);
    ctx.fill();
    ctx.fillStyle = topHighlight;
    ctx.fillRect(x + 4, y - 2, w - 8, 4);

    // Grass blades along the top if forest or swamp
    if (style === 'forest_earth' || style === 'swamp_moss' || style === 'swamp_sand') {
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 2;
      for (let gx = x + 8; gx < x + w - 8; gx += 12) {
        ctx.beginPath();
        ctx.moveTo(gx, y);
        ctx.lineTo(gx - 3, y - 7);
        ctx.moveTo(gx + 5, y);
        ctx.lineTo(gx + 8, y - 6);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawRope(ctx, rope) {
    const { x, yTop, yBottom, style } = rope;
    ctx.save();
    if (style === 'vine') {
      ctx.strokeStyle = '#33691e';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x, yTop);
      ctx.lineTo(x, yBottom);
      ctx.stroke();

      ctx.fillStyle = '#689f38';
      for (let y = yTop + 14; y < yBottom - 10; y += 22) {
        const side = (Math.floor(y / 22) % 2 === 0) ? 1 : -1;
        ctx.beginPath();
        ctx.ellipse(x + side * 7, y, 6, 3.5, side * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = '#8d6e63';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x, yTop);
      ctx.lineTo(x, yBottom);
      ctx.stroke();

      // Knots / bone rungs
      ctx.fillStyle = style === 'bone_rope' ? '#e0e0e0' : '#5d4037';
      for (let y = yTop + 18; y < yBottom - 10; y += 26) {
        ctx.fillRect(x - 6, y - 2, 12, 4);
      }
    }
    ctx.restore();
  }

  drawPortal(ctx, portal, time) {
    const { x, y, label, color } = portal;
    ctx.save();
    ctx.translate(x, y - 42);
    const pulse = 1 + 0.08 * Math.sin(time * 4);
    ctx.scale(pulse, pulse);

    // Swirling portal vortex (ss_5.jpg & ss_8.jpg bottom-right)
    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 38);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.45, color || '#4dd0e1');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 28, Math.sin(time * 2) * 0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    this.drawLabelPill(ctx, x, y + 14, label, '#80deea');
  }

  drawLandmark(ctx, shrine, time) {
    const { x, y, name, visual } = shrine;
    ctx.save();
    ctx.translate(x, y);

    if (visual === 'whale_skull_shrine') {
      // Elwha Resurrection Shrine (ss_7.jpg)
      ctx.fillStyle = '#e8dec8';
      ctx.strokeStyle = '#2d241b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-75, 0);
      ctx.quadraticCurveTo(-50, -95, 10, -85);
      ctx.quadraticCurveTo(65, -75, 80, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Eye socket
      ctx.fillStyle = '#3e3227';
      ctx.beginPath();
      ctx.ellipse(-20, -38, 16, 12, -0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (visual === 'ancient_statue') {
      // Ancient Vine Statue & Glowing Orange Mushrooms (ss_0.jpg)
      ctx.fillStyle = '#616161';
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-55, -170, 110, 170, 14);
      ctx.fill();
      ctx.stroke();

      // Vines wrapping statue
      ctx.strokeStyle = '#33691e';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-50, -20);
      ctx.bezierCurveTo(40, -60, -40, -110, 45, -150);
      ctx.stroke();

      // Twin glowing orange mushrooms flanking statue
      for (const side of [-1, 1]) {
        const mx = side * 92;
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(mx - 6, -75, 12, 75);
        const mGrad = ctx.createRadialGradient(mx, -85, 5, mx, -85, 38);
        mGrad.addColorStop(0, '#fff59d');
        mGrad.addColorStop(0.6, '#ff9800');
        mGrad.addColorStop(1, 'rgba(255,152,0,0)');
        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.arc(mx, -85, 38, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff9800';
        ctx.strokeStyle = '#4e2600';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(mx, -75, 28, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (visual === 'hobbit_treehouse' || visual === 'canopy_cottage') {
      // Leaf-roofed Hobbit Treehouse (ss_9.jpg & frame_14.jpg)
      ctx.fillStyle = '#d7ccc8';
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -55, 68, Math.PI, 0);
      ctx.lineTo(68, 0);
      ctx.lineTo(-68, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Wooden round door & glowing window
      ctx.fillStyle = '#6d4c41';
      ctx.beginPath();
      ctx.roundRect(-24, -54, 42, 54, [20, 20, 0, 0]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff59d';
      ctx.beginPath();
      ctx.arc(32, -62, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Lush green leaf canopy roof
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.arc(-20, -95, 48, 0, Math.PI * 2);
      ctx.arc(25, -90, 52, 0, Math.PI * 2);
      ctx.arc(0, -115, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (visual === 'vine_obelisk') {
      // Namu Resurrection Shrine (frame_15.jpg)
      ctx.fillStyle = '#757575';
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.lineTo(-18, -125);
      ctx.lineTo(0, -150);
      ctx.lineTo(18, -125);
      ctx.lineTo(24, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (visual === 'wisp_stone_circle') {
      // Will-o-Wisp Stone Circle (frame_03.jpg)
      ctx.fillStyle = '#546e7a';
      ctx.strokeStyle = '#1c262b';
      ctx.lineWidth = 3;
      for (const ox of [-75, -35, 35, 75]) {
        ctx.fillRect(ox - 12, -105, 24, 105);
        ctx.strokeRect(ox - 12, -105, 24, 105);
      }
      // Glowing blue Will-o-Wisp flame
      const bob = Math.sin(time * 4) * 5;
      ctx.fillStyle = '#80d8ff';
      ctx.beginPath();
      ctx.arc(0, -68 + bob, 14, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#8d6e63';
      ctx.strokeStyle = '#2d1c11';
      ctx.lineWidth = 3;
      ctx.fillRect(-30, -55, 60, 55);
      ctx.strokeRect(-30, -55, 60, 55);
    }

    ctx.restore();
    this.drawLabelPill(ctx, x, y + 14, name, '#e0e0e0');
  }

  drawWorkstation(ctx, ws) {
    const { x, y, name, visual } = ws;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#1f140b';
    ctx.lineWidth = 2.5;

    if (visual === 'bounty_board') {
      // Wooden Wanted / Bounty Board (ss_9.jpg)
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-42, -90, 84, 62);
      ctx.strokeRect(-42, -90, 84, 62);
      ctx.fillRect(-32, -28, 10, 28);
      ctx.fillRect(22, -28, 10, 28);
      // Parchment posters
      ctx.fillStyle = '#fff8e1';
      ctx.fillRect(-32, -80, 24, 34);
      ctx.fillRect(6, -78, 24, 32);
    } else if (visual === 'stone_forge') {
      // Stone Brick Furnace Forge (ss_9.jpg & frame_15.jpg)
      ctx.fillStyle = '#5c5366';
      ctx.beginPath();
      ctx.roundRect(-38, -85, 76, 85, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff6d00';
      ctx.beginPath();
      ctx.arc(0, -24, 18, Math.PI, 0);
      ctx.fill();
    } else if (visual === 'sawmill') {
      // Sawmill log & saw blade (ss_9.jpg)
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(-45, -26, 90, 18);
      ctx.strokeRect(-45, -26, 90, 18);
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath();
      ctx.arc(18, -32, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Artificing Station / Crafting Table / Cooking Pot / Storage
      ctx.fillStyle = '#795548';
      ctx.fillRect(-34, -36, 68, 36);
      ctx.strokeRect(-34, -36, 68, 36);
      ctx.fillStyle = visual === 'artificing_table' ? '#ce93d8' : '#ffb74d';
      ctx.beginPath();
      ctx.arc(0, -44, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
    this.drawLabelPill(ctx, x, y + 14, name, '#ffd54f');
  }

  drawResourceNode(ctx, node, time) {
    const { x, y, visual, isEmergent } = node;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#1f140b';
    ctx.lineWidth = 2.5;

    if (visual === 'tin_vein' || visual === 'cobalt_vein') {
      // Ore outcrop (ss_1.jpg & ss_5.jpg)
      ctx.fillStyle = '#78716aa8';
      ctx.beginPath();
      ctx.moveTo(-26, 0);
      ctx.lineTo(-18, -36);
      ctx.lineTo(6, -42);
      ctx.lineTo(26, -24);
      ctx.lineTo(28, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Crystal / ore chunks
      ctx.fillStyle = visual === 'cobalt_vein' ? '#2979ff' : '#cfd8dc';
      for (const [cx, cy] of [[-10, -18], [6, -26], [12, -12], [-4, -8]]) {
        ctx.fillRect(cx - 5, cy - 5, 10, 10);
        ctx.strokeRect(cx - 5, cy - 5, 10, 10);
      }
    } else if (visual === 'driftwood_node') {
      // Driftwood branch on sand (ss_7.jpg)
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath();
      ctx.moveTo(-28, -4);
      ctx.lineTo(24, -18);
      ctx.lineTo(28, -8);
      ctx.lineTo(-24, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Harvestable Trees & Emergent Acorn Trees (frame_11.jpg & vid_1_intro.mp4)
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-12, -72, 24, 72);
      ctx.strokeRect(-12, -72, 24, 72);

      if (visual === 'deadwood_tree') {
        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, -65);
        ctx.lineTo(-32, -110);
        ctx.moveTo(0, -55);
        ctx.lineTo(34, -105);
        ctx.stroke();
      } else {
        ctx.fillStyle = isEmergent ? '#43a047' : '#2e7d32';
        ctx.beginPath();
        ctx.arc(-24, -82, 32, 0, Math.PI * 2);
        ctx.arc(24, -82, 32, 0, Math.PI * 2);
        ctx.arc(0, -106, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Red/golden fruit or acorns in canopy (frame_11.jpg)
        ctx.fillStyle = '#ef5350';
        for (const [fx, fy] of [[-18, -82], [14, -86], [0, -108]]) {
          ctx.beginPath();
          ctx.arc(fx, fy, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
    if (isEmergent) {
      this.drawLabelPill(ctx, x, y + 14, 'Tree', '#69f0ae');
    }
  }

  drawNpc(ctx, npc, time) {
    this.drawChibiCharacter(ctx, {
      x: npc.x,
      y: npc.y,
      facing: -1,
      name: npc.name,
      guild: npc.title,
      guildIcon: 'sparkle',
      hairColor: '#ffd54f',
      outfitColor: '#5d4037',
      capeColor: '#2e7d32',
      hat: 'laurel_crown',
      weaponStyle: 'none',
      animState: 'idle',
      animTime: time * 3,
      isLocalPlayer: false
    });

    // Quest scroll / turn-in indicator above NPC head (ss_7.jpg & frame_15.jpg)
    const st = npc.questId ? this.sim.questState[npc.questId] : null;
    if (st && !st.turnedIn) {
      ctx.save();
      ctx.translate(npc.x, npc.y - 84 + Math.sin(time * 4) * 3);
      ctx.fillStyle = st.completed ? '#ffd54f' : '#fff8e1';
      ctx.strokeStyle = '#1f140b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-12, -14, 24, 24, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1f140b';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(st.completed ? '?' : '!', 0, 3);
      ctx.restore();
    }
  }

  drawMonster(ctx, mob, time) {
    const { x, y, visual, facing, hp, maxHp, hitFlash, isLootThief } = mob;
    ctx.save();
    ctx.translate(x, y);
    if (hitFlash > 0) {
      ctx.filter = 'brightness(1.75)';
    }

    ctx.save();
    ctx.scale(facing || 1, 1);
    ctx.strokeStyle = '#1b140e';
    ctx.lineWidth = 2.5;

    if (visual === 'sand_crab' || visual === 'shell_crab') {
      // Sand Crab (ss_7.jpg)
      ctx.fillStyle = visual === 'shell_crab' ? '#8d6e63' : '#d9822b';
      ctx.beginPath();
      ctx.ellipse(0, -16, 22, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Eye stalks
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.arc(-7, -28, 3.5, 0, Math.PI * 2);
      ctx.arc(7, -28, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (visual === 'sproutling') {
      // Cute white turnip Sproutling with leaf on head (ss_4.jpg)
      ctx.fillStyle = '#f5f0e6';
      ctx.beginPath();
      ctx.roundRect(-18, -32, 36, 32, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.ellipse(-7, -38, 8, 4, -0.4, 0, Math.PI * 2);
      ctx.ellipse(7, -38, 8, 4, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1f140b';
      ctx.beginPath();
      ctx.arc(-6, -15, 2.5, 0, Math.PI * 2);
      ctx.arc(6, -15, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (visual === 'berry_slime' || visual === 'mutant_slime') {
      // Blue Berry Slime or Giant Mutant Slime Boss (ss_6.jpg)
      const scale = visual === 'mutant_slime' ? 2.1 : 1.0;
      ctx.scale(scale, scale);
      ctx.fillStyle = visual === 'mutant_slime' ? '#6a1b9a' : '#1e88e5';
      ctx.beginPath();
      ctx.arc(0, -18, 22, Math.PI, 0);
      ctx.lineTo(22, 0);
      ctx.lineTo(-22, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6, -14, 3, 0, Math.PI * 2);
      ctx.arc(6, -14, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (visual === 'moss_frog') {
      // Chubby Green Moss Frog (ss_0.jpg & ss_3.jpg)
      ctx.fillStyle = '#388e3c';
      ctx.beginPath();
      ctx.ellipse(0, -22, 26, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e6ce9a';
      ctx.beginPath();
      ctx.ellipse(6, -16, 16, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbc02d';
      ctx.beginPath();
      ctx.arc(6, -34, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (visual === 'wood_golem' || visual === 'sandstone_golem') {
      // Towering Wood Golem (ss_8.jpg & vid_1_intro.mp4)
      ctx.fillStyle = visual === 'sandstone_golem' ? '#bcaaa4' : '#8d6e63';
      // Legs & torso
      ctx.fillRect(-22, -32, 16, 32);
      ctx.strokeRect(-22, -32, 16, 32);
      ctx.fillRect(6, -32, 16, 32);
      ctx.strokeRect(6, -32, 16, 32);
      ctx.fillRect(-26, -78, 52, 48);
      ctx.strokeRect(-26, -78, 52, 48);
      // Mossy shoulders
      if (visual === 'wood_golem') {
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.arc(-22, -74, 16, 0, Math.PI * 2);
        ctx.arc(22, -74, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      // Wooden mask head
      ctx.fillStyle = visual === 'sandstone_golem' ? '#d7ccc8' : '#a1887f';
      ctx.fillRect(-16, -104, 32, 30);
      ctx.strokeRect(-16, -104, 32, 30);
      ctx.fillStyle = '#1b140e';
      ctx.fillRect(-8, -94, 4, 9);
      ctx.fillRect(4, -94, 4, 9);
    } else if (visual === 'greed_spirit') {
      // Shadowy Black-Smoke Greed Spirit with Stolen Scroll Overhead (ss_3.jpg & vid_3_combat.mp4)
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(0, -28, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Glowing white eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6, -28, 3, 0, Math.PI * 2);
      ctx.arc(8, -28, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Goblin Miner / Forager Goblin / Bayou Guardian / Sand Chomper
      ctx.fillStyle = '#689f38';
      ctx.beginPath();
      ctx.roundRect(-16, -46, 32, 46, 8);
      ctx.fill();
      ctx.stroke();
      // Helmet or Acorn Hood
      ctx.fillStyle = visual === 'goblin_miner' ? '#fbc02d' : '#5d4037';
      ctx.beginPath();
      ctx.arc(0, -46, 17, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Floating Stolen Scroll Icon above Greed Spirit (Exact match to ss_3.jpg!)
    if (isLootThief) {
      const bob = Math.sin(time * 6) * 4;
      ctx.fillStyle = '#ce93d8';
      ctx.strokeStyle = '#1f140b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-10, -82 + bob, 20, 22, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Monster Health Bar & Nameplate
    if (hp < maxHp || isLootThief) {
      const barW = 54;
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(-barW / 2, -64, barW, 6);
      ctx.fillStyle = isLootThief ? '#ce93d8' : '#ef5350';
      ctx.fillRect(-barW / 2, -64, barW * Math.max(0, hp / maxHp), 6);
    }

    ctx.restore();
    this.drawLabelPill(ctx, x, y + 13, `Lv.${mob.level} ${mob.name}`, isLootThief ? '#ce93d8' : '#cfd8dc');
  }

  drawChibiCharacter(ctx, ch) {
    const {
      x,
      y,
      facing,
      name,
      guild,
      hairColor,
      outfitColor,
      capeColor,
      hat,
      weaponStyle,
      aura,
      animState,
      animTime,
      attackAnimTimer
    } = ch;

    ctx.save();
    ctx.translate(x, y);

    const bob = animState === 'walk' ? Math.abs(Math.sin(animTime * 2)) * 4 : Math.sin(animTime) * 1.5;

    // Class Aura (Bushido Kanji 武, Arcane Orbs, Crimson Petals, Holy Ring)
    if (aura === 'bushido_kanji') {
      ctx.strokeStyle = 'rgba(255, 77, 109, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, -4, 34, 9, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 77, 109, 0.85)';
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'center';
      ctx.fillText('武', 0, -76);
    } else if (aura === 'arcane_orbs') {
      for (let i = 0; i < 3; i++) {
        const ang = animTime * 0.7 + (i * Math.PI * 2) / 3;
        const ox = Math.cos(ang) * 28;
        const oy = -34 + Math.sin(ang) * 12;
        ctx.fillStyle = '#b388ff';
        ctx.beginPath();
        ctx.arc(ox, oy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (aura === 'crimson_petals') {
      for (let i = 0; i < 4; i++) {
        const ang = animTime * 0.6 + (i * Math.PI) / 2;
        ctx.fillStyle = '#ff4d6d';
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * 26, -32 + Math.sin(ang) * 10, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.save();
    ctx.translate(0, -bob);
    ctx.scale(facing || 1, 1);
    ctx.strokeStyle = '#1b140e';
    ctx.lineWidth = 2.4;

    // Cape
    if (capeColor) {
      ctx.fillStyle = capeColor;
      ctx.beginPath();
      ctx.moveTo(-6, -36);
      ctx.lineTo(-22, -6);
      ctx.lineTo(-6, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Boots / Legs
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(-10, -12, 8, 12);
    ctx.strokeRect(-10, -12, 8, 12);
    ctx.fillRect(2, -12, 8, 12);
    ctx.strokeRect(2, -12, 8, 12);

    // Chibi Torso / Armor Tunic
    ctx.fillStyle = outfitColor || '#5d4037';
    ctx.beginPath();
    ctx.roundRect(-13, -36, 26, 25, 6);
    ctx.fill();
    ctx.stroke();

    // Chibi Head
    ctx.fillStyle = '#ffe0bd';
    ctx.beginPath();
    ctx.arc(0, -49, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Anime Eyes
    ctx.fillStyle = '#1f140b';
    ctx.beginPath();
    ctx.ellipse(2, -48, 2.3, 3.5, 0, 0, Math.PI * 2);
    ctx.ellipse(10, -48, 2.3, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = hairColor || '#3dd4f5';
    ctx.beginPath();
    ctx.arc(0, -53, 16.5, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
    ctx.stroke();

    // Equipped Hat / Headgear (Wizard Hat, Boar Hood, Sigtis Veil, Samurai Headband, Leaf Wreath)
    if (hat === 'wizard_hat_blue') {
      ctx.fillStyle = '#1976d2';
      ctx.beginPath();
      ctx.ellipse(0, -60, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-14, -60);
      ctx.lineTo(4, -86);
      ctx.lineTo(14, -60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (hat === 'boar_pelt_hood') {
      ctx.fillStyle = '#5d4037';
      ctx.beginPath();
      ctx.arc(0, -54, 18, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
    } else if (hat === 'sigtis_veil') {
      ctx.fillStyle = '#263238';
      ctx.beginPath();
      ctx.arc(0, -53, 18, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(6, -58, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (hat === 'leaf_wreath' || hat === 'laurel_crown') {
      ctx.strokeStyle = hat === 'laurel_crown' ? '#ffd54f' : '#43a047';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -56, 16, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }

    // Weapon in Hand
    ctx.save();
    const swingAngle = attackAnimTimer > 0 ? Math.sin(attackAnimTimer * 18) * 1.1 : 0.2;
    ctx.translate(10, -24);
    ctx.rotate(swingAngle);
    ctx.strokeStyle = '#1b140e';
    ctx.lineWidth = 2.2;

    if (weaponStyle === 'katana') {
      ctx.fillStyle = '#eceff1';
      ctx.fillRect(0, -3, 36, 4);
      ctx.strokeRect(0, -3, 36, 4);
    } else if (weaponStyle === 'skull_staff') {
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(-4, -22, 4, 38);
      ctx.fillStyle = '#b388ff';
      ctx.beginPath();
      ctx.arc(-2, -26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (weaponStyle === 'nature_bow' || weaponStyle === 'hunter_bow') {
      ctx.strokeStyle = weaponStyle === 'nature_bow' ? '#43a047' : '#8d6e63';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(4, 0, 18, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(0, -4, 28, 7);
      ctx.strokeRect(0, -4, 28, 7);
    }
    ctx.restore();

    ctx.restore();
    ctx.restore();

    // Dual Dark-Pill Nameplate + Guild Tag underneath character (Matching ss_0 - ss_9)
    this.drawLabelPill(ctx, x, y + 13, name, '#ffffff');
    if (guild) {
      this.drawLabelPill(ctx, x, y + 30, `🐸 ${guild}`, '#a5d6a7', true);
    }
  }

  drawPet(ctx, pet, visual, time) {
    ctx.save();
    ctx.translate(pet.x, pet.y - 12 + Math.sin(time * 7) * 3);
    ctx.scale(pet.facing || 1, 1);
    ctx.strokeStyle = '#1f140b';
    ctx.lineWidth = 2;
    ctx.fillStyle = visual === 'sproutling_pet' ? '#f5f0e6' : visual === 'shadow_imp' ? '#311b92' : '#e53935';
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(4, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawGroundDrop(ctx, drop, time) {
    const bob = Math.sin(time * 5 + drop.x) * 3;
    ctx.save();
    ctx.translate(drop.x, drop.y - 10 + bob);

    if (drop.type === 'rasa') {
      // Gold Rasa Coin with Lightning Bolt (ss_2, ss_3, ss_7)
      ctx.fillStyle = '#ffb300';
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff8e1';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', 0, 3.5);
    } else {
      const item = ITEMS[drop.itemId];
      // Vertical rarity light beam (ss_2 & ss_3)
      if (item && (item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary')) {
        const beamGrad = ctx.createLinearGradient(0, 0, 0, -55);
        beamGrad.addColorStop(0, item.rarity === 'legendary' ? 'rgba(255,215,0,0.65)' : 'rgba(179,136,255,0.65)');
        beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(-6, -55, 12, 55);
      }
      ctx.fillStyle = '#80deea';
      ctx.strokeStyle = '#1b140e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-9, -9, 18, 18, 4);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  drawHarvestProgressBar(ctx, player) {
    const ha = player.harvestAction;
    if (!ha) return;
    const pct = Math.min(1, ha.timer / ha.duration);
    const x = player.x;
    const y = player.y - 78;
    ctx.save();
    ctx.fillStyle = 'rgba(18, 22, 30, 0.85)';
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - 42, y - 10, 84, 16, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(x - 38, y - 6, 76 * pct, 8);
    ctx.restore();
  }

  drawInteractionPrompt(ctx, sim) {
    const px = sim.player.x;
    const py = sim.player.y;
    for (const npc of sim.zone.npcs || []) {
      if (Math.hypot(npc.x - px, npc.y - py) <= 95) {
        this.drawLabelPill(ctx, npc.x, npc.y - 68, `Speak to ${npc.name} [T]`, '#ffd54f');
        return;
      }
    }
    for (const ws of sim.zone.workstations || []) {
      if (Math.hypot(ws.x - px, ws.y - py) <= 95) {
        this.drawLabelPill(ctx, ws.x, ws.y - 68, `Use ${ws.name} [T]`, '#ffd54f');
        return;
      }
    }
    for (const portal of sim.zone.portals || []) {
      if (Math.hypot(portal.x - px, portal.y - py) <= 85) {
        this.drawLabelPill(ctx, portal.x, portal.y - 88, `Enter ${portal.label} [T]`, '#80deea');
        return;
      }
    }
  }

  drawProjectile(ctx, proj) {
    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.fillStyle = proj.type === 'void_orb' ? '#b388ff' : proj.type === 'fireball' ? '#ff7043' : '#ffd54f';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawSkillVfx(ctx, vfx) {
    const progress = 1 - vfx.timer / vfx.maxTimer;
    const alpha = Math.max(0, 1 - progress);
    ctx.save();
    ctx.translate(vfx.x, vfx.y);
    ctx.globalAlpha = alpha;

    if (vfx.type === 'black_pink_cuts' || vfx.type === 'sakura_slash') {
      // Bushido dimensional katana cuts (frame_07.jpg & frame_08.jpg)
      ctx.strokeStyle = '#ff4d88';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-55, -35);
      ctx.lineTo(55, 35);
      ctx.moveTo(-45, 30);
      ctx.lineTo(50, -30);
      ctx.stroke();
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (vfx.type === 'ice_glacier' || vfx.type === 'sky_lances') {
      // Elementalist ice block & sky lances (ss_3.jpg & frame_06.jpg)
      ctx.fillStyle = 'rgba(129, 212, 250, 0.78)';
      ctx.strokeStyle = '#e1f5fe';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-38, -42, 76, 62, 10);
      ctx.fill();
      ctx.stroke();
    } else if (vfx.type === 'acorn_blossom') {
      // Forager Goblin Acorn Star Blossom (frame_10.jpg)
      ctx.fillStyle = '#e1f5fe';
      ctx.strokeStyle = '#4fc3f7';
      ctx.lineWidth = 4;
      const r = 36 + progress * 24;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const x1 = Math.cos(a) * r;
        const y1 = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Sweeping slash arc / burst
      ctx.strokeStyle = vfx.type === 'purple_lightning' ? '#b388ff' : '#ffd54f';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, 34 + progress * 22, -Math.PI * 0.6, Math.PI * 0.6);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawFloatingText(ctx, ft) {
    const alpha = Math.min(1, (ft.timer / ft.maxTimer) * 1.4);
    ctx.save();
    ctx.translate(ft.x, ft.y);
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';

    if (ft.subText) {
      ctx.font = '900 15px "Trebuchet MS", Impact, sans-serif';
      ctx.strokeStyle = '#1b0c1a';
      ctx.lineWidth = 4;
      ctx.strokeText(ft.subText, 0, -22);
      ctx.fillStyle = ft.subText === 'EXTRA!' ? '#ffd54f' : '#ff80ab';
      ctx.fillText(ft.subText, 0, -22);
    }

    const isCrit = ft.style === 'crit';
    ctx.font = isCrit ? '900 24px "Trebuchet MS", Impact, sans-serif' : '900 20px "Trebuchet MS", Impact, sans-serif';
    ctx.strokeStyle = '#1a110b';
    ctx.lineWidth = 4.5;
    ctx.strokeText(ft.text, 0, 0);

    if (ft.style === 'crit') {
      ctx.fillStyle = '#ff6090';
    } else if (ft.style === 'dodge' || ft.style === 'miss') {
      ctx.fillStyle = '#ce93d8';
    } else if (ft.style === 'heal') {
      ctx.fillStyle = '#69f0ae';
    } else if (ft.style === 'extra' || ft.style === 'xp') {
      ctx.fillStyle = '#80deea';
    } else {
      ctx.fillStyle = '#ffd54f';
    }
    ctx.fillText(ft.text, 0, 0);
    ctx.restore();
  }

  drawLabelPill(ctx, x, y, text, textColor = '#ffffff', small = false) {
    ctx.save();
    ctx.font = small ? '600 10px sans-serif' : '600 11px sans-serif';
    const w = ctx.measureText(text).width + 14;
    const h = small ? 15 : 17;
    ctx.fillStyle = 'rgba(15, 18, 24, 0.78)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 4);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + 0.5);
    ctx.restore();
  }
}
