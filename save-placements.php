<?php
// Define the path to the JSON file
$jsonFile = 'placements.json';

// Function to load JSON data from the file
function loadJsonData($filePath) {
    if (file_exists($filePath)) {
        $jsonData = json_decode(file_get_contents($filePath), true);
        if (is_array($jsonData)) {
            return $jsonData;
        }
    }
    return [];
}

// Function to save JSON data to the file
function saveJsonData($filePath, $data) {
    return file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT)) !== false;
}

// Handle POST request to save placements
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    // Check if data contains player and takenBlocks
    if (isset($data['player']) && isset($data['takenBlocks'])) {
        $player = $data['player'];
        $takenBlocks = $data['takenBlocks'];

        // Load the existing JSON data
        $jsonData = loadJsonData($jsonFile);

        // Save the taken blocks under the correct player
        $jsonData[$player] = $takenBlocks;

        // Save the updated data back to the file
        if (saveJsonData($jsonFile, $jsonData)) {
            echo json_encode(['status' => 'success', 'message' => 'Placements saved successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to write to JSON file.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid data received.']);
    }
    exit;
}

// Handle GET request to fetch placements
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Load the existing JSON data
    $jsonData = loadJsonData($jsonFile);

    // Return the JSON data
    header('Content-Type: application/json');
    echo json_encode($jsonData);
    exit;
}

// Handle other request methods
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
exit;
?>