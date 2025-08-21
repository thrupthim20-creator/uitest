describe("DemoBlaze E2E UI Tests", () => {
    // Base URL of the website under test
    const baseUrl = "https://www.demoblaze.com/index.html";

    // Test case: add 3 products to the cart and validate the total price
    it("Add 3 products to cart and validate total", () => {
        cy.visit(baseUrl); 
        let productPrices = [];

        // Function to add a product by name
        function addProduct(name) {
            cy.contains("a.hrefch", name).click(); // Click on product link
            cy.get(".btn.btn-success.btn-lg").click(); // Click "Add to cart" button
            cy.on("window:alert", (str) => {
                expect(str).to.contain("Product added"); // Verify alert message
            });
            cy.get(".nav-link").contains('Home').click(); // Navigate back to home page
        }

        // Add 3 different products
        addProduct("Samsung galaxy s6");
        addProduct("Nokia lumia 1520");
        addProduct("Sony vaio i5");

        // Go to cart page
        cy.get(".nav-link").contains('Cart').click();

        // Verify 3 products are in the cart
        cy.get("#tbodyid tr").should("have.length", 3);

        // Calculate sum of product prices in the cart
        cy.get("#tbodyid tr td:nth-child(3)").then(($priceCells) => {
            let sum = 0;
            $priceCells.each((index, el) => {
                const price = parseInt(el.innerText.trim());
                if (!isNaN(price)) sum += price;
            });

            // Compare calculated sum with total displayed on the page
            cy.get("#totalp").then(($total) => {
                const total = parseInt($total.text().trim());
                expect(total).to.eq(sum);
            });
        });

        // Delete the first product from the cart
        cy.get("#tbodyid tr").first().contains("Delete").click();

        // Wait until cart updates: 2 products should remain
        cy.get("#tbodyid tr").should("have.length", 2).then(($rows) => {
            let sum = 0;
            $rows.each((index, row) => {
                const price = parseInt(Cypress.$(row).find("td:nth-child(3)").text().trim());
                if (!isNaN(price)) sum += price;
            });

            // Validate total after deletion
            cy.get("#totalp").then(($total) => {
                const total = parseInt($total.text().trim());
                expect(total).to.eq(sum);
            });
        });
    }); 

    // Test case: add the same product twice and validate total price
    it("Add 2 same products to cart and validate total", () => {
        cy.visit(baseUrl);  
        const productName = "Samsung galaxy s6";

        // Function to add a product by name
        function addProduct(name) {
            cy.contains("a.hrefch", name).click(); // Click on product link
            cy.get(".btn.btn-success.btn-lg").click(); // Click "Add to cart" button
            cy.on("window:alert", (str) => {
                expect(str).to.contain("Product added"); // Verify alert message
            });
            cy.get(".nav-link").contains('Home').click(); // Navigate back to home page
        }

        // Add the same product twice
        for (let i = 0; i < 2; i++) {
            addProduct(productName);                            
        }

        // Go to cart page
        cy.get(".nav-link").contains('Cart').click();

        // Verify 2 products are in the cart
        cy.get("#tbodyid tr").should("have.length", 2).then(($rows) => {
            let sum = 0;
            $rows.each((index, row) => {
                const price = parseInt(Cypress.$(row).find("td:nth-child(3)").text().trim());
                if (!isNaN(price)) sum += price;
            });

            // Validate total for 2 same products
            cy.get("#totalp").then(($total) => {
                const total = parseInt($total.text().trim());
                expect(total).to.eq(sum);
            });
        });
    });
});
