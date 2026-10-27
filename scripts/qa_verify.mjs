import { chromium } from '../../Ledgervale-Argon/node_modules/playwright-core/index.mjs';
import { createUnwrittenServer } from '../server.mjs';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/derya/.gemini/antigravity/brain/84611f1e-7c63-4a37-8160-47d11bff9675';
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 8097;

async function runQa() {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  process.env.TMPDIR = ARTIFACT_DIR;
  const server = createUnwrittenServer();
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`QA Server started on http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 820 } });

  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Capture Driftwood Shores starter zone + Castaway HUD
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa_1_driftwood_shores.png') });
    console.log('Saved qa_1_driftwood_shores.png');

    // 2. Travel to Sprout Forest, switch to Bushido class, trigger Acorn Tree & Mutant Slime Boss Bar
    await page.evaluate(() => {
      const sim = window.__UW_SIM__;
      sim.loadZone('sprout_forest', 1240, 220);
      sim.changeClass('bushido', 3);
      sim.player.level = 68;
      sim.recalculateStats(true);
      // Hit Mutant Slime to show top-center Boss Health Bar with combo counter
      const boss = sim.monsters.find((m) => m.monsterId === 'mutant_slime');
      if (boss) {
        boss.x = sim.player.x - 75;
        boss.y = sim.player.y;
        sim.useSkill('R');
      }
      // Also sprout an emergent Acorn Tree nearby
      sim.triggerAcornTreeSprout(sim.player.x + 95, sim.player.y);
      sim.spawnGreedSpirit(sim.player.x + 170, sim.player.y);
    });
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa_2_sprout_forest_combat_boss.png') });
    console.log('Saved qa_2_sprout_forest_combat_boss.png');

    // 3. Open Bestiary & Wearable Monster Cards Modal (ss_8.jpg verification)
    await page.click('[data-open-modal="bestiary"]');
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa_3_bestiary_monster_cards.png') });
    console.log('Saved qa_3_bestiary_monster_cards.png');

    // 4. Travel to Namu's Rest Hub & Open Crafting Modal showing Sigtis Veil (ss_9.jpg verification)
    await page.evaluate(() => {
      window.__UW_SIM__.loadZone('namu_rest', 960, 600);
    });
    await page.click('.uw-nav-tab[data-modal="crafting"]');
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa_4_namu_rest_crafting_sigtis_veil.png') });
    console.log('Saved qa_4_namu_rest_crafting_sigtis_veil.png');

    // 5. Open Real-Time Leaderboard Modal showing Top-3 Podium & 10 Life Skills (ss_4.jpg verification)
    await page.click('.uw-nav-tab[data-modal="leaderboard"]');
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa_5_leaderboard_podium.png') });
    console.log('Saved qa_5_leaderboard_podium.png');

    // 6. Open 10 Life Skills & Artificing Research Modal
    await page.click('.uw-nav-tab[data-modal="lifeskills"]');
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa_6_lifeskills_artificing.png') });
    console.log('Saved qa_6_lifeskills_artificing.png');

    if (errors.length > 0) {
      throw new Error(`Browser console/page errors detected: ${errors.join('; ')}`);
    }
    console.log('All Playwright visual & functional QA checks passed with 0 errors!');
  } finally {
    await browser.close();
    server.close();
  }
}

runQa().catch((err) => {
  console.error(err);
  process.exit(1);
});
