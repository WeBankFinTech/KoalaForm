import UseTable from '../../docs/examples/started/useTable';
describe('UseTable', () => {
    it('should display table correctly', () => {
        // Visit UseTable component page
        const app = cy.mount(UseTable);

        // Check table headers
        app.get('thead tr th').eq(0).should('have.text', '姓名');
        app.get('thead tr th').eq(1).should('have.text', '性别');
        app.get('thead tr th').eq(2).should('have.text', '年龄');
        app.get('thead tr th').eq(3).should('have.text', '生日');
        app.get('thead tr th').eq(4).should('have.text', '操作');

        // Check if there are 2 table rows
        app.get('tbody tr').should('have.length', 2);

        // Check the values of the first table row
        app.get('tbody tr').eq(0).children().eq(0).should('contain.text', '蒙奇·D·路飞');
        app.get('tbody tr').eq(0).children().eq(1).should('contain.text', '男');
        app.get('tbody tr').eq(0).children().eq(2).should('contain.text', '16');
        app.get('tbody tr').eq(0).children().eq(3).should('contain.text', '2022-02-12');
        app.get('tbody tr').eq(0).children().eq(4).click(); // Click the "详情" button and log to console

        // Check the values of the second table row
        app.get('tbody tr').eq(1).children().eq(0).should('contain.text', '罗罗诺亚·索隆');
        app.get('tbody tr').eq(1).children().eq(1).should('contain.text', '男');
        app.get('tbody tr').eq(1).children().eq(2).should('contain.text', '18');
        app.get('tbody tr').eq(1).children().eq(3).should('not.have.text', '');
        app.get('tbody tr').eq(1).children().eq(4).click(); // Click the "详情" button and log to console
    });
});
