import { loadProductsFromStorage } from "./shared.js";

const orderContainer = document.getElementById('admin-orders');
const adminProducts = document.getElementById('admin-producten');
const productForm = document.getElementById('productForm');

const fetchProductsFromJson = async () => {
    const response = await fetch('../product.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Producten laden is mislukt.');
    return response.json();
};

const saveProductsToJson = async (products) => {
    const response = await fetch('save-products.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Producten opslaan is mislukt.');
    }
    localStorage.setItem('mijnProducten', JSON.stringify(products));
};

const showProductError = (error) => {
    console.error(error);
    alert('Producten konden niet worden opgeslagen. Controleer of de PHP-server schrijfrechten heeft.');
};

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
    loadProductsFromStorage((products) => {
        adminProducts.innerHTML = products.map(product => `
            <div class="admin-product-card product-row">
                <p>${product.id}</p>
                <p><strong>${product.name || product.naam}</strong></p>
                <p style="font-size: 0.7rem; color: gray; max-width: 150px;
                overflow: hidden;">${product.image || product.afbeelding}</p>
                <p>€${product.price || product.prijs}</p>
                <div class="edit-cart-icon edit-product-button">
                    <a onclick="editProduct(${product.id})"><img src="../assets/img/editbutton.svg" alt="edit"/></a>
                </div>
                <div class="clear-cart-icon remove-product-button">
                    <a onclick="removeProduct(${product.id})"><img src="../assets/img/deletebutton.svg" alt="remove"/></a>
                </div>
            </div>
        `).join('');
    }, true);
};

if (productForm) {
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const naam = document.getElementById('naam').value;
        const prijs = parseFloat(document.getElementById('prijs').value);
        const afbeelding = document.getElementById('afbeelding').value;

        try {
            const products = await fetchProductsFromJson();
            const highestId = products.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0);
            products.push({ id: highestId + 1, naam, prijs, afbeelding });
            await saveProductsToJson(products);
            productForm.reset();
            loadProductsAdmin();
        } catch (error) {
            showProductError(error);
        }
    });
}

export async function removeProduct(id) {
    try {
        const products = await fetchProductsFromJson();
        const updatedProducts = products.filter(product => Number(product.id) !== Number(id));
        await saveProductsToJson(updatedProducts);
        loadProductsAdmin();
    } catch (error) {
        showProductError(error);
    }
}

export async function editProduct(id) {
    let products;
    try {
        products = await fetchProductsFromJson();
    } catch (error) {
        showProductError(error);
        return;
    }

    const product = products.find(item => Number(item.id) === Number(id));
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
    if (modal) modal.classList.add('show');
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

    if (closeBtn) closeBtn.addEventListener('click', closeeditModal);
    if (modal) {
        modal.addEventListener('click', event => {
            if (event.target === modal) closeeditModal();
        });
    }

    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', async event => {
            event.preventDefault();

            const productId = Number(editForm.dataset.productId);
            const updatedProduct = {
                id: productId,
                naam: document.getElementById('edit-naam').value,
                prijs: parseFloat(document.getElementById('edit-prijs').value),
                afbeelding: document.getElementById('edit-afbeelding').value,
            };

            try {
                const products = await fetchProductsFromJson();
                const productIndex = products.findIndex(product => Number(product.id) === productId);
                if (productIndex === -1) throw new Error('Product niet gevonden.');
                products[productIndex] = updatedProduct;
                await saveProductsToJson(products);
                closeeditModal();
                loadProductsAdmin();
            } catch (error) {
                showProductError(error);
            }
        });
    }

    loadOrders();
    loadProductsAdmin();
});

window.removeProduct = removeProduct;
window.editProduct = editProduct;
window.resetAdmin = resetAdmin;
window.closeeditModal = closeeditModal;