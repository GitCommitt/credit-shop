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