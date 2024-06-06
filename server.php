<?php
header('Content-Type: application/json');

// Read the incoming data
$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['player']) && isset($data['takenBlocks'])) {
    $player = $data['player'];
    $takenBlocks = $data['takenBlocks'];

    $filename = 'placements.json';

    // Check if the file exists
    if (file_exists($filename)) {
        // Read the existing data
        $json_data = file_get_contents($filename);
        $placements = json_decode($json_data, true);
    } else {
        $placements = [];
    }

    // Update the placements data
    $placements[$player] = $takenBlocks;

    // Save the updated data back to the file
    if (file_put_contents($filename, json_encode($placements, JSON_PRETTY_PRINT))) {
        echo json_encode(['message' => 'Placements saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error saving placements']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid data']);
}
?>