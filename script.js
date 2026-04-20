// --- GAME STATE ---
let gameState = {
    qi: 0,
    maxQi: 100,
    realm: "Mortal Coil",
    realmIndex: 0,
    age: 16,
    maxAge: 80,
    combatPower: 10,
    isDead: false
};

const realms = [
    { name: "Mortal Coil", ageLimit: 80, success: 0.7 },
    { name: "Qi Condensation", ageLimit: 150, success: 0.5 },
    { name: "Foundation Establishment", ageLimit: 320, success: 0.35 },
    { name: "Core Formation", ageLimit: 800, success: 0.2 },
    { name: "Nascent Soul", ageLimit: 3000, success: 0.1 }
];

// --- MENU FUNCTIONS ---
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    
    if (menu.style.right === "0px") {
        menu.style.right = "-400px";
        overlay.style.display = "none";
    } else {
        menu.style.right = "0px";
        overlay.style.display = "block";
        updateMenuContent();
    }
}

function updateMenuContent() {
    const statsList = document.getElementById('extra-stats');
    const chance = (realms[gameState.realmIndex].success * 100).toFixed(0);
    statsList.innerHTML = `
        <li>Combat Intent: ${gameState.combatPower}</li>
        <li>Current Age: ${gameState.age} Years</li>
        <li>Lifespan Limit: ${gameState.maxAge} Years</li>
        <li>Breakthrough Chance: ${chance}%</li>
        <li>Qi Velocity: +${10 + (gameState.realmIndex * 5)}/yr</li>
    `;
}

// --- GAME ACTIONS ---
function meditate() {
    if (isGameOver()) return;
    let gain = 10 + (gameState.realmIndex * 5);
    gameState.qi = Math.min(gameState.maxQi, gameState.qi + gain);
    gameState.age += 1;
    writeToLog(`You spend a year in secluded meditation. (+${gain} Qi)`);
    updateUI();
}

function explore() {
    if (isGameOver()) return;
    gameState.age += 2;
    let roll = Math.random();
    if (roll > 0.8) {
        triggerCombat();
    } else if (roll > 0.4) {
        let boost = Math.floor(Math.random() * 20) + 10;
        gameState.maxQi += boost;
        writeToLog(`You find a relic of a past era. Your potential expands. (+${boost} Max Qi)`);
    } else {
        writeToLog("You wander the world's edge. Time slips through your fingers like sand.");
    }
    updateUI();
}

function breakthrough() {
    if (isGameOver()) return;
    if (gameState.qi < gameState.maxQi) {
        writeToLog("Your foundation is insufficient for a breakthrough.", "system");
        return;
    }

    let chance = realms[gameState.realmIndex].success;
    if (Math.random() < chance) {
        gameState.realmIndex++;
        let next = realms[gameState.realmIndex];
        gameState.realm = next.name;
        gameState.maxAge = next.ageLimit;
        gameState.combatPower *= 2.5;
        gameState.qi = 0;
        gameState.maxQi *= 1.8;
        writeToLog(`SUCCESS! You have ascended to ${gameState.realm}. Your life is extended.`, "system");
    } else {
        gameState.qi = Math.floor(gameState.qi * 0.5);
        writeToLog("The breakthrough fails. Your meridians suffer heavy damage.", "system");
    }
    updateUI();
}

// --- CORE SYSTEMS ---
function triggerCombat() {
    let enemyStr = (gameState.realmIndex + 1) * 20;
    let roll = Math.floor(Math.random() * enemyStr);
    writeToLog(`A rival disciple challenges you! (Rival Power: ${roll})`, "system");
    if (gameState.combatPower >= roll) {
        gameState.combatPower += 5;
        writeToLog("You claim victory. Your combat intent sharpens.");
    } else {
        die("Slain in battle. Your soul dissipates into the wind.");
    }
}

function isGameOver() {
    if (gameState.isDead) return true;
    if (gameState.age >= gameState.maxAge) {
        die("Your lifespan has reached its natural end.");
        return true;
    }
    return false;
}

function die(reason) {
    gameState.isDead = true;
    writeToLog(`DEATH: ${reason}`, "system");
    document.getElementById('realm-display').innerText = "Deceased";
    document.getElementById('realm-display').style.color = "var(--karma-red)";
    // Disable buttons
    document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
}

function updateUI() {
    document.getElementById('realm-display').innerText = gameState.realm;
    document.getElementById('qi-count').innerText = `${Math.floor(gameState.qi)} / ${Math.floor(gameState.maxQi)}`;
    document.getElementById('age-count').innerText = `${gameState.age} / ${gameState.maxAge} Years`;
    document.getElementById('qi-fill').style.width = `${(gameState.qi / gameState.maxQi) * 100}%`;
    document.getElementById('age-fill').style.width = `${(gameState.age / gameState.maxAge) * 100}%`;
}

function writeToLog(text, type = "") {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerText = `[Age ${gameState.age}] ${text}`;
    const log = document.getElementById('log-container');
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

updateUI();