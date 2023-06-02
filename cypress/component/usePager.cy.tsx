import UsePager from '../../docs/examples/started/usePager';

describe('Pager component', () => {
    it('Should display correct page number and total count', () => {
        const app = cy.mount(UsePager);
        app.get('.fes-pagination').get('.is-active').should('have.text', '2');
    });

    it('Should trigger onChange event when the page is changed', () => {
        const app = cy.mount(UsePager);
        app.get('.fes-pagination-pager-item').eq(3).click(); // Assuming that the class "pager__page-link" represents the clickable link element for each page. Selecting the fourth link to simulate a page change event.
        app.get('.fes-alert-info').should('have.text', 'onChange 3'); // Assuming that the class "f-message--info" represents the message element displayed when the onChange event is triggered.
        app.get('.fes-alert-success').should('have.text', 'watch 3'); // Assuming that the class "f-message--success" represents the message element displayed when the watched currentPage value is changed to 3.
    });
});
