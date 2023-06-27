import UseModal from '../../docs/examples/started/useModal';

describe('UseModal', () => {
    it('should open the modal when click the button `Open Modal`', () => {
        cy.mount(UseModal);
        cy.contains('Open Modal').click(); // 点击‘Open Modal’按钮
        cy.get('.fes-modal-container').should('be.visible'); // 验证‘Modal’是否可见
    });

    it('should open the drawer when click the button `Open Drawer`', () => {
        cy.mount(UseModal);
        cy.contains('Open Drawer').click(); // 点击‘Open Drawer’按钮
        cy.get('.fes-drawer-container').should('be.visible'); // 验证‘Drawer’是否可见
    });

    it('should open the modal with correct form fields', () => {
        cy.mount(UseModal);
        cy.contains('Open Modal').click(); // 点击‘Open Modal’按钮
        cy.contains('名字').should('be.visible'); // 验证名字输入框是否出现
        cy.contains('年龄').should('be.visible'); // 验证年龄输入框是否出现
    });

    it('should close the modal when click the `Cancel` button', () => {
        cy.mount(UseModal);
        cy.contains('Open Modal').click(); // 点击‘Open Modal’按钮
        cy.get('.fes-modal-container').find('button').contains('取消').click(); // 点击‘Cancel’按钮
        cy.get('.fes-modal-container').should('not.be.visible'); // 验证‘Modal’是否不可见
    });

    it('should close the drawer when click the `Cancel` button', () => {
        cy.mount(UseModal);
        cy.contains('Open Drawer').click(); // 点击‘Open Drawer’按钮
        cy.get('.fes-drawer-container').find('button').contains('取消').click(); // 点击‘Cancel’按钮
        cy.get('.fes-drawer-container').should('not.be.visible'); // 验证‘Drawer’是否不可见
    });
});
