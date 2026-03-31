const orderContainer = document.getElementById('admin-orders');
const adminProducts = document.getElementById('admin-producten');
const productForm = document.getElementById('productForm');

const loadOrders = () => {
    if (!orderContainer) return;
    const orders = JSON.parse(localStorage.getItem('all_orders')) || [];
    if (orders.length === 0) {
        orderContainer.innerHTML = "<p>Geen bestellingen gevonden.</p>";
        return;
    }
    orders.sort((a, b) => b.id - a.id);
    orderContainer.innerHTML = orders.map(order => `
        <div class="admin-product-card order-row">
            <p>${order.id}</p>
            <p>${order.datum}</p>
            <p><strong>€${order.totaalbedrag}</strong></p>
        </div>
    `).join('');
};

const loadProductsAdmin = () => {
    if (!adminProducts) return;
    let productenLokaal = JSON.parse(localStorage.getItem('mijnProducten')) || [];
    
    fetch('product.json')
        .then(res => res.json())
        .then(jsonProducts => {
            const gecombineerdeProducten = [...jsonProducts, ...productenLokaal];
            adminProducts.innerHTML = gecombineerdeProducten.map(p => `
                <div class="admin-product-card product-row">
                    <p>${p.id}</p>
                    <p><strong>${p.name || p.naam}</strong></p>
                    <p style="font-size: 0.7rem; color: gray; max-width: 150px; overflow: hidden;">${p.image || p.afbeelding}</p>
                    <p>€${p.price || p.prijs}</p>
                    <div class="clear-cart-icon remove-product-button">
                        <a onclick="removeProduct()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path
                                    d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z" />
                            </svg></a>
                    </div>
                </div>
            `).join('');
        })
        .catch(() => {
            adminProducts.innerHTML = productenLokaal.map(p => `
                <div class="admin-product-card product-row">
                    <p>${p.id}</p>
                    <p><strong>${p.naam}</strong></p>
                    <p style="font-size: 0.7rem; color: gray;">${p.afbeelding}</p>
                    <p>€${p.prijs}</p>
                </div>
            `).join('');
        });
};

if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const naam = document.getElementById('naam').value;
        const prijs = document.getElementById('prijs').value;
        const afbeelding = document.getElementById('afbeelding').value;
        
        let producten = JSON.parse(localStorage.getItem('mijnProducten')) || [];

        const hoogsteId = producten.length > 0 
            ? Math.max(...producten.map(p => parseInt(p.id) || 0)) 
            : 0;
        
        const nieuwProduct = { 
            id: hoogsteId + 1, 
            naam: naam, 
            prijs: prijs, 
            afbeelding: afbeelding 
        };
        
        producten.push(nieuwProduct);
        localStorage.setItem('mijnProducten', JSON.stringify(producten));
        
        alert('Product toegevoegd!');
        productForm.reset();
        loadProductsAdmin();
    });
}

const resetAdmin = () => {
    if (confirm("Bestellingen wissen?")) {
        localStorage.removeItem('all_orders');
        loadOrders();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadProductsAdmin();
});