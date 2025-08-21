describe("DemoBlaze E2E UI Tests", () => {
  const baseUrl = "https://www.demoblaze.com/index.html";

  it("Place an order", () => {
    cy.visit(baseUrl);    
    const productName = "Samsung galaxy s6";

    // Navigate to product page and add to cart
    cy.contains("a.hrefch", productName).click(); 
    cy.get(".btn.btn-success.btn-lg").click();       

    // Navigate to cart and start order process
    cy.get("#cartur").contains('Cart').click();
    cy.wait(500); // Wait for cart to update
    cy.get(".btn.btn-success").contains('Place Order').click();

    // Fill order form
    cy.get("#name").type("Test User");
    cy.get("#country").type("Germany");
    cy.get("#city").type("Hamburg");
    cy.get("#card").type("123456789");
    cy.get("#month").type("08");
    cy.get("#year").type("2025");

    // Submit purchase
    cy.contains("Purchase").click();

    // Verify confirmation modal
    cy.get(".sweet-alert").should("be.visible");
    cy.get(".sweet-alert h2").should("contain", "Thank you for your purchase!");
  });

  it("Validates that purchase confirmation shows correct details", () => {
    const productName = "Sony vaio i5";
    cy.visit(baseUrl); 

    // Add product to cart
    cy.contains("a.hrefch", productName).click();
    cy.get(".btn.btn-success.btn-lg").click();       
    cy.on("window:alert", (str) => {
      expect(str).to.contain("Product added");
    });
    cy.get(".nav-link").contains('Home').click(); 

    cy.get(".nav-link").contains('Cart').click();
    cy.get("#tbodyid tr").should("have.length", 1);

    let totalAmount = 0;
    cy.get("#tbodyid tr td:nth-child(3)").then(($priceCells) => {
      totalAmount = parseInt($priceCells.text().trim());
    });

    cy.get(".btn.btn-success").contains('Place Order').click();

    const orderDetails = {
      name: "Test User",
      country: "Germany",
      city: "Hamburg",
      card: "1234567890123456",
      month: "08",
      year: "2025"
    };

    // Fill order form
    cy.get("#name").type(orderDetails.name);
    cy.get("#country").type(orderDetails.country);
    cy.get("#city").type(orderDetails.city);
    cy.get("#card").type(orderDetails.card);
    cy.get("#month").type(orderDetails.month);
    cy.get("#year").type(orderDetails.year);

    // Submit purchase and validate confirmation
    cy.contains("Purchase").click();

    cy.get(".sweet-alert").should("be.visible").within(() => {
      cy.get("h2").should("contain.text", "Thank you for your purchase!");
      cy.get("p").then(($msg) => {
        const text = $msg.text();

        // Validate that purchase details appear in confirmation
        expect(text).to.include(orderDetails.name);
        expect(text).to.include(orderDetails.card);
        expect(text).to.include(totalAmount.toString());
      });
    });

    // Close confirmation modal
    cy.contains("OK").click();
  });

  it("negative test:should not allow placing order with empty form fields", () => {
    cy.visit(baseUrl);
    cy.contains("a.hrefch", "Samsung galaxy s6").click(); 
    cy.get(".btn.btn-success.btn-lg").click();       
    cy.get(".nav-link").contains('Cart').click();
    cy.get(".btn.btn-success").contains('Place Order').click();

    // Attempt to purchase with empty form
    cy.contains("Purchase").click();

    // Validate error alert
    cy.once("window:alert", (str) => {
      expect(str).to.contain("Please fill out Name and Creditcard.");
    });
  });

  it("negative test:should not allow placing order with empty cart", () => {
    cy.visit(baseUrl);

    // Navigate to cart without adding any product
    cy.get(".nav-link").contains('Cart').click();

    // Attempt to place order
    cy.get(".btn.btn-success").contains('Place Order').click();

    // Fill partial order form
    cy.get("#name").type("Test User");
    cy.get("#card").type("123456789");

    cy.contains("Purchase").click();

    // Validate that SweetAlert does not appear for empty cart
    cy.get(".sweet-alert").should("not.exist");
  });

});
