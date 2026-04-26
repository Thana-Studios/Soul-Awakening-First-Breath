let gameState = {
    started: false,
    qi: 0,
    maxQi: 100,
    realm: "Mortal Shell",
    realmIndex: 0,
    age: 0,
    maxAge: 70,
    combatPower: 5,
    gold: 0,
    spiritRoot: "Unawakened",
    lineage: "None",
    isDead: false
};

// ── Realms now come from lore.js (REALMS array).
// We keep a lightweight local table only for the
// mechanical values (ageLimit, success chance).
const realmMechanics = [
    { ageLimit: 75,   success: 0.8 },  // 0 Mortal Shell
    { ageLimit: 120,  success: 0.6 },  // 1 Qi Awakening
    { ageLimit: 200,  success: 0.45 }, // 2 Foundation Forging
    { ageLimit: 400,  success: 0.3 },  // 3 Core Condensation
    { ageLimit: 800,  success: 0.2 },  // 4 Soul Refinement
    { ageLimit: 2000, success: 0.1 },  // 5 Nascent Divinity
    { ageLimit: 5000, success: 0.07 }, // 6 Void Transcendence
    { ageLimit: 15000,success: 0.04 }, // 7 Celestial Sovereign
    { ageLimit: 99999,success: 0.02 }, // 8 Eternal Dao (final)
];

const YEAR_DURATION = 5 * 60 * 1000;
let timeToNextYear = YEAR_DURATION;

window.onload = () => {
    startBirthSequence();
};

// ─────────────────────────────────────────────
//  BIRTH SEQUENCE
// ─────────────────────────────────────────────
async function startBirthSequence() {
    const log = document.getElementById('log-container');
    log.innerHTML = "";
    writeToLog("The wheel of reincarnation spins...", "system");
    await delay(1500);

    // ── Lineage roll ──
    const lineageRoll = Math.random();
    if (lineageRoll > 0.9) {
        gameState.lineage = "Imperial Clan";
        gameState.gold = 1000;
        gameState.maxAge = 90;
        writeToLog("A golden dragon marks the sky. You are born to the Imperial Household.");
    } else if (lineageRoll > 0.6) {
        gameState.lineage = "Great Merchant House";
        gameState.gold = 400;
        gameState.maxAge = 80;
        writeToLog("Born amidst the scent of Spirit Stones and trade scrolls.");
    } else if (lineageRoll > 0.25) {
        gameState.lineage = "Mortal Village";
        gameState.combatPower += 15;
        gameState.maxAge = 70;
        writeToLog("Born in a frontier village. You were forged by hardship.");
    } else {
        gameState.lineage = "Temple Foundling";
        gameState.maxQi = 180;
        gameState.maxAge = 65;
        writeToLog("Left in a basket at a monk's door. Your lineage is silent.");
    }

    await delay(2000);

    // ── Spirit Root roll ──
    const rootRoll = Math.random();
    if (rootRoll > 0.95) {
        gameState.spiritRoot = "Heavenly Saint Root";
        gameState.maxQi += 100;
        writeToLog("The local elders tremble. You possess a Saint Grade Root!", "system");
    } else if (rootRoll > 0.7) {
        gameState.spiritRoot = "Earthly Grade Root";
        gameState.maxQi += 40;
        writeToLog("You display an exceptional affinity for the ambient Yuan Qi.");
    } else {
        gameState.spiritRoot = "Mortal Grade Root";
        writeToLog("Your talent is ordinary, but your resolve remains unbroken.");
    }

    await delay(2000);
    beginAscension();
}

function beginAscension() {
    gameState.started = true;
    gameState.age = 14;
    // Set starting realm from lore
    const startRealm = loreGetRealm(1); // index 1 = Mortal Shell
    gameState.realm = startRealm.name;
    gameState.realmIndex = 0;

    document.getElementById('action-bar').style.display = 'flex';
    writeToLog("Fourteen years pass in a breath. Your journey begins.", "system");
    updateUI();
    startWorldClock();
}

