<?php
if (isset($_POST['model_name']) && isset($_POST['hotspots'])) {
    $modelName = $_POST['model_name'];
    $hotspots = $_POST['hotspots'];

    // Pfad zur Speicherung der Hotspots
    $filePath = "hotspots/{$modelName}_hotspots.json";

    // Speichern der Hotspots in der JSON-Datei
    file_put_contents($filePath, $hotspots);

    // Berechtigungen der Datei auf 755 setzen
    chmod($filePath, 0755);

    // echo json_encode(['message' => 'Hotspots erfolgreich gespeichert.']);
} else {
    echo json_encode(['message' => 'Ungültige Eingabedaten.']);
}
?>
