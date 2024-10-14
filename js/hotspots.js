let currentHotspot = null;  // Speichert die aktuelle Hotspot-Position
let hotspots = [];  // Liste aller Hotspots
let hotspotMode = false;  // Modus für das Setzen von Hotspots
let currentModel = null;  // Aktuell geladenes Modell

// Laden der Hotspots für ein Modell
function loadHotspotsForModel(modelName) {
    fetch(`hotspots/${modelName}_hotspots.json`)  // Holt die JSON-Datei mit dem _hotspots-Suffix
        .then(response => {
            if (response.ok) {
                return response.json();  // Wenn die Datei gefunden wurde, konvertiere sie zu JSON
            } else {
                return [];  // Wenn keine JSON-Datei existiert, leere Liste zurückgeben
            }
        })
        .then(loadedHotspots => {
            // Falls loadedHotspots kein Array ist, setze es auf ein leeres Array
            if (!Array.isArray(loadedHotspots)) {
                loadedHotspots = [];
            }

            hotspots = loadedHotspots;  // Setzt die geladenen Hotspots für das aktuelle Modell
            const hotspotList = document.getElementById('hotspotList');
            hotspotList.innerHTML = ''; // Liste leeren

            // Hotspots in der Liste und im Modell anzeigen
            loadedHotspots.forEach(hotspot => {
                addHotspotToList(hotspot);
                addHotspotToModel(hotspot);
            });
        })
        .catch(error => {
            console.error('Fehler beim Laden der Hotspots:', error);
        });
}

// Fügt den Hotspot visuell im Modell hinzu
function addHotspotToModel(hotspot) {
    const modelViewer = document.getElementById('modelViewer');

    const button = document.createElement('button');
    button.classList.add('hotspot');
    button.setAttribute('slot', `hotspot-${hotspot.label}`);
    button.setAttribute('data-position', `${hotspot.position.x} ${hotspot.position.y} ${hotspot.position.z}`);
    button.setAttribute('data-normal', `${hotspot.normal.x} ${hotspot.normal.y} ${hotspot.normal.z}`);
    button.innerHTML = `<div class="annotation">${hotspot.label}</div>`;

    modelViewer.appendChild(button);
}

// Fügt den Hotspot zur Hotspot-Liste hinzu
function addHotspotToList(hotspot) {
    const hotspotList = document.getElementById('hotspotList');

    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    listItem.innerHTML = `
        ${hotspot.label}
        <div>
            <button class="btn btn-secondary btn-sm editHotspot" data-label="${hotspot.label}"><i class="fa fa-pencil"></i></button>
            <button class="btn btn-danger btn-sm deleteHotspot" data-label="${hotspot.label}"><i class="fa fa-trash"></i></button>
        </div>
    `;

    hotspotList.appendChild(listItem);

    // Löschen-Funktion hinzufügen
    listItem.querySelector('.deleteHotspot').addEventListener('click', function() {
        const label = this.getAttribute('data-label');
        deleteHotspot(label);
    });

    // Bearbeiten-Funktion hinzufügen
    listItem.querySelector('.editHotspot').addEventListener('click', function() {
        const label = this.getAttribute('data-label');
        editHotspot(label);
    });
}

// Funktion zum Löschen eines Hotspots
function deleteHotspot(label) {
    const modelViewer = document.getElementById('modelViewer');

    // Entfernt den Hotspot aus dem Modell
    const hotspotButton = modelViewer.querySelector(`button[slot="hotspot-${label}"]`);
    if (hotspotButton) {
        modelViewer.removeChild(hotspotButton);
    }

    // Entfernt den Hotspot aus der Liste
    hotspots = hotspots.filter(h => h.label !== label);

    // Aktualisiert die Hotspot-Liste
    const hotspotList = document.getElementById('hotspotList');
    const listItem = hotspotList.querySelector(`.deleteHotspot[data-label="${label}"]`).parentElement.parentElement;
    hotspotList.removeChild(listItem);

    // Send request to server to delete the hotspot
    const formData = new FormData();
    formData.append('model_name', currentModel);
    formData.append('hotspot_label', label);

    fetch('delete_hotspot.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Fehler beim Löschen des Hotspots:', error);
    });

    // Speichert die aktualisierte Liste in der JSON-Datei
    saveHotspotsForModel(currentModel);
}


