<?php
// Get the JSON data sent from the client
$data = json_decode(file_get_contents('php://input'), true);

// Debugging: Output received data
error_log('Received data: ' . print_r($data, true));

// Write the data to the placements.json file
$file = 'placements.json';
$currentData = file_get_contents($file);

if ($currentData === false) {
    error_log('Failed to read from placements.json');
    echo json_encode(array('error' => 'Failed to read from placements.json'));
    exit;
}

$currentData = json_decode($currentData, true);

if ($currentData === null) {
    error_log('Invalid JSON data in placements.json');
    echo json_encode(array('error' => 'Invalid JSON data in placements.json'));
    exit;
}

$currentData[$data['player']] = $data['takenBlocks'];

if (file_put_contents($file, json_encode($currentData)) === false) {
    error_log('Failed to write to placements.json');
    echo json_encode(array('error' => 'Failed to write to placements.json'));
    exit;
}

// Respond with a success message
echo json_encode(array('message' => 'Placement data saved successfully'));
?>