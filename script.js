const container = document.getElementById('container');
const zoneViewer = document.getElementById('zoneViewer');
const zoneFrame = document.getElementById('zoneFrame');
const searchBar = document.getElementById('searchBar');
const zonesURL = "zones.json";
const assetURL = "https://cdn.jsdelivr.net/gh/gn-math/assets@main";
let zones = [];
async function listZones() {
    try {
        const response = await fetch(zonesURL);
        const json = await response.json();
        zones = json.sort((a, b) => a.name.localeCompare(b.name));
        displayZones(zones);
    } catch (error) {
        container.innerHTML = `Error loading zones: ${error}`;
    }
}

function displayZones(zones) {
    container.innerHTML = "";
    zones.forEach(file => {
        const zoneItem = document.createElement("div");
        zoneItem.className = "zone-item";
        zoneItem.onclick = () => openZone(file.url.replace("{ASSET_URL}", assetURL));
        const img = document.createElement("img");
        img.src = file.cover.replace("{ASSET_URL}", assetURL);
        zoneItem.appendChild(img);
        const button = document.createElement("button");
        button.textContent = file.name;
        button.onclick = (event) => {
            event.stopPropagation();
            openZone(file.url.replace("{ASSET_URL}", assetURL));
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

function openZone(url) {
    fetch(url).then(response => response.text()).then(html => {
        zoneFrame.contentDocument.open();
        zoneFrame.contentDocument.write(html);
        zoneFrame.contentDocument.close();
        zoneViewer.style.display = "block";
    }).catch(error => alert("Failed to load zone: " + error));
}

function aboutBlank() {
    const newWindow = window.open("about:blank", "_blank");
    if (newWindow) {
        newWindow.document.open();
        const htmlContent = `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                </style>
            </head>
            <body>
                ${zoneFrame.contentDocument.documentElement.outerHTML}
            </body>
            </html>
        `;
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    } else {
        alert("Popup blocked! Allow popups and try again.");
    }
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
let search = new URLSearchParams(window.location.search);
if (search.get("id")) {
    let zone = zones.find(zone => zone.id === search.get("id"));
    openZone(zone.url.replace("{ASSET_URL}", assetURL));
}