const productsContainer = document.getElementById('productsContainer');
const cartDisplay = document.getElementById('cart-display');
const totalPriceElement = document.getElementById('total-price');

const getCart = () => JSON.parse(localStorage.getItem('cart')) || {};

const updateUI = () => {
    updateCartIcon();
    displayCounts();
    if (cartDisplay) renderCartPage();
};

const loadAllProducts = () => {
    if (!productsContainer) return;

    loadProductsFromStorage( (lokaleProducten) => {
        renderProducts(lokaleProducten);
    })
};

function renderProducts(productenLijst) {
    productsContainer.innerHTML = productenLijst.map(p => {
        const id = p.id;
        const naam = p.name || p.naam;
        const prijs = p.price || p.prijs;
        const afbeelding = p.image || p.afbeelding;

        return `
            <div class="product">
                <img src="${afbeelding}" class="product-image" alt="${naam}">
                <h3>${naam}</h3>
                <p>Prijs: €${prijs}</p>
                <p id="count-${id}" class="product-count">Aantal in winkelwagen: 0</p>
                <button onclick="addProductWithDelay(${id}, this)" \
                class="product-button">Voeg toe</button>
            </div>
        `;
    }).join('');
    displayCounts();
}

function AddProduct(id) {
    const cart = getCart();
    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateUI();
}

function addProductWithDelay(id, button) {
    button.disabled = true;
    AddProduct(id);
    setTimeout(() => {
        button.disabled = false;
    }, 300);
}

function displayCounts() {
    const cart = getCart();
    document.querySelectorAll('.product-count').forEach(el => el.innerText = "Aantal in winkelwagen: 0");
    Object.entries(cart).forEach(([id, count]) => {
        const el = document.getElementById(`count-${id}`);
        if (el) el.innerText = `Aantal in winkelwagen: ${count}`;
    });
}

function updateCartIcon() {
    const icon = document.querySelector('.shoppingcart-icon');
    if (!icon) return;
    const total = Object.values(getCart()).reduce((a, b) => a + b, 0);
    icon.classList.toggle('has-items', total > 0);
    if (total > 0) icon.setAttribute('data-count', total);
}

function renderCartPage() {
    if (!cartDisplay) return;
    const cart = getCart();
    const lokaleProducten = JSON.parse(localStorage.getItem('mijnProducten')) || [];
            let total = 0;
            const html = lokaleProducten.filter(p => cart[p.id]).map(p => {
                const prijs = parseFloat(p.price || p.prijs);
                const afbeelding = p.image || p.afbeelding;
                const sub = prijs * cart[p.id];
                total += sub;
                return `
                    <div class="cart-item" style="display:flex; align-items:center; gap:20px; border-bottom:1px solid #ddd; padding:10px 0;">
                        <img src="${afbeelding}" style="width:80px; height:80px; object-fit:cover;">
                        <div style="flex-grow:1;">
                            <h4>${p.name || p.naam}</h4>
                            <p>${cart[p.id]} x €${prijs.toFixed(2)}</p>
                        </div>
                        <strong>€${sub.toFixed(2)}</strong>
                    </div>`;
            }).join('');
            cartDisplay.innerHTML = html || "<p>Je winkelwagen is leeg.</p>";
            if (totalPriceElement) totalPriceElement.innerText = `€${total.toFixed(2)}`;
}

async function exportAndClearCart() {
    let cart = getCart();
    if (Object.keys(cart).length === 0) return alert("Mandje is leeg");
    
    const lokaleProducten = JSON.parse(localStorage.getItem('mijnProducten')) || [];
    
    try {
        let totaal = 0;
        let items = [];

        lokaleProducten.forEach(p => {
            if (cart[p.id]) {
                const prijs = parseFloat(p.price || p.prijs);
                const naam = p.name || p.naam;
                totaal += prijs * cart[p.id];
                items.push({ naam: naam, aantal: cart[p.id] });
            }
        });

        let bestellingen = JSON.parse(localStorage.getItem('all_orders')) || [];
        
        const hoogsteId = bestellingen.length > 0 
            ? Math.max(...bestellingen.map(o => parseInt(o.id) || 0)) 
            : 0;
        const nieuwId = hoogsteId + 1;

        const nieuweBestelling = {
            id: nieuwId,
            datum: new Date().toLocaleDateString('nl-NL'),
            producten: items,
            totaalbedrag: totaal.toFixed(2)
        };

        bestellingen.push(nieuweBestelling);
        localStorage.setItem('all_orders', JSON.stringify(bestellingen));
        
        localStorage.removeItem('cart');
        alert("Bestelling succesvol geplaatst!");
        location.reload(); 
        
    } catch (error) {
        console.error("Fout bij afrekenen:", error);
        alert("Er ging iets mis bij het verwerken van de producten.");
    }
}

function clearCart(){
    localStorage.removeItem('cart');
    location.reload(); 
}

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    loadAllProducts();
});