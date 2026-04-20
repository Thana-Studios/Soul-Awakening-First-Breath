const realms = [
    { name: "Mortal", req: 20, chance: 1.0 },
    { name: "Qi Condensation", req: 100, chance: 0.7 },
    { name: "Foundation Establishment", req: 500, chance: 0.5 }
];

const spiritRoots = [
    { name: "Mortal Root", multi: 1.0, color: "#aaa" },
    { name: "Earth Root", multi: 2.0, color: "#8b4513" },
    { name: "Heavenly Root", multi: 5.0, color: "#ffd700" },
    { name: "Primordial Root", multi: 12.0, color: "#00ffcc" }
];

let player = {
    root: null,
    realmIndex: 0,
    qi: 0,
    isAwake: false
};

const SAVE_KEY = "soul_awakening_v1";

function writeLog(text, className = "") {
    const log = document.getElementById('log');
    if (!log) return;
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
    
    const current = realms[player.realmIndex];
    const canBreak = player.qi >= current.req && player.realmIndex < realms.length - 1;
    document.getElementById('btn-breakthrough').style.display = canBreak ? "inline-block" : "none";
}

function awaken() {
    const roll = Math.random();
    if (roll > 0.98) player.root = spiritRoots[3];
    else if (roll > 0.85) player.root = spiritRoots[2];
    else if (roll > 0.50) player.root = spiritRoots[1];
    else player.root = spiritRoots[0];

    player.isAwake = true;
    writeLog(`Soul Anchor successful. You possess the <span style="color:${player.root.color}">${player.root.name}</span>.`, "breakthrough-msg");
    saveGame();
    updateUI();
}

function cultivate() {
    const gain = 2 * (player.root ? player.root.multi : 1);
    player.qi += gain;
    writeLog(`Qi +${gain}`, "system-msg");
    saveGame();
    updateUI();
}

function explore() {
    player.qi += 10;
    writeLog("You wander the local spirit woods. (+10 Qi)", "event-msg");
    saveGame();
    updateUI();
}

function breakthrough() {
    const current = realms[player.realmIndex];
    if (Math.random() <= current.chance) {
        player.realmIndex++;
        player.qi = 0;
        writeLog("Ascension Success!", "breakthrough-msg");
    } else {
        player.qi = Math.floor(player.qi * 0.5);
        writeLog("Ascension Failed.", "system-msg");
    }
    saveGame();
    updateUI();
}

function saveGame() { localStorage.setItem(SAVE_KEY, JSON.stringify(player)); }

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        if (data && data.isAwake) {
            player = data;
            writeLog("Soul re-synchronized.", "system-msg");
        }
    }
}

function resetGame() {
    if (confirm("Reset Karma?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

function exportKarma() {
    const hash = btoa(JSON.stringify(player));
    alert("Copy this Hash: " + hash);
}

function importKarma() {
    const hash = prompt("Paste Hash:");
    if (hash) {
        player = JSON.parse(atob(hash));
        saveGame();
        updateUI();
    }
}

// Initial Boot
loadGame();
updateUI();