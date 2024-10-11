<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$target_dir = "imports/";

if (isset($_POST['glb']) && isset($_POST['webp'])) {
    $glb_file = $target_dir . basename($_POST['glb']);
    $webp_file = $target_dir . basename($_POST['webp']);

    $response = [];

    // Überprüfen, ob die Dateien existieren und löschen
    if (file_exists($glb_file) && file_exists($webp_file)) {
        if (unlink($glb_file) && unlink($webp_file)) {
            $response['message'] = 'Dateien erfolgreich gelöscht';
        } else {
            $response['message'] = 'Fehler beim Löschen der Dateien';
        }
    } else {
        $response['message'] = 'Eine oder beide Dateien wurden nicht gefunden';
    }

    echo json_encode($response);
} else {
    echo json_encode(['message' => 'Keine Dateien zum Löschen angegeben']);
}
?>
