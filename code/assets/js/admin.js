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
    loadProductsFromStorage((productenLokaal) => {
        const gecombineerdeProducten = productenLokaal;
        adminProducts.innerHTML = gecombineerdeProducten.map(p => `
            <div class="admin-product-card product-row">
                <p>${p.id}</p>
                <p><strong>${p.name || p.naam}</strong></p>
                <p style="font-size: 0.7rem; color: gray; max-width: 150px; overflow: hidden;">${p.image || p.afbeelding}</p>
                <p>€${p.price || p.prijs}</p>
                <div class="edit-cart-icon edit-product-button">
                    <a onclick="editProduct(${p.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                            <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"></path>
                        </svg>
                    </a>
                </div>
                <div class="clear-cart-icon remove-product-button">
                    <a onclick="removeProduct(${p.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        `).join('');
    });
};

if (productForm) {
    productForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const naam = document.getElementById('naam').value;
        const prijs = document.getElementById('prijs').value;
        const afbeelding = document.getElementById('afbeelding').value;
        let producten = JSON.parse(localStorage.getItem('mijnProducten')) || [];

        let hoogsteId = 0;
        if (producten.length > 0) {
            hoogsteId = Math.max(...producten.map(p => p.id));
        }
        
        addProduct(hoogsteId + 1, naam, prijs, afbeelding);
        productForm.reset();
        loadProductsAdmin();
    });
}

function removeProduct(id) {
    let lokaleProducten = JSON.parse(localStorage.getItem('mijnProducten')) || [];
    const nieuweLijst = lokaleProducten.filter(p => p.id !== id);
    localStorage.setItem('mijnProducten', JSON.stringify(nieuweLijst));
    loadProductsAdmin();
}

function editProduct(id) {
    let lokaleProducten = JSON.parse(localStorage.getItem('mijnProducten')) || [];
    const product = lokaleProducten.find(p => p.id === id);

    if (!product) {
        alert("Product niet gevonden!");
        return;
    }

    document.getElementById('edit-naam').value = product.name || product.naam;
    document.getElementById('edit-prijs').value = product.price || product.prijs;
    document.getElementById('edit-afbeelding').value = product.image || product.afbeelding;

    document.getElementById('editProductForm').dataset.productId = id;

    openEditModal();
}

const resetAdmin = () => {
    if (window.confirm('Bestellingen wissen?')) {
        localStorage.removeItem('all_orders');
        loadOrders();
    }
};

function openEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeeditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('editProductForm').reset();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeeditModal);
    }
    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeeditModal();
            }
        });
    }

    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const productId = parseInt(this.dataset.productId);
            const naam = document.getElementById('edit-naam').value;
            const prijs = document.getElementById('edit-prijs').value;
            const afbeelding = document.getElementById('edit-afbeelding').value;

            let lokaleProducten = JSON.parse(localStorage.getItem('mijnProducten')) || [];
            const productIndex = lokaleProducten.findIndex(p => p.id === productId);

            if (productIndex !== -1) {
                lokaleProducten[productIndex] = {
                    id: productId,
                    naam: naam,
                    prijs: parseFloat(prijs),
                    afbeelding: afbeelding,
                };

                localStorage.setItem('mijnProducten', JSON.stringify(lokaleProducten));
                closeeditModal();
                loadProductsAdmin();
            }
        });
    }

    loadOrders();
    loadProductsAdmin();
});