// --- MARTIAL STATE ---
let gameState = {
    started: false,
    qi: 0,
    maxQi: 100,
    realm: "Mortal Coil",
    realmIndex: 0,
    age: 0,
    maxAge: 70,
    combatPower: 5,
    gold: 0,
    spiritRoot: "Unawakened",
    lineage: "None",
    isDead: false
};

const realms = [
    { name: "Tempering Body", ageLimit: 75, success: 0.8 },
    { name: "Initial Element", ageLimit: 120, success: 0.6 },
    { name: "Gas Transforming", ageLimit: 200, success: 0.45 },
    { name: "Separation and Reunion", ageLimit: 400, success: 0.3 },
    { name: "True Element", ageLimit: 800, success: 0.2 },
    { name: "Immortal Ascension", ageLimit: 2000, success: 0.1 }
];

const YEAR_DURATION = 5 * 60 * 1000; // 5 Minutes
let timeToNextYear = YEAR_DURATION;

// --- INITIALIZATION ---
window.onload = () => {
    startBirthSequence();
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function startBirthSequence() {
    const log = document.getElementById('log-container');
    log.innerHTML = "";
    
    writeToLog("The wheel of reincarnation spins...", "system");
    await delay(1500);

    // Roll for Lineage
    const lineageRoll = Math.random();
    if (lineageRoll > 0.92) {
        gameState.lineage = "Imperial Kin";
        gameState.gold = 1000;
        gameState.maxAge = 95;
        writeToLog("A golden dragon marks the sky. You are born into the Imperial Family.");
    } else if (lineageRoll > 0.65) {
        gameState.lineage = "Merchant House";
        gameState.gold = 400;
        gameState.maxAge = 80;
        writeToLog("You are born amidst the scent of incense and spirit stones.");
    } else if (lineageRoll > 0.25) {
        gameState.lineage = "Commoner";
        gameState.combatPower += 15;
        gameState.maxAge = 70;
        writeToLog("You are born in a frontier village. Strength is your only wealth.");
    } else {
        gameState.lineage = "Foundling";
        gameState.maxQi = 200;
        gameState.maxAge = 65;
        writeToLog("Left in a basket at a sect's gates. Your bloodline is a mystery.");
    }

    await delay(2000);

    // Roll for Spirit Root
    const rootRoll = Math.random();
    if (rootRoll > 0.96) {
        gameState.spiritRoot = "Heavenly Saint Root";
        gameState.maxQi += 150;
        writeToLog("The Sect Elders tremble. You possess a Heavenly Saint Root!", "system");
    } else if (rootRoll > 0.75) {
        gameState.spiritRoot = "Earthly Grade Root";
        gameState.maxQi += 50;
        writeToLog("You display an exceptional affinity for the world's Yuan Qi.");
    } else {
        gameState.spiritRoot = "Mortal Grade Root";
        writeToLog("Your talent is ordinary, but your resolve is not.");
    }

    await delay(2500);
    beginAscension();
}

function beginAscension() {
    gameState.started = true;
    gameState.age = 14; 
    document.getElementById('action-bar').style.display = 'flex';
    writeToLog("Fourteen years of growth pass in a breath. Your journey begins.", "system");
    updateUI();
    startWorldClock();
}

// --- CLOCK SYSTEM ---
function startWorldClock() {
    setInterval(() => {
        if (gameState.isDead) return;

        timeToNextYear -= 1000;

        if (timeToNextYear <= 0) {
            gameState.age += 1;
            timeToNextYear = YEAR_DURATION;
            writeToLog("Another year passes. The hourglass of mortality thins.", "system");
            
            if (gameState.age >= gameState.maxAge) {
                die("Your physical shell has withered. Reincarnation calls.");
            }
            updateUI();
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeToNextYear / 60000);
    const secs = Math.floor((timeToNextYear % 60000) / 1000);
    const display = document.getElementById('time-countdown');
    if (display) {
        display.innerText = `Cycle Ends In: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

// --- PLAYER ACTIONS ---
function meditate() {
    if (gameState.isDead) return;
    
    let gain = 12 + (gameState.realmIndex * 6);
    if (gameState.spiritRoot === "Heavenly Saint Root") gain += 15;
    
    gameState.qi = Math.min(gameState.maxQi, gameState.qi + gain);
    writeToLog(`You refine Yuan Qi within your dantian. (+${gain} Qi)`);
    updateUI();
}

function explore() {
    if (gameState.isDead) return;
    
    let roll = Math.random();
    if (roll > 0.88) {
        triggerCombat();
    } else if (roll > 0.5) {
        let treasure = Math.floor(Math.random() * 25) + 5;
        gameState.gold += treasure;
        writeToLog(`You discover a hidden spirit-vein fragment. (+${treasure} Gold)`);
    } else {
        writeToLog("You traverse the treacherous mountain passes, seeking destiny.");
    }
    updateUI();
}

function breakthrough() {
    if (gameState.isDead) return;
    
    if (gameState.qi < gameState.maxQi) {
        writeToLog("Your foundation is insufficient. Attempting this would be suicide.", "system");
        return;
    }

    let chance = realms[gameState.realmIndex].success;
    if (Math.random() < chance) {
        gameState.realmIndex++;
        let next = realms[gameState.realmIndex];
        gameState.realm = next.name;
        gameState.maxAge = next.ageLimit;
        gameState.combatPower = Math.floor(gameState.combatPower * 2.2);
        gameState.qi = 0;
        gameState.maxQi = Math.floor(gameState.maxQi * 1.6);
        writeToLog(`SUCCESS! You have ascended to the ${gameState.realm} realm.`, "system");
    } else {
        gameState.qi = Math.floor(gameState.qi * 0.4);
        writeToLog("Failure! The energy backlash burns your meridians.", "system");
    }
    updateUI();
}

// --- MECHANICS ---
function triggerCombat() {
    let enemyStr = (gameState.realmIndex + 1) * 22;
    let roll = Math.floor(Math.random() * enemyStr) + 5;
    
    writeToLog(`A rival disciple challenges your progress! (Threat: ${roll})`, "system");
    
    if (gameState.combatPower >= roll) {
        gameState.combatPower += 8;
        writeToLog("Victory! You seize their resources and sharpen your battle heart.");
    } else {
        die("Slain in a duel. Your path to the Martial Peak ends in blood.");
    }
}

function die(reason) {
    gameState.isDead = true;
    writeToLog(`DEATH: ${reason}`, "system");
    document.getElementById('realm-display').innerText = "Fallen Disciple";
    document.getElementById('realm-display').style.color = "var(--karma-red)";
    document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = true);
    updateUI();
}

// --- UI UPDATES ---
function updateUI() {
    const realmDisplay = document.getElementById('realm-display');
    if (!gameState.isDead) realmDisplay.innerText = gameState.realm;
    
    document.getElementById('qi-count').innerText = `${Math.floor(gameState.qi)} / ${Math.floor(gameState.maxQi)}`;
    document.getElementById('age-count').innerText = `${gameState.age} / ${gameState.maxAge} Years`;
    
    document.getElementById('qi-fill').style.width = `${(gameState.qi / gameState.maxQi) * 100}%`;
    
    const agePercent = (gameState.age / gameState.maxAge) * 100;
    const ageFill = document.getElementById('age-fill');
    ageFill.style.width = `${agePercent}%`;

    // Visual warning for old age
    if (gameState.maxAge - gameState.age <= 5) {
        ageFill.style.background = "var(--karma-red)";
        ageFill.style.boxShadow = "0 0 10px var(--karma-red)";
    }
}

function writeToLog(text, type = "") {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    let icon = "";
    if (type === "system") icon = '<i class="ph ph-sparkle" style="margin-right: 8px;"></i>';
    if (text.includes("Victory")) icon = '<i class="ph ph-sword" style="color: var(--gold); margin-right: 8px;"></i>';
    if (text.includes("DEATH")) icon = '<i class="ph ph-skull" style="color: var(--karma-red); margin-right: 8px;"></i>';

    entry.innerHTML = `<span class="age-tag">Year ${gameState.age}</span> ${icon}${text}`;
    
    const log = document.getElementById('log-container');
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    const open = menu.style.right === "0px";
    
    menu.style.right = open ? "-450px" : "0px";
    overlay.style.display = open ? "none" : "block";
    
    if (!open) {
        document.getElementById('extra-stats').innerHTML = `
            <li><i class="ph ph-dna"></i> <span>Origin:</span> ${gameState.lineage}</li>
            <li><i class="ph ph-leaf"></i> <span>Spirit Root:</span> ${gameState.spiritRoot}</li>
            <li><i class="ph ph-coins"></i> <span>Wealth:</span> ${gameState.gold} Gold</li>
            <li><i class="ph ph-shield-checkered"></i> <span>Combat Power:</span> ${gameState.combatPower}</li>
            <li><i class="ph ph-chart-line-up"></i> <span>Success Rate:</span> ${(realms[gameState.realmIndex].success * 100).toFixed(0)}%</li>
        `;
    }
}