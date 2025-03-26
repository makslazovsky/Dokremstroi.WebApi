describe('UI Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('https://localhost:4200');
    cy.injectAxe();
  });

  it('Проверка ошибок доступности', () => {
    cy.checkA11y();
  });
});
