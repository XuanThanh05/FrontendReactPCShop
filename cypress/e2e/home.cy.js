describe('template spec', () => {
  it('passes', () => {
    describe('Home Page', () => {
      it('load trang home', () => {
        cy.visit('/')
        cy.contains('HOT SALE') // kiểm tra text có xuất hiện
      })
    })
  })
})