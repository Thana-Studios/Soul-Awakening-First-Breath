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
