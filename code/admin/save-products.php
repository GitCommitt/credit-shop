<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Alleen POST is toegestaan.']);
    exit;
}

$producten = json_decode(file_get_contents('php://input'), true);
if (!is_array($producten)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ongeldige productdata.']);
    exit;
}

$genormaliseerdeProducten = [];
foreach ($producten as $product) {
    if (!is_array($product)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Ongeldig product.']);
        exit;
    }

    $id = $product['id'] ?? null;
    $naam = trim($product['naam'] ?? $product['name'] ?? '');
    $prijs = $product['prijs'] ?? $product['price'] ?? null;
    $afbeelding = trim($product['afbeelding'] ?? $product['image'] ?? '');

    if (!is_numeric($id) || $naam === '' || !is_numeric($prijs) || (float) $prijs < 0 || $afbeelding === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Controleer de naam, prijs en afbeelding van elk product.']);
        exit;
    }

    $genormaliseerdeProducten[] = [
        'id' => (int) $id,
        'naam' => $naam,
        'prijs' => (float) $prijs,
        'afbeelding' => $afbeelding,
    ];
}

$json = json_encode($genormaliseerdeProducten, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false || file_put_contents(__DIR__ . '/../product.json', $json . PHP_EOL, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Producten opslaan is mislukt.']);
    exit;
}

echo json_encode(['success' => true]);