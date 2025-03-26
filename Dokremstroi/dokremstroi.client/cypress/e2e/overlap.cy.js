describe('Проверка перекрытия элементов', () => {
  it('Проверка кнопки входа', () => {
    cy.visit('https://localhost:4200/login');
    cy.get('#login-button')
      .should('be.visible') // Должна быть видимой
      .and(($btn) => {
        const rect = $btn[0].getBoundingClientRect();
        cy.document().then((doc) => {
          const elementUnder = doc.elementFromPoint(rect.x, rect.y);
          expect(elementUnder).to.eq($btn[0]);
        });
      });
  });
});
