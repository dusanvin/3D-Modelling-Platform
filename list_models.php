<?php
$dir = 'imports/';
$models = [];

// Verzeichnis nach .glb-Dateien durchsuchen
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'glb') {
                $model_name = pathinfo($file, PATHINFO_FILENAME);
                $webp_file = $model_name . '.webp';

                // Überprüfen, ob die dazugehörige .webp-Datei existiert
                if (file_exists($dir . $webp_file)) {
                    $models[] = [
                        'name' => $model_name,
                        'glb' => $file,
                        'webp' => $webp_file
                    ];
                }
            }
        }
        closedir($dh);
    }
}

// Modelle als JSON zurückgeben
echo json_encode($models);
?>
