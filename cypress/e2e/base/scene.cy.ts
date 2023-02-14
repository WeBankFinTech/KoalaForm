describe('快速上手', () => {
    // it('基础场景', () => {
    //     cy.visit('/zh/guide/getting-started.html');
    //     cy.get('.example-case').eq(0).as('baseScene');
    //     cy.get('@baseScene').find('h3').should('contain.text', '基础场景');
    //     cy.get('@baseScene').find('p').should('contain.text', '我是基础场景的内容');
    // });

    it('表单这么写', () => {
        cy.visit('/zh/guide/getting-started.html');
        cy.get('.example-case').eq(1).find('.fes-form-item').as('items');

        cy.get('@items').eq(0).get('input').should('contain.value', '蒙奇·D·路飞');
        cy.get('@items').eq(1).get('.fes-select-trigger-label').should('contain.text', '男');
        cy.get('@items').eq(2).find('input').type('18{enter}');

        cy.get('@items').eq(3).contains('保存').click();
        cy.get('@items').eq(3).contains('重置').click();
        cy.get('@items').eq(2).find('input').should('contain.value', '');
    });
});
