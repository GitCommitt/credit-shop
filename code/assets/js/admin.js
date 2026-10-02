import { loadProductsFromStorage, addProduct } from "./shared.js";


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
                    <p style="font-size: 0.7rem; color: gray; max-width: 150px;
                    overflow: hidden;">${p.image || p.afbeelding}</p>
                    <p>€${p.price || p.prijs}</p>
                    <div class="edit-cart-icon edit-product-button">
                        <a onclick="editProduct(${p.id})"><img src="../assets/img/editbutton.svg" alt="edit"/></a>
                    </div>
                    <div class="clear-cart-icon remove-product-button">
                        <a onclick="removeProduct(${p.id})"><img src="../assets/img/deletebutton.svg" alt="edit"/></a>
                    </div>
                </div>
            `).join('');
    }, '../product.json');
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

export function removeProduct(id) {
    let lokaleProducten = JSON.parse(localStorage.getItem('mijnProducten')) || [];

    const nieuweLijst = lokaleProducten.filter(p => p.id != id);

    localStorage.setItem('mijnProducten', JSON.stringify(nieuweLijst));

    loadProductsAdmin();
}

export function editProduct(id) {
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

export const resetAdmin = () => {
    if (window.confirm("Bestellingen wissen?")) {
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

export function closeeditModal() {
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

// expose it to the global window object
window.removeProduct = removeProduct;
window.editProduct = editProduct;
window.resetAdmin = resetAdmin;
window.closeeditModal = closeeditModal;
