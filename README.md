# Unwritten World (`unwritten-world`)

A playable 2D side-scrolling action-platformer MMORPG clone of **[Unwritten World (Steam App ID `4314900`)](https://store.steampowered.com/app/4314900/Unwritten_World/)**.

## Key Features Extrapolated from Steam Videos & Screenshots
- **5 Interconnected 2D Side-Scrolling Regions (No Level Gates)**:
  - **Driftwood Shores — *Lost At Sea*** (Starter Castaway beach, knotted climbing ropes, Sand Crabs, Arbaldo, Elwha Whale-Skull Resurrection Shrine).
  - **Namu Forest — *Namu's Rest*** (Forest village hub with moss-roofed Hobbit treehouses, Bounty Board, Stone Forge, Sawmill, Artificing Station, Cooking Pot, Crafting Table, and Storage).
  - **Namu Forest — *Sprout Forest & Croaking Rapids*** (Ancient vine guardian statue, glowing mushrooms, Will-o-Wisp stone altar, Sproutlings, Blue Berry Slimes, Moss Frogs, Forager Goblins, Wood Golems, and the **Mutant Slime** zone boss).
  - **Namu Forest — *Gibler's Mines*** (Subterranean mining caverns with bone ladders, Tin & Cobalt veins, Goblin Miners, and Ore Golems).
  - **Bayou Badlands & Ashen Expanse** (High-tier swamp and desert frontier with Bayou Guardians, Mudmire Chompers, and Deadwood trees).
- **8 Unique Playable Classes (+ Starter Castaway)**:
  - Switch or promote (`Tier I → II → III`) freely at any level across **Bushido (Samurai)**, **Elementalist**, **Templar**, **Juggernaut**, **Forest Warden**, **Ranger**, **Bandit**, and **Shaman**.
- **Emergent Living World Events**:
  - **Greed Spirit Ambush & Loot Theft**: Shadowy `Lv. 70 Greed Spirits` ambush the area, steal ground items/scrolls (displaying the stolen scroll overhead), and attempt to flee. Slaying them before they escape bursts a jackpot loot shower.
  - **Forager Goblin Acorn → Instant Harvestable Tree**: Slaying a Forager Goblin drops an acorn that flashes with a star blossom and immediately grows into a harvestable tree on the platform.
  - **Mutant Slime Boss Encounter**: Features the top-center Boss Health Bar with real-time hit-combo (`xN`) and cumulative damage tracking.
- **10 Interconnected Life Skills, Crafter Name Inscriptions & Wearable Monster Cards**:
  - *Woodcutting, Mining, Crafting, Artificing, Cooking, Monster Hunter, Imbuing, Processing, Taming, and Alchemy*.
  - Every weapon or armor piece you craft is permanently inscribed with **`Crafted by <PlayerName>`**.
  - Inspect regional drop tables (`70%`, `1/33`, `1/649`) and equip **Wearable Monster Cards** in the **Bestiary**.

## Quick Start

```bash
cd /Users/derya/Gemini-4/unwritten-world
npm start
# Open http://127.0.0.1:8096
```
Or double-click `Launch.command` in Finder.

## Verification

```bash
npm test     # Runs deterministic simulation unit tests
npm run qa   # Runs headless Chromium Playwright QA & captures screenshots
```
