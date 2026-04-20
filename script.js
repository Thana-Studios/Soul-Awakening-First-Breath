const realms = [
    { name: "Mortal", req: 20, chance: 1.0 },
    { name: "Qi Condensation", req: 100, chance: 0.7 },
    { name: "Foundation Establishment", req: 500, chance: 0.5 },
    { name: "Core Formation", req: 2500, chance: 0.3 }
];

const spiritRoots = [
    { name: "Mortal Root", multi: 1.0, color: "#aaa" },
    { name: "Earth Root", multi: 2.0, color: "#8b4513" },
    { name: "Heavenly Root", multi: 5.0, color: "#ffd700" },
    { name: "Primordial Root", multi: 12.0, color: "#00ffcc" }
];

const exploreEvents = [
    { msg: "You find a patch of Spirit Grass.", qi: 15 },
    { msg: "A gentle spiritual breeze clears your mind.", qi: 5 },
    { msg: "You encounter a minor rift. You lose some Qi stabilizing it.", qi: -10 },
    { msg: "You meditate under a waterfall of pure energy.", qi: 25 }
];

let player = {
    root: null,
    realmIndex: 0,
    qi: 0,
    isAwake: false
};

const SAVE_KEY = "soul_awakening_v1";

// --- CORE FUNCTIONS ---

function writeLog(text, className = "") {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${className}`;
    entry.innerHTML = text;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function updateUI() {
    if (player.root) {
        document.getElementById('p-root').innerText = player.root.name;
        document.getElementById('p-root').style.color = player.root.color;
    }
    document.getElementById('p-realm').innerText = realms[player.realmIndex].name;
    document.getElementById('p-qi').innerText = Math.floor(player.qi);

    document.getElementById('btn-awaken').style.display = player.isAwake ? "none" : "inline-block";
    document.getElementById('btn-cultivate').style.display = player.isAwake ? "inline-block" : "none";
    document.getElementById('btn-explore').style.display = player.isAwake ? "inline-block" : "none";
    
    const currentRealm = realms[player.realmIndex];
    const canBreak = player.qi >= currentRealm.req && player.realmIndex < realms.length - 1;
    document.getElementById('btn-breakthrough').style.display = canBreak ? "inline-block" : "none";
}

// --- GAME ACTIONS ---

function awaken() {
    const roll = Math.random();
    if (roll > 0.98) player.root = spiritRoots[3];
    else if (roll > 0.85) player.root = spiritRoots[2];
    else if (roll > 0.50) player.root = spiritRoots[1];
    else player.root = spiritRoots[0];

    player.isAwake = true;
    writeLog(`Awakened with <span style="color:${player.root.color}">${player.root.name}</span>.`, "breakthrough-msg");
    saveGame();
    updateUI();
}

function cultivate() {
    const gain = 2 * (player.root ? player.root.multi : 1);
    player.qi += gain;
    writeLog(`Qi gathered: +${gain}`, "system-msg");
    saveGame();
    updateUI();
}

function explore() {
    const ev = exploreEvents[Math.floor(Math.random() * exploreEvents.length)];
    player.qi = Math.max(0, player.qi + ev.qi);
    writeLog(`${ev.msg} (${ev.qi >= 0 ? '+' : ''}${ev.qi} Qi)`, "event-msg");
    saveGame();
    updateUI();
}

function breakthrough() {
    const current = realms[player.realmIndex];
    if (Math.random() <= current.chance) {
        player.realmIndex++;
        player.qi = 0;
        writeLog(`ASCENDED TO ${realms[player.realmIndex].name.toUpperCase()}!`, "breakthrough-msg");
    } else {
        player.qi = Math.floor(player.qi * 0.5);
        writeLog("Breakthrough failed. Qi dissipated.", "system-msg");
    }
    saveGame();
    updateUI();
}

// --- KARMA HASH SYSTEM ---

function saveGame() { localStorage.setItem(SAVE_KEY, JSON.stringify(player)); }

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        player = JSON.parse(saved);
        if(player.isAwake) writeLog("Soul re-synchronized with this vessel.", "system-msg");
    }
}

function resetGame() {
    if (confirm("Sever all karma?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

function exportKarma() {
    const hash = btoa(JSON.stringify(player));
    navigator.clipboard.writeText(hash).then(() => {
        alert("Karma Hash copied to clipboard!");
    });
}

function importKarma() {
    const hash = prompt("Input Karma Hash:");
    if (hash) {
        try {
            const data = JSON.parse(atob(hash));
            if (data && data.isAwake) {
                player = data;
                saveGame();
                updateUI();
                writeLog("Karma successfully imported.", "breakthrough-msg");
            }
        } catch (e) { alert("Invalid Hash."); }
    }
}

window.onload = () => { loadGame(); updateUI(); };