// Hotspots für das aktuelle Modell anzeigen, wenn ein neues Modell geladen wird
function loadModel(glbFile, webpFile) {
    currentModel = glbFile.replace('.glb', ''); // Modellname ohne Dateiendung

    document.getElementById('modelViewerContainer').innerHTML = `
        <model-viewer id="modelViewer" style="width: 700px; height: 700px;" 
        src="imports/${glbFile}" 
        ar 
        poster="imports/${webpFile}" 
        shadow-intensity="1" 
        camera-controls 
        touch-action="pan-y">
        </model-viewer>
    `;
    $('#modelsModal').modal('hide');
    document.getElementById('settingsColumn').style.display = 'block';

    // Hotspots für das aktuelle Modell laden
    loadHotspotsForModel(currentModel);

    // Event-Listener für die Hotspot-Erstellung wieder einbinden
    document.getElementById('rotateCheckbox').addEventListener('change', function() {
        const modelViewer = document.getElementById('modelViewer');
        if (this.checked) {
            modelViewer.setAttribute('auto-rotate', '');
        } else {
            modelViewer.removeAttribute('auto-rotate');
        }
    });
}

// Hotspot-Erstellungsmodus starten
document.getElementById('createHotspotButton').addEventListener('click', function() {
    const modelViewer = document.getElementById('modelViewer');
    if (!modelViewer) {
        alert('Lade zuerst ein Modell!');
        return;
    }

    // Hotspot-Modus aktivieren
    hotspotMode = true;
    alert('Klicke auf das Modell, um die Position für den Hotspot zu wählen.');

    // Füge den Click-Listener für das Modell hinzu
    modelViewer.addEventListener('click', handleModelClick);
});

// Hotspot-Erstellungsmodus beenden
function handleModelClick(event) {
    if (!hotspotMode) return;  // Beende, wenn nicht im Hotspot-Modus

    const modelViewer = document.getElementById('modelViewer');
    const intersects = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY);

    if (intersects) {
        const { position, normal } = intersects;

        currentHotspot = {
            position: position,
            normal: normal,
            label: ''
        };

        // Öffnet das Modal für die Label-Eingabe
        $('#hotspotModal').modal('show');

        // Hotspot-Modus beenden, um weitere Klicks zu verhindern
        hotspotMode = false;

        // Entferne den Click-Listener, nachdem der Hotspot erstellt wurde
        modelViewer.removeEventListener('click', handleModelClick);
    } else {
        alert('Klicke auf einen gültigen Bereich des Modells.');
    }
}

// Hotspot speichern und den Hotspot-Modus beenden
document.getElementById('saveHotspotBtn').addEventListener('click', function() {
    const labelInput = document.getElementById('hotspotLabel');
    const label = labelInput.value.trim();

    if (label === '') {
        alert('Bitte gib einen Namen für den Hotspot ein.');
        return;
    }

    currentHotspot.label = label;
    addHotspotToModel(currentHotspot);  // Fügt den Hotspot ins Modell ein
    addHotspotToList(currentHotspot);   // Fügt den Hotspot zur Liste hinzu

    // Sicherstellen, dass hotspots ein Array ist, bevor wir pushen
    if (!Array.isArray(hotspots)) {
        hotspots = [];
    }
    
    hotspots.push(currentHotspot);  // Speichert den Hotspot in der Liste

    // Modal schließen und Eingabefeld zurücksetzen
    $('#hotspotModal').modal('hide');
    labelInput.value = '';

    // Speichert die Hotspots für das aktuelle Modell
    saveHotspotsForModel(currentModel);

    alert('Hotspot gespeichert. Du kannst das Modell jetzt wieder normal bewegen.');
});

// Speichern der Hotspots für das aktuelle Modell
function saveHotspotsForModel(modelName) {
    const formData = new FormData();
    formData.append('model_name', modelName);
    formData.append('hotspots', JSON.stringify(hotspots));  // Alle Hotspots speichern

    fetch(`save_hotspots.php?file_name=${modelName}_hotspots`, {  // Speichern unter _hotspots.json
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Fehler beim Speichern der Hotspots:', error);
    });
}

