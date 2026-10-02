<?php

declare(strict_types=1);

session_start();

function productsPath(): string
{
    return __DIR__ . '/../product.json';
}

function ordersPath(): string
{
    return __DIR__ . '/../orders.json';
}

function loadProducts(): array
{
    $path = productsPath();

    if (!is_file($path)) {
        return [];
    }

    $content = file_get_contents($path);
    if ($content === false) {
        return [];
    }

    $products = json_decode($content, true);
    return is_array($products) ? $products : [];
}

function saveProducts(array $products): void
{
    $path = productsPath();
    file_put_contents($path, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function loadOrders(): array
{
    $path = ordersPath();

    if (!is_file($path)) {
        return [];
    }

    $content = file_get_contents($path);
    if ($content === false) {
        return [];
    }

    $orders = json_decode($content, true);
    return is_array($orders) ? $orders : [];
}

function saveOrders(array $orders): void
{
    $path = ordersPath();
    file_put_contents($path, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function getCart(): array
{
    return $_SESSION['cart'] ?? [];
}

function setFlash(string $message): void
{
    $_SESSION['flash_message'] = $message;
}

function getFlash(): ?string
{
    if (!isset($_SESSION['flash_message'])) {
        return null;
    }

    $message = $_SESSION['flash_message'];
    unset($_SESSION['flash_message']);
    return $message;
}

function findProductById(int $id): ?array
{
    foreach (loadProducts() as $product) {
        if ((int) ($product['id'] ?? 0) === $id) {
            return $product;
        }
    }

    return null;
}

function addProductToCart(int $productId): void
{
    $product = findProductById($productId);
    if ($product === null) {
        return;
    }

    $cart = getCart();
    $cart[$productId] = ($cart[$productId] ?? 0) + 1;
    $_SESSION['cart'] = $cart;
}

function removeProductFromCart(int $productId): void
{
    $cart = getCart();
    unset($cart[$productId]);
    $_SESSION['cart'] = $cart;
}

function clearCart(): void
{
    unset($_SESSION['cart']);
}

function getCartTotal(): float
{
    $total = 0.0;
    foreach (getCart() as $productId => $quantity) {
        $product = findProductById((int) $productId);
        if ($product !== null) {
            $price = (float) ($product['prijs'] ?? 0);
            $total += $price * $quantity;
        }
    }

    return $total;
}

function formatMoney(float $amount): string
{
    return '€' . number_format($amount, 2, ',', '.');
}

function addOrder(array $order): void
{
    $orders = loadOrders();
    $orders[] = $order;
    saveOrders($orders);
}
