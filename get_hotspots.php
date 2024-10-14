<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$target_dir = "hotspots/";
$model_name = $_GET['model_name']; // Name des Modells

$file_path = $target_dir . $model_name . '_hotspots.json';

if (file_exists($file_path)) {
    $hotspots = file_get_contents($file_path);
    $json_data = json_decode($hotspots, true);  // Versuchen, die JSON-Daten zu decodieren

    if ($json_data === null) {
        echo json_encode([]);  // Falls die JSON-Daten ungültig sind, gib ein leeres Array zurück
    } else {
        echo json_encode($json_data);  // Rückgabe der Hotspots
    }
} else {
    echo "<script>console.log('Datei existiert nicht.' );</script>";
    echo json_encode([]);  // Falls keine Datei existiert, gib ein leeres Array zurück
}
?>


