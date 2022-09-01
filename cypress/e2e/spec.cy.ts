describe('My First Test', () => {
    it('koala form docs', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('a', 'Get Started').click();
    });
});
