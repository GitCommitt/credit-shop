export const loadProductsFromStorage = (render, reloadFromJson = false) => {
    const productenLokaal = JSON.parse(localStorage.getItem('mijnProducten'));
    if (productenLokaal && !reloadFromJson) {
        render(productenLokaal);
        return;
    }

    fetch(new URL('../../product.json', import.meta.url), { cache: 'no-store' })
        .then(res => {
            if (!res.ok) throw new Error(`Producten laden mislukt: ${res.status}`);
            return res.json();
        })
        .then(jsonProducts => {
            localStorage.setItem('mijnProducten', JSON.stringify(jsonProducts));
            render(jsonProducts);
        })
        .catch(error => {
            console.error(error);
            render(productenLokaal || []);
        });
};

export function addProduct(id, naam, prijs, afbeelding) {
    const nieuwProduct = {
        id: id,
        naam: naam,
        prijs: prijs,
        afbeelding: afbeelding,
    };

    let producten = JSON.parse(localStorage.getItem('mijnProducten')) || [];

    producten.push(nieuwProduct);
    localStorage.setItem('mijnProducten', JSON.stringify(producten));
}