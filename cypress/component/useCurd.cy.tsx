import FesdUseCurd from '../../docs/examples/fesdUseCurd.vue';

describe('FesdUseCurd', () => {
    it('渲染成功', () => {
        const app = cy.mount(FesdUseCurd);
        app.get('.fes-form').should('exist');
    });

    it('扩展查询操作：导出、批量按钮存在', () => {
        const app = cy.mount(FesdUseCurd);
        app.get('.fes-space').contains('导出').should('exist');
        app.get('.fes-space').contains('批量').should('exist');
    });

    it('表格操作：审核、更新按钮存在', () => {
        const app = cy.mount(FesdUseCurd);
        app.get('.fes-table').find('.fes-space').contains('审核').should('exist');
        app.get('.fes-table').find('.fes-space').contains('更新').should('exist');
    });

    it('点击导出按钮', () => {
        const app = cy.mount(FesdUseCurd);
        app.get('.fes-space').contains('导出').click();
        app.log('执行导出操作');
        // 检查导出操作成功弹窗
        app.get('.fes-message-wrapper').should('have.text', '导出');
    });

    it('点击批量按钮-未选择任何记录', () => {
        const app = cy.mount(FesdUseCurd);
        app.get('.fes-space').contains('批量').click();
        app.log('执行批量操作-未选择记录');
        // 检查警告弹窗
        app.get('.fes-message-wrapper').should('have.text', '至少选择一条记录');
    });

    it('点击批量按钮-选择记录', () => {
        const app = cy.mount(FesdUseCurd);
        app.get('tbody').find('.fes-checkbox').first().click();
        app.get('.fes-space').contains('批量').click();
        app.log('执行批量操作-选择记录');
        // 检查批量操作成功弹窗
        app.get('.fes-message-wrapper').should('have.text', '批量操作 ==> ids: 1');
    });

    it('点击审核按钮', () => {
        const app = cy.mount(FesdUseCurd);
        app.get('tbody').contains('审核').first().click();
        app.log('执行审核操作');
        // 检查审核操作成功弹窗
        app.get('.fes-message-wrapper').should('have.text', '审核 ===> 蒙奇·D·路飞');
    });

    it('点击更新按钮', () => {
        const app = cy.mount(FesdUseCurd);
        app.get('.fes-table-row td').eq(3).click();
        app.get('.fes-space').contains('更新').should('not.be.disabled').click();
        app.log('执行更新操作');
        // 检查更新操作成功弹窗
        app.get('.fes-modal-header').should('have.text', '用户更新');
    });
});
