<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
// Get the JSON data from the POST request
$json_data = file_get_contents('php://input');
$new_data = json_decode($json_data, true);

if ($new_data === null || !isset($new_data['playerClicks']) || !isset($new_data['clickedBlock'])) {
echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
exit;
}

$playerClicksField = $new_data['playerClicks'];
$clickedBlock = $new_data['clickedBlock'];
$filename = 'clicked-blocks.json';

// Initialize the arrays
$data = [
'player1Clicks' => [],
'player2Clicks' => []
];

// Check if the file exists
if (file_exists($filename)) {
// Read the existing JSON file
$file_contents = file_get_contents($filename);
$existing_data = json_decode($file_contents, true);

if ($existing_data !== null) {
$data = $existing_data;
}
}

// Add the new clicked block to the correct player's array
if (!isset($data[$playerClicksField])) {
$data[$playerClicksField] = [];
}

$data[$playerClicksField][] = $clickedBlock;

// Save the updated data back to the JSON file
if (file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT))) {
echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
} else {
echo json_encode(['status' => 'error', 'message' => 'Failed to save data']);
}
} else {
echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>