<?php
$pageTitle = 'Admin Panel';
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body class="admin-body">

    <div class="admin-panel-container">
        <header class="admin-header">
            <h1>Admin Panel - Overzicht</h1>
        </header>

        <nav class="admin-nav">
            <div class="admin-product-header">
                <span>Shop Management</span>
            </div>

            <div class="admin-menu-list">
                <a href="admin-bestellingen.php" class="menu-item">
                    <div class="menu-text">
                        <strong>Bestellingen Beheren</strong>
                        <small>Bekijk bestellingen</small>
                    </div>
                    <span class="arrow">→</span>
                </a>
                
                <a href="admin-producten.php" class="menu-item">
                    <div class="menu-text">
                        <strong>Producten Beheren</strong>
                        <small>Voeg nieuwe items toe of pas items aan</small>
                    </div>
                    <span class="arrow">→</span>
                </a>
            </div>
        </nav>

        <div class="admin-controls">
             <a href="../index.php" class="back-link">Terug naar de shop</a>
        </div>
    </div>

</body>
</html>