function updateModelList() {
    fetch('list_models.php')
        .then(response => response.json())
        .then(data => {
            const modelList = document.getElementById('modelList');
            modelList.innerHTML = '';

            if (data.length > 0) {
                data.forEach(model => {
                    const modelItem = document.createElement('div');
                    modelItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center bg-light p-1 border-bottom">
                            <button style="color: #ad007c; font-size:14px;" class="btn btn-link px-1 py-0" onclick="loadModel('${model.glb}', '${model.webp}')">${model.name}</button>
                            <button class="btn btn-secondary btn-sm" onclick="confirmDelete('${model.glb}', '${model.webp}')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    `;
                    modelList.appendChild(modelItem);
                });
            } else {
                modelList.innerHTML = '<p>Keine Modelle gefunden.</p>';
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden der Modelle:', error);
        });
}

function confirmDelete(glbFile, webpFile) {
    if (confirm(`Möchten Sie das Modell ${glbFile} wirklich löschen?`)) {
        deleteFiles(glbFile, webpFile);
    }
}

function deleteFiles(glbFile, webpFile) {
    const formData = new FormData();
    formData.append('glb', glbFile);
    formData.append('webp', webpFile);

    fetch('delete.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        updateModelList();
    })
    .catch(error => {
        console.error('Fehler beim Löschen der Dateien:', error);
    });
}

function loadModel(glbFile, webpFile) {
    document.getElementById('modelViewerContainer').innerHTML = `
        <model-viewer id="modelViewer" style="width: 500px; height: 500px;" 
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

    document.getElementById('rotateCheckbox').addEventListener('change', function() {
        const modelViewer = document.getElementById('modelViewer');
        if (this.checked) {
            modelViewer.setAttribute('auto-rotate', '');
        } else {
            modelViewer.removeAttribute('auto-rotate');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateModelList();
});
