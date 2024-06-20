<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $jsonFile = 'turn.json';

    $data = json_decode(file_get_contents("php://input"), true);
    file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));


}