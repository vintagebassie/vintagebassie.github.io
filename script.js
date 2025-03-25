const container = document.getElementById('container');
const zoneViewer = document.getElementById('zoneViewer');
const zoneFrame = document.getElementById('zoneFrame');
const searchBar = document.getElementById('searchBar');
const zonesURL = "https://cdn.jsdelivr.net/gh/gn-math/assets/zones.json";
const assetURL = "https://cdn.jsdelivr.net/gh/gn-math/assets";
let zones = [];
async function listZones() {
    try {
        const response = await fetch(zonesURL+"?="+Date.now());
        const json = await response.json();
        zones = json.sort((a, b) => a.name.localeCompare(b.name));
        displayZones(zones);
        const search = new URLSearchParams(window.location.search);
        const id = search.get('id');
        if (id) {
            const zone = zones.find(zone => zone.id+'' == id+'');
            if (zone) {
                openZone(zone);
            }
        }
    } catch (error) {
        container.innerHTML = `Error loading zones: ${error}`;
    }
}

function displayZones(zones) {
    container.innerHTML = "";
    zones.forEach(file => {
        const zoneItem = document.createElement("div");
        zoneItem.className = "zone-item";
        zoneItem.onclick = () => openZone(file);
        const img = document.createElement("img");
        img.src = file.cover.replace("{ASSET_URL}", assetURL);
        zoneItem.appendChild(img);
        const button = document.createElement("button");
        button.textContent = file.name;
        button.onclick = (event) => {
            event.stopPropagation();
            openZone(file);
        };
        zoneItem.appendChild(button);
        container.appendChild(zoneItem);
    });
    if (container.innerHTML === "") {
        container.innerHTML = "No zones found.";
    }
}

function filterZones() {
    const query = searchBar.value.toLowerCase();
    const filteredZones = zones.filter(zone => zone.name.toLowerCase().includes(query));
    displayZones(filteredZones);
}

function openZone(file) {
    const url = file.url.replace("{ASSET_URL}", assetURL);
    fetch(url).then(response => response.text()).then(html => {
        zoneFrame.contentDocument.open();
        zoneFrame.contentDocument.write(html);
        zoneFrame.contentDocument.close();
        document.getElementById('zoneName').textContent = file.name;
        document.getElementById('zoneId').textContent = file.id;
        zoneViewer.style.display = "block";
    }).catch(error => alert("Failed to load zone: " + error));
}

function aboutBlank() {
    const newWindow = window.open("about:blank", "_blank");
    let zone = zones.find(zone => zone.id+'' === document.getElementById('zoneId').textContent).url.replace("{ASSET_URL}", assetURL);
    fetch(zone).then(response => response.text()).then(html => {
        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(html);
            newWindow.document.close();
        }
    })
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
