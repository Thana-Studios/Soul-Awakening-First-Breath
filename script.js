// Convert the player object to a string and save it to the browser
function saveGame() {
    localStorage.setItem("thana_soul_awakening_save", JSON.stringify(player));
    writeLog("Progress recorded in the heavenly scrolls (Game Saved).", "system-msg");
}

// Pull the string from the browser and turn it back into an object
function loadGame() {
    const savedData = localStorage.getItem("thana_soul_awakening_save");
    if (savedData) {
        player = JSON.parse(savedData);
        player.isAwake = true; // Ensure they skip the awakening screen
        writeLog("Your soul returns to its vessel. Welcome back.", "system-msg");
        updateUI();
    }
}

// Clear the data for a fresh start
function resetGame() {
    if (confirm("Are you sure you want to sever your karma? All progress will be lost.")) {
        localStorage.removeItem("thana_soul_awakening_save");
        location.reload(); // Refresh the page to start over
    }
}
// ==========================================
// KARMA HASH SYSTEM (PORTABLE SAVES)
// ==========================================

function exportKarma() {
    // Convert player object to string, then encode it to Base64
    const hash = btoa(JSON.stringify(player));
    
    // Prompt the user to copy the hash
    const tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = hash;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    
    alert("Your Karma Hash has been copied to your clipboard! Save this code to resume your journey on any device.");
}

function importKarma() {
    const hash = prompt("Paste your Karma Hash here to synchronize your soul:");
    if (hash) {
        try {
            // Decode the Base64 string and turn it back into an object
            const decodedData = JSON.parse(atob(hash));
            
            if (decodedData && decodedData.isAwake) {
                player = decodedData;
                saveGame(); // Save to localStorage so it persists here too
                writeLog("Karma synchronization complete. Your soul has successfully migrated.", "breakthrough-msg");
                updateUI();
            } else {
                alert("The Karma Hash appears to be corrupted.");
            }
        } catch (e) {
            alert("Invalid Karma Hash. The heavens cannot recognize this soul.");
        }
    }
}
