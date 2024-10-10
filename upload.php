<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$target_dir = "imports/";
$glb_file = $target_dir . basename($_FILES["glbFile"]["name"]);
$webp_file = $target_dir . basename($_FILES["webpFile"]["name"]);

$response = [];

if (isset($_FILES["glbFile"]) && isset($_FILES["webpFile"])) {
    $uploadOk = 1;

    // Überprüfen, ob es Upload-Fehler gibt
    if ($_FILES["glbFile"]["error"] !== UPLOAD_ERR_OK) {
        $uploadOk = 0;
        $response['message'] = 'Fehler beim Hochladen der GLB-Datei: ' . $_FILES["glbFile"]["error"];
    }
    if ($_FILES["webpFile"]["error"] !== UPLOAD_ERR_OK) {
        $uploadOk = 0;
        $response['message'] = 'Fehler beim Hochladen der WEBP-Datei: ' . $_FILES["webpFile"]["error"];
    }

    // Überprüfen, ob die Dateien gültig sind
    if ($uploadOk && move_uploaded_file($_FILES["glbFile"]["tmp_name"], $glb_file) && 
        move_uploaded_file($_FILES["webpFile"]["tmp_name"], $webp_file)) {
        $response['message'] = 'Dateien erfolgreich hochgeladen';
        $response['glb'] = $_FILES["glbFile"]["name"];
        $response['webp'] = $_FILES["webpFile"]["name"];
    } else {
        $response['message'] = 'Fehler beim Speichern der Dateien';
    }
} else {
    $response['message'] = 'Keine Dateien zum Hochladen gefunden';
}

echo json_encode($response);
?>
