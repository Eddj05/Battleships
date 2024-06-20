<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data from the POST request
    $json_data = file_get_contents('php://input');
    $request_data = json_decode($json_data, true);

    if ($request_data === null || !isset($request_data['action']) || $request_data['action'] !== 'clear') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
        exit;
    }

    $filename = 'clicked-blocks.json';

    // Initialize the data structure with empty arrays
    $data = [
        'player1Clicks' => [],
        'player2Clicks' => []
    ];

    // Save the cleared data back to the JSON file
    if (file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['status' => 'success', 'message' => 'Data cleared successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to clear data']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>