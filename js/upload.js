document.getElementById('saveFiles').onclick = function() {
    const formData = new FormData(document.getElementById('uploadForm'));
    const xhr = new XMLHttpRequest();

    const startTime = new Date().getTime();
    
    xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            const loadedMB = (e.loaded / (1024 * 1024)).toFixed(2);
            const totalMB = (e.total / (1024 * 1024)).toFixed(2);
            const currentTime = new Date().getTime();
            const duration = (currentTime - startTime) / 1000;
            const speedMbit = ((e.loaded * 8 / (1024 * 1024)) / duration).toFixed(2);

            const uploadStatus = document.getElementById('uploadStatus');
            uploadStatus.innerHTML = `
                <strong>Upload:</strong><br>
                ${percentComplete}% von 100% bei ${speedMbit} Mbit/s von <strong>${totalMB} MB</strong><br>
            `;
        }
    });

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.message) {
                    $('#uploadModal').modal('hide');
                    updateModelList();
                } else {
                    alert('Fehler: ' + response.message);
                }
            } else {
                alert('Unerwartetes Server-Verhalten');
            }
            document.getElementById('uploadStatus').innerHTML = '';
        }
    };

    xhr.open('POST', 'upload.php', true);
    xhr.send(formData);
};