// ─────────────────────────────────────────────
//  WORLD CLOCK
// ─────────────────────────────────────────────
function startWorldClock() {
    setInterval(() => {
        if (gameState.isDead) return;
        timeToNextYear -= 1000;
        if (timeToNextYear <= 0) {
            gameState.age++;
            timeToNextYear = YEAR_DURATION;
            if (gameState.age >= gameState.maxAge) {
                die(loreDeath());
            }
            updateUI();
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeToNextYear / 60000);
    const secs = Math.floor((timeToNextYear % 60000) / 1000);
    document.getElementById('time-countdown').innerText =
        `Cycle Ends: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ─────────────────────────────────────────────
//  ACTIONS
// ─────────────────────────────────────────────
function meditate() {
    if (gameState.isDead) return;

    let gain = 10 + (gameState.realmIndex * 5);
    if (gameState.spiritRoot === "Heavenly Saint Root") gain += 15;
    gameState.qi = Math.min(gameState.maxQi, gameState.qi + gain);

    // Lore flavour line + Qi gain notice
    writeToLog(loreCultivate());
    writeToLog(`(+${gain} Qi)`, "system-minor");

    updateUI();
}

function explore() {
    if (gameState.isDead) return;

    const roll = Math.random();

    if (roll > 0.85) {
        // Combat encounter — lore handles the description, mechanics stay here
        triggerCombat();
    } else if (roll > 0.5) {
        // Spirit Stone find — use lore event pool filtered to "good"
        const event = loreExplore();
        const treasure = Math.floor(Math.random() * 20) + 5;
        gameState.gold += treasure;

        // Pick a good-tagged event for flavour, append the mechanical result
        const goodEvents = EXPLORE_EVENTS.filter(e => e.tag === "good");
        const flavour = loreRandom(goodEvents).msg;
        writeToLog(flavour, "good");
        writeToLog(`(+${treasure} Gold)`, "system-minor");
    } else {
        // Neutral / atmospheric event
        const event = loreExplore();
        // Bias toward neutral/bad for flavour variety
        const quietEvents = EXPLORE_EVENTS.filter(e => e.tag === "neutral" || e.tag === "bad");
        writeToLog(loreRandom(quietEvents).msg);
    }

    updateUI();
}

function breakthrough() {
    if (gameState.isDead) return;

    if (gameState.qi < gameState.maxQi) {
        writeToLog("Your foundation is insufficient for ascension.", "system");
        return;
    }

    // Attempt flavour before the roll resolves
    writeToLog(loreAscendAttempt(), "system");

    const nextMechanicsIndex = Math.min(gameState.realmIndex, realmMechanics.length - 1);
    const chance = realmMechanics[nextMechanicsIndex].success;

    if (Math.random() < chance) {
        gameState.realmIndex++;
        // Pull name from lore — loreGetRealm uses 1-based display index
        // realmIndex 0 = Mortal Shell (lore index 1), so offset by 1
        const loreIndex = Math.min(gameState.realmIndex + 1, REALMS.length - 1);
        const newRealm = loreGetRealm(loreIndex);

        gameState.realm = newRealm.name;
        gameState.maxAge = realmMechanics[Math.min(gameState.realmIndex, realmMechanics.length - 1)].ageLimit;
        gameState.combatPower *= 2.2;
        gameState.qi = 0;
        gameState.maxQi *= 1.5;

        writeToLog(loreBreakthroughSuccess(newRealm.name), "system");
    } else {
        gameState.qi = Math.floor(gameState.qi * 0.4);
        writeToLog(loreBreakthroughFailure(), "bad");
    }

    updateUI();
}

function triggerCombat() {
    const enemyStr = (gameState.realmIndex + 1) * 22;
    const roll = Math.floor(Math.random() * enemyStr);

    // Get a combat-tagged event for the encounter description
    const combatEvents = EXPLORE_EVENTS.filter(e => e.tag === "combat");
    writeToLog(loreRandom(combatEvents).msg, "system");

    if (gameState.combatPower >= roll) {
        gameState.combatPower += 6;
        writeToLog("Victory. Your battle intent sharpens. (+6 Combat Power)", "good");
    } else {
        die("Slain in a duel. Your path ends in blood.");
    }
}

// ─────────────────────────────────────────────
//  DEATH
// ─────────────────────────────────────────────
function die(reason) {
    gameState.isDead = true;
    writeToLog(reason, "death");
    document.getElementById('realm-display').innerText = "Deceased";
    document.getElementById('realm-subtitle').innerText = "";
    document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
    updateUI();
}

// ─────────────────────────────────────────────
//  UI
// ─────────────────────────────────────────────
function updateUI() {
    if (!gameState.isDead) {
        document.getElementById('realm-display').innerText = gameState.realm;

        // Update the poetic subtitle from lore
        const loreIndex = Math.min(gameState.realmIndex + 1, REALMS.length - 1);
        const realmData = loreGetRealm(loreIndex);
        const subtitle = document.getElementById('realm-subtitle');
        if (subtitle) {
            subtitle.innerText = realmData.title;
            subtitle.style.color = realmData.color;
        }
    }

    document.getElementById('qi-count').innerText =
        `${Math.floor(gameState.qi)} / ${Math.floor(gameState.maxQi)}`;
    document.getElementById('age-count').innerText =
        `${gameState.age} / ${gameState.maxAge}`;
    document.getElementById('qi-fill').style.width =
        `${(gameState.qi / gameState.maxQi) * 100}%`;

    const agePercent = (gameState.age / gameState.maxAge) * 100;
    const ageFill = document.getElementById('age-fill');
    ageFill.style.width = `${agePercent}%`;
    if (gameState.maxAge - gameState.age <= 5) {
        ageFill.style.background = "var(--karma-red)";
    }
}

function writeToLog(text, type = "") {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;

    let icon = "";
    if (type === "system")       icon = '<i class="ph ph-sparkle"></i> ';
    if (type === "good")         icon = '<i class="ph ph-sword gold-text"></i> ';
    if (type === "bad")          icon = '<i class="ph ph-warning"></i> ';
    if (type === "death")        icon = '<i class="ph ph-skull"></i> ';
    if (type === "system-minor") icon = '';

    entry.innerHTML =
        `<span class="age-tag">Year ${gameState.age}</span> ${icon}${text}`;

    const log = document.getElementById('log-container');
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// ─────────────────────────────────────────────
//  MENUS
// ─────────────────────────────────────────────
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    const open = menu.style.right === "0px";
    menu.style.right = open ? "-450px" : "0px";
    overlay.style.display = open ? "none" : "block";

    if (!open) {
        // Render stat list
        document.getElementById('extra-stats').innerHTML = `
            <li><i class="ph ph-dna"></i> <span>Origin:</span> ${gameState.lineage}</li>
            <li><i class="ph ph-leaf"></i> <span>Spirit Root:</span> ${gameState.spiritRoot}</li>
            <li><i class="ph ph-coins"></i> <span>Gold:</span> ${gameState.gold}</li>
            <li><i class="ph ph-shield"></i> <span>Combat:</span> ${Math.floor(gameState.combatPower)}</li>
        `;
        // Inject realm lore block above the stats
        const loreIndex = Math.min(gameState.realmIndex + 1, REALMS.length - 1);
        loreRenderInnerEye(loreIndex);
    }
}

function toggleHelp() {
    const modal = document.getElementById('help-modal');
    const overlay = document.getElementById('menu-overlay');
    const showing = modal.style.display === 'block';
    modal.style.display = showing ? 'none' : 'block';
    overlay.style.display = showing ? 'none' : 'block';
}

function closeAllModals() {
    document.getElementById('help-modal').style.display = 'none';
    document.getElementById('side-menu').style.right = '-450px';
    document.getElementById('menu-overlay').style.display = 'none';
}

// ─────────────────────────────────────────────
//  UTILITY
// ─────────────────────────────────────────────
function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}