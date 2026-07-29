<?php
// 送られてきたJSONを data/store.json に丸ごと保存する（POST）
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST only'], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid json'], JSON_UNESCAPED_UNICODE);
    exit;
}

$dir = dirname(__DIR__) . '/data';
if (!is_dir($dir)) {
    mkdir($dir, 0775, true);
}

$json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$ok = @file_put_contents($dir . '/store.json', $json, LOCK_EX);

if ($ok === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'save failed'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
