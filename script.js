const container = document.getElementById('container');
const zoneViewer = document.getElementById('zoneViewer');
const zoneFrame = document.getElementById('zoneFrame');
const zonesURL = "https://cdn.jsdelivr.net/gh/gn-math/gn-math.github.io@main/zones.json";
const assetURL = "https://cdn.jsdelivr.net/gh/gn-math/assets@main";

async function listZones() {
    try {
        const response = await fetch(zonesURL);
        const json = await response.json();
        container.innerHTML = "";
        json.forEach(file => {
            const zoneItem = document.createElement("div");
            zoneItem.className = "zone-item";

            const img = document.createElement("img");
            img.src = file.cover.replace("{ASSET_URL}", assetURL);
            zoneItem.appendChild(img);

            const button = document.createElement("button");
            button.textContent = file.name;
            button.onclick = () => openZone(file.url.replace("{ASSET_URL}", assetURL));
            zoneItem.appendChild(button);
            
            container.appendChild(zoneItem);
        });
        if (container.innerHTML === "") {
            container.innerHTML = "No zones found.";
        }
    } catch (error) {
        container.innerHTML = `Error loading zones: ${error}`;
    }
}

function openZone(url) {
    fetch(url).then(response => response.text()).then(html => {
        zoneFrame.contentDocument.open();
        zoneFrame.contentDocument.write(html);
        zoneFrame.contentDocument.close();
        zoneViewer.style.display = "block";
    }).catch(error => alert("Failed to load zone: " + error));
}

function closeZone() {
    zoneViewer.style.display = "none";
    zoneFrame.src = "about:blank";
}

function fullscreenZone() {
    if (zoneFrame.requestFullscreen) {
        zoneFrame.requestFullscreen();
    } else if (zoneFrame.mozRequestFullScreen) {
        zoneFrame.mozRequestFullScreen();
    } else if (zoneFrame.webkitRequestFullscreen) {
        zoneFrame.webkitRequestFullscreen();
    } else if (zoneFrame.msRequestFullscreen) {
        zoneFrame.msRequestFullscreen();
    }
}
listZones();