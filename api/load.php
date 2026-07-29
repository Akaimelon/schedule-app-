<?php
// アプリの状態を data/store.json から読み込んで返す（GET）
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$file = dirname(__DIR__) . '/data/store.json';

// まだ保存ファイルが無い → 空の状態を返す
if (!file_exists($file)) {
    echo json_encode(['ok' => true, 'data' => new stdClass()], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = @file_get_contents($file);
$data = json_decode($raw, true);

// 中身が壊れている/空 → 空の状態を返す
if (!is_array($data)) {
    echo json_encode(['ok' => true, 'data' => new stdClass()], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
