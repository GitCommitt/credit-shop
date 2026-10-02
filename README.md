# Planning webshop

## Type website
Ik maak een webshop website waar je spullen kan bestellen die online worden gezet door mensen waardoor je die ook gaat kunnen kopen als ze online staan. Ook komt er een interface voor de admins en kunnen die daar hun eigen dingen zien achter de schermen zoals de id nummers van de producten of kunnen ze admin only dingen zien.

## Functionaliteiten
In de website gaan verschillende functies komen te zitten:
* Bestellen
* Product overzicht
* Producten toevoegen (admin-only)
* Producten verwijderen (admin-only) 
* Producten wijzigen (admin-only)

## Gebruikte technieken
De onderstaande technieken worden gebruikt in de website
* Objects
* Functies
* Arrays
* local storage
* Variabelen

## Website styling

### Wireframe
![alt text](wireframe.png)

###
![alt text](flowchart.png)

# Handleiding & Functionaliteiten

## Website draaien
1. Open de projectmap in je browser of editor.
2. Start een PHP-server in de map `code` met `php -S localhost:8000`.
3. Open `http://localhost:8000/index.php` om de shop te bekijken.
4. Open `http://localhost:8000/admin/admin.php` voor het beheerderspaneel.

## Wat kan het?
* **Producten Pagina:** Via `index.php` kun je producten kiezen en toevoegen aan het winkelmandje.
* **Winkelmandje**: Via `shopping-cart.php` kun je toegevoegde producten zien, producten verwijderen en bestellingen plaatsen.
* **Admin Interface**: Via `admin/admin.php` kun je kiezen uit twee opties:
    * **Producten beheren**: Toevoegen, wijzigen en verwijderen van het assortiment.
    * **Bestellingen beheren**: Bestellingen inzien en verwijderen uit de lijst.