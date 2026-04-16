export const loadProductsFromStorage = (render) => {
    let productenLokaal = JSON.parse(localStorage.getItem('mijnProducten')) || null;
    if (productenLokaal == null) {
        fetch('product.json')
            .then(res => res.json())
            .then(jsonProducts => {
                for (let i = 0; i < jsonProducts.length; i++) {
                    addProduct(jsonProducts[i].id,
                        jsonProducts[i].naam,
                        jsonProducts[i].prijs,
                        jsonProducts[i].afbeelding);
                }
                loadProductsFromStorage(render);
            });
    } else {
        render(productenLokaal);
    }
};

function addProduct(id, naam, prijs, afbeelding) {
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