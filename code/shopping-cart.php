<?php
$pageTitle = 'Shopping Cart';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <link rel="stylesheet" href="assets/css/cart.css">
    <script src="assets/js/shared.js" type="module"></script>
    <script src="assets/js/script.js" type="module"></script>
</head>

<body>
    <nav class="navbar-items">
        <h1 class="website-title">
            Bit Acedemy Credit Shop
        </h1>
        <div class="clear-cart-icon">
            <a onclick="clearCart()">
                <img src="./assets/img/deletebutton.svg" alt="delete" />
            </a>
        </div>

    </nav>
    <div class="winkelwagen-overzicht">
        <h2>Winkelwagen</h2>
        <a href="index.php">Ga naar product overzicht</a>
        <div class="winkelwagen-producten" id="cart-overview">
            <div id="cart-display"></div>
        </div>
        <div class="winkelwagen-totaal">
            <h3>Totaal: <span id="total-price">€0.00</span></h3>
        </div>
        <button class="checkout-button" onclick="if (exportAndClearCart()) window.location.href='checkout.php'">
            Afrekenen
        </button>
    </div>
</body>

</html>
