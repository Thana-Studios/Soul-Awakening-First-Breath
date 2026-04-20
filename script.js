// --- INITIAL STATE ---
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

// --- TIME CONFIGURATION (5 Minute Years) ---
const YEAR_DURATION = 5 * 60 * 1000; 
let timeToNextYear = YEAR_DURATION;

// --- TICK LOGIC ---
function startWorldClock() {
    setInterval(() => {
        if (gameState.isDead) return;

        timeToNextYear -= 1000;

        if (timeToNextYear <= 0) {
            gameState.age += 1;
            timeToNextYear = YEAR_DURATION;
            writeToLog("The seasons turn. A year of your life has passed into the void.", "system");
            
            if (gameState.age >= gameState.maxAge) {
                die("Time has claimed your soul. You fade into the cycle of reincarnation.");
            }
            updateUI();
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeToNextYear / 60000);
    const seconds = Math.floor((timeToNextYear % 60000) / 1000);
    const display = document.getElementById('time-countdown');
    if (display) {
        display.innerText = `Next Year In: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// --- GAME ACTIONS ---
function meditate() {
    if (gameState.isDead) return;
    let gain = 10 + (gameState.realmIndex * 5);
    gameState.qi = Math.min(gameState.maxQi, gameState.qi + gain);
    writeToLog(`You focus your intent, refining the ambient Qi. (+${gain} Qi)`);
    updateUI();
}

function explore() {
    if (gameState.isDead) return;
    let roll = Math.random();
    if (roll > 0.85) {
        triggerCombat();
    } else if (roll > 0.5) {
        let boost = Math.floor(Math.random() * 15) + 5;
        gameState.maxQi += boost;
        writeToLog(`You find a spirit-vein node. Your capacity grows. (+${boost} Max Qi)`);
    } else {
        writeToLog("You scout the local sect lands, observing the flow of nature.");
    }
    updateUI();
}

function breakthrough() {
    if (gameState.isDead) return;
    if (gameState.qi < gameState.maxQi) {
        writeToLog("Your Qi reservoir is not yet full enough to force a breakthrough.", "system");
        return;
    }

    let chance = realms[gameState.realmIndex].success;
    if (Math.random() < chance) {
        gameState.realmIndex++;
        let next = realms[gameState.realmIndex];
        gameState.realm = next.name;
        gameState.maxAge = next.ageLimit;
        gameState.combatPower *= 2;
        gameState.qi = 0;
        gameState.maxQi *= 1.5;
        writeToLog(`SUCCESS! You have ascended to ${gameState.realm}. Your life is extended.`, "system");
    } else {
        gameState.qi = Math.floor(gameState.qi * 0.4);
        writeToLog("The breakthrough fails. The backlash drains your energy.", "system");
    }
    updateUI();
}

// --- SYSTEMS ---
function triggerCombat() {
    let enemyStr = (gameState.realmIndex + 1) * 15;
    let roll = Math.floor(Math.random() * enemyStr);
    writeToLog(`A rival challenges your progress! (Enemy Strength: ${roll})`, "system");
    if (gameState.combatPower >= roll) {
        gameState.combatPower += 4;
        writeToLog("You prevail. Your combat experience sharpens.");
    } else {
        die("You were defeated in a life-and-death struggle.");
    }
}

function die(reason) {
    gameState.isDead = true;
    writeToLog(`DEATH: ${reason}`, "system");
    document.getElementById('realm-display').innerText = "Deceased";
    document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = true);
    updateUI();
}

// --- UI & MENU ---
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    const isOpen = menu.style.right === "0px";
    menu.style.right = isOpen ? "-400px" : "0px";
    overlay.style.display = isOpen ? "none" : "block";
    if (!isOpen) updateMenuContent();
}

function updateMenuContent() {
    const statsList = document.getElementById('extra-stats');
    statsList.innerHTML = `
        <li>Combat Intent: ${gameState.combatPower}</li>
        <li>Breakthrough Chance: ${(realms[gameState.realmIndex].success * 100).toFixed(0)}%</li>
        <li>Current Age: ${gameState.age}</li>
        <li>Max Lifespan: ${gameState.maxAge}</li>
    `;
}

function updateUI() {
    document.getElementById('realm-display').innerText = gameState.realm;
    document.getElementById('qi-count').innerText = `${Math.floor(gameState.qi)} / ${Math.floor(gameState.maxQi)}`;
    document.getElementById('age-count').innerText = `${gameState.age} / ${gameState.maxAge} Years`;
    
    document.getElementById('qi-fill').style.width = `${(gameState.qi / gameState.maxQi) * 100}%`;
    const agePercent = (gameState.age / gameState.maxAge) * 100;
    const ageFill = document.getElementById('age-fill');
    ageFill.style.width = `${agePercent}%`;
    
    if (gameState.maxAge - gameState.age <= 5) {
        ageFill.classList.add('low-life');
    }
}

function writeToLog(text, type = "") {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerText = `[Age ${gameState.age}] ${text}`;
    const log = document.getElementById('log-container');
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// Start
updateUI();
startWorldClock();