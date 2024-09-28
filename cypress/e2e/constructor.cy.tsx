import type {} from 'cypress';

beforeEach(() => {
    window.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));
    cy.setCookie('accessToken', 'test-refreshToken');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
        "postOrder",
      );;
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.visit('http://localhost:4000');
});

afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
});


describe('Интеграционные тесты конструктора бургера', () => {
    it('добавление ингредиента из списка в конструктор', () => {
        cy.get('[data-cy="constructor-element"]').should('not.exist');
        cy.get('[data-cy="ingredient-type-bun"]').contains('Добавить').click();
        cy.get('[data-cy="constructor-bun-1"]').should('be.visible');
        cy.get('[data-cy="constructor-bun-1"]').contains('верх').should('exist');
        cy.get('[data-cy="constructor-bun-2"]').should('be.visible');
        cy.get('[data-cy="constructor-bun-2"]').contains('низ').should('exist');
        cy.get('[data-cy="ingredient-type-main"]').contains('Добавить').click();
        cy.get('[data-cy="constructor-element"]').should('be.visible');
        cy.get('[data-cy="constructor-element"]').contains('Биокотлета').should('exist');
        cy.get('[data-cy="constructor-element"]').contains('Соус').should('not.exist');
        cy.get('[data-cy="ingredient-type-sauce"]').contains('Добавить').click();
        cy.get('[data-cy="constructor-element"]').should('be.visible');
        cy.get('[data-cy="constructor-element"]').contains('Соус').should('exist');
    });

    it('работа модальных окон', () => {
        cy.get('[data-cy="constructor-element"]').should('not.exist');
        cy.get('[data-cy="ingredient-type-bun"]').contains('Краторная булка').click();
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="modal"]').contains('Краторная булка').should('exist');
        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
        cy.get('[data-cy="ingredient-type-bun"]').contains('Краторная булка').click();
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="modal"]').contains('Краторная булка').should('exist');
        cy.get('[data-cy="modal-overlay"]').click({ force: true });
        cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('создание заказа', () => {
        cy.get('[data-cy="ingredient-type-bun"]').contains('Добавить').click();
        cy.get('[data-cy="ingredient-type-main"]').contains('Добавить').click();
        cy.get('[data-cy="ingredient-type-sauce"]').contains('Добавить').click();
        cy.get('[data-cy="order-button"]').click();
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get("[data-cy='modal']").should('be.visible').should('exist');
        cy.get("[data-cy='orderNumber']").should('contain.text', '54142');
        cy.get('[data-cy="modal-close"]').click();
        cy.get("[data-cy='modal']").should('not.exist');
        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');

    });
});
