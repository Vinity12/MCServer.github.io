const serverAddress = "147.185.221.29:38073";
const nextPingTimer = document.getElementById("timer");

function fetchServerStatus() {
    fetch(`https://api.mcsrvstat.us/bedrock/3/${serverAddress}`)
        .then(response => response.json())
        .then(data => {
            const statusEl = document.getElementById("status");
            const playersEl = document.getElementById("players");

            if (data.online) {
                statusEl.textContent = "Online";
                statusEl.className = "online";
                playersEl.textContent = `${data.players?.online ?? 0} / ${data.players?.max ?? 0}`;
            } else {
                statusEl.textContent = "Offline";
                statusEl.className = "offline";
                playersEl.textContent = "-";
            }

            const debug = data.debug || {};
            const expireTimestamp = debug.cacheexpire ? debug.cacheexpire : (debug.cachetime + 300);
            const expireDate = new Date(expireTimestamp * 1000);

            if (window.pingInterval) clearInterval(window.pingInterval);
            
            window.pingInterval = setInterval(() => runTimer(expireDate), 1000);
            runTimer(expireDate);
        })
        .catch(error => {
            document.getElementById("status").textContent = "Error fetching status";
            console.error(error);
        });
}

function debug() {}

function runTimer(expireDate) {
    const now = new Date();
    const timeRemainingMs = expireDate.getTime() - now.getTime();

    if (timeRemainingMs <= 0) {
        nextPingTimer.textContent = "Refreshing...";
        clearInterval(window.pingInterval);
        fetchServerStatus();
    } else {
        const totalSeconds = Math.floor(timeRemainingMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        const formattedSeconds = seconds.toString().padStart(2, "0");
        nextPingTimer.textContent = `${minutes}:${formattedSeconds}`;
    }
}

function randomizeBackground() {
    var images = [
        "Images/Aurora_Borealis.png", 
        "Images/Bridge.png", 
        "Images/Night_Moon.png", 
        "Images/Ocean_Sun.png", 
        "Images/Sunset.png", 
        "Images/Water.png",
        "Images/Blackhole.png"
    ];

    const parent = document.getElementById("body");
    parent.style.backgroundImage = "url(" + images[Math.floor(Math.random() * images.length)] + ")";
}

function copyToClipboard(id) {
    const item = document.getElementById(id);
    const info = document.getElementById("clickInfo");
    info.textContent = "Copied!";

    navigator.clipboard.writeText(item.textContent);

    const timeout = setTimeout(() => info.textContent = "Click to copy to clipboard", 3000);
}

randomizeBackground();
fetchServerStatus();