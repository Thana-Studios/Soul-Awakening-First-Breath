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

const YEAR_DURATION = 5 * 60 * 1000;
let timeToNextYear = YEAR_DURATION;

window.onload = () => {
    startBirthSequence();
};

async function startBirthSequence() {
    const log = document.getElementById('log-container');
    log.innerHTML = "";
    writeToLog("The wheel of reincarnation spins...", "system");
    await new Promise(r => setTimeout(r, 1500));

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

    await new Promise(r => setTimeout(r, 2000));

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

    await new Promise(r => setTimeout(r, 2000));
    beginAscension();
}

function beginAscension() {
    gameState.started = true;
    gameState.age = 14;
    document.getElementById('action-bar').style.display = 'flex';
    writeToLog("Fourteen years pass in a breath. Your journey begins.", "system");
    updateUI();
    startWorldClock();
}

function startWorldClock() {
    setInterval(() => {
        if (gameState.isDead) return;
        timeToNextYear -= 1000;
        if (timeToNextYear <= 0) {
            gameState.age++;
            timeToNextYear = YEAR_DURATION;
            if (gameState.age >= gameState.maxAge) die("Time has claimed your mortal shell.");
            updateUI();
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeToNextYear / 60000);
    const secs = Math.floor((timeToNextYear % 60000) / 1000);
    document.getElementById('time-countdown').innerText = `Cycle Ends: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function meditate() {
    if (gameState.isDead) return;
    let gain = 10 + (gameState.realmIndex * 5);
    if (gameState.spiritRoot === "Heavenly Saint Root") gain += 15;
    gameState.qi = Math.min(gameState.maxQi, gameState.qi + gain);
    writeToLog(`You refine Yuan Qi within your dantian. (+${gain} Qi)`);
    updateUI();
}

function explore() {
    if (gameState.isDead) return;
    let roll = Math.random();
    if (roll > 0.85) triggerCombat();
    else if (roll > 0.5) {
        let treasure = Math.floor(Math.random() * 20) + 5;
        gameState.gold += treasure;
        writeToLog(`You found a fragment of a Spirit Stone. (+${treasure} Gold)`);
    } else writeToLog("You wander the sect mountains, observing the Great Dao.");
    updateUI();
}

function breakthrough() {
    if (gameState.isDead) return;
    if (gameState.qi < gameState.maxQi) {
        writeToLog("Your foundation is insufficient for ascension.", "system");
        return;
    }
    let chance = realms[gameState.realmIndex].success;
    if (Math.random() < chance) {
        gameState.realmIndex++;
        gameState.realm = realms[gameState.realmIndex].name;
        gameState.maxAge = realms[gameState.realmIndex].ageLimit;
        gameState.combatPower *= 2.2;
        gameState.qi = 0;
        gameState.maxQi *= 1.5;
        writeToLog(`Ascension Success! You reached the ${gameState.realm} stage.`, "system");
    } else {
        gameState.qi = Math.floor(gameState.qi * 0.4);
        writeToLog("Breakthrough Failed! The energy backlash burns your meridians.", "system");
    }
    updateUI();
}

function triggerCombat() {
    let enemyStr = (gameState.realmIndex + 1) * 22;
    let roll = Math.floor(Math.random() * enemyStr);
    writeToLog("A rival cultivator challenges your luck!", "system");
    if (gameState.combatPower >= roll) {
        gameState.combatPower += 6;
        writeToLog("Victory! Your battle intent sharpens.");
    } else die("Slain in a duel. Your path ends in blood.");
}

function die(reason) {
    gameState.isDead = true;
    writeToLog(`DEATH: ${reason}`, "system");
    document.getElementById('realm-display').innerText = "Deceased";
    document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
    updateUI();
}

function updateUI() {
    if (!gameState.isDead) document.getElementById('realm-display').innerText = gameState.realm;
    document.getElementById('qi-count').innerText = `${Math.floor(gameState.qi)} / ${Math.floor(gameState.maxQi)}`;
    document.getElementById('age-count').innerText = `${gameState.age} / ${gameState.maxAge}`;
    document.getElementById('qi-fill').style.width = `${(gameState.qi / gameState.maxQi) * 100}%`;
    
    const agePercent = (gameState.age / gameState.maxAge) * 100;
    const ageFill = document.getElementById('age-fill');
    ageFill.style.width = `${agePercent}%`;
    if (gameState.maxAge - gameState.age <= 5) ageFill.style.background = "var(--karma-red)";
}

function writeToLog(text, type = "") {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    let icon = "";
    if (type === "system") icon = '<i class="ph ph-sparkle"></i> ';
    if (text.includes("Victory")) icon = '<i class="ph ph-sword gold-text"></i> ';
    if (text.includes("DEATH")) icon = '<i class="ph ph-skull text-red"></i> ';
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
            <li><i class="ph ph-coins"></i> <span>Gold:</span> ${gameState.gold}</li>
            <li><i class="ph ph-shield"></i> <span>Combat:</span> ${Math.floor(gameState.combatPower)}</li>
        `;
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