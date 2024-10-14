<?php
if (isset($_POST['model_name']) && isset($_POST['hotspot_label'])) {
    $modelName = $_POST['model_name'];
    $hotspotLabel = $_POST['hotspot_label'];

    // Pfad zur JSON-Datei des Modells
    $filePath = "hotspots/{$modelName}_hotspots.json";

    if (file_exists($filePath)) {
        // Hotspots aus der JSON-Datei laden
        $hotspots = json_decode(file_get_contents($filePath), true);

        // Hotspot mit dem gegebenen Label entfernen
        $updatedHotspots = array_filter($hotspots, function ($hotspot) use ($hotspotLabel) {
            return $hotspot['label'] !== $hotspotLabel;
        });

        // Aktualisierte Hotspots in der JSON-Datei speichern
        file_put_contents($filePath, json_encode(array_values($updatedHotspots)));

        echo json_encode(['message' => 'Hotspot erfolgreich gelöscht.']);
    } else {
        echo json_encode(['message' => 'Datei nicht gefunden.']);
    }
} else {
    echo json_encode(['message' => 'Ungültige Eingabedaten.']);
}
?>
