// simple concatenation with a random number
function getRandomUser() {
  return "user" + Math.floor(Math.random() * 100000);
}

describe("DemoBlaze E2E UI Tests", () => {
  // Base URL of the website under test
  const baseUrl = "https://www.demoblaze.com/index.html";

  // Generate a random username for tests
  let username = getRandomUser();

  // Password used for all tests
  const password = "test123";


  // Test case: create a new user account
  it("Create an account", () => {
    cy.visit(baseUrl); // Go to homepage
    cy.get("#signin2").click(); // Click signup button
    cy.wait(500); // Wait a bit for modal to open 
    cy.get("#sign-username").type(username); // Enter random username
    cy.get("#sign-password").type(password); // Enter password
    cy.get('.btn.btn-primary').contains('Sign up').click(); // Click sign up button

    // Listen to alert window and check success message
    cy.on("window:alert", (str) => {
      expect(str).to.contain("Sign up successful");
    });
  });


  // Test case: login with the created account
  it("Login with the created account and logout", () => {
    cy.visit(baseUrl);
    cy.get("#login2").click(); // Click login button
    cy.wait(500); // Wait for login modal
    cy.get("#loginusername").type(username); // Enter username
    cy.get("#loginpassword").type(password); // Enter password
    cy.get('.btn.btn-primary').contains('Log in').click() // Click login
    cy.wait(500); // Wait for login process

    // Check if username is displayed (indicates login success)
    cy.get("#nameofuser");

  }); 


  // Negative test: signup with an existing username should fail
  it("negative test:Signup with an existing username should fail", () => {
    cy.visit(baseUrl);      
    cy.get("#signin2").click();
    cy.wait(500);
    cy.get("#sign-username").type("admin"); // Using existing username
    cy.get("#sign-password").type("admin"); 
    cy.get('.btn.btn-primary').contains('Sign up').click();

    // Expect an alert about user already existing
    cy.on("window:alert", (str) => {
      expect(str).to.contain("This user already exist.");
    });
  });


  // Negative test: signup without entering username
  it("negative test:Signup without entering username", () => {
    cy.visit(baseUrl);  
    cy.get("#signin2").click();
    cy.wait(500);
    cy.get("#sign-password").type(password); // Only password entered
    cy.get('.btn.btn-primary').contains('Sign up').click();

    // Expect alert about missing username
    cy.on("window:alert", (str) => {
      expect(str).to.contain("Please fill out Username and Password.");
    });
  });


  // Negative test: login with incorrect password
  it("negative test:Login with incorrect password", () => {
    cy.visit(baseUrl);  
    cy.get("#login2").click();
    cy.wait(500);
    cy.get("#loginusername").type("admin"); // Correct username
    cy.get("#loginpassword").type("wrongpass"); // Wrong password
    cy.get('.btn.btn-primary').contains('Log in').click();

    // Expect alert about wrong password
    cy.on("window:alert", (str) => {
      expect(str).to.contain("Wrong password.");
    });
  });


  // Negative test: login with non-existing username
  it("negative test:Login with non-existing username", () => {
    cy.visit(baseUrl);   
    cy.get("#login2").click();
    cy.wait(500);
    cy.get("#loginusername").type("nonexistentUser123"); // Non-existing username
    cy.get("#loginpassword").type("whatever");
    cy.get('.btn.btn-primary').contains('Log in').click();

    // Expect alert about user not existing
    cy.on("window:alert", (str) => {
      expect(str).to.contain("User does not exist.");
    });
  });

});