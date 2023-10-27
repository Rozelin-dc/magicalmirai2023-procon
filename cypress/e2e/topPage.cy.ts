describe('Select Song', () => {
  it('Can select song.', () => {
    cy.visit('/')
    cy.contains('Select Song')

    const lis = cy.get('li')
    lis.its('length').should('eq', 6)
    // let songName = ''
    // lis.then(($li) => (songName = Cypress.$($li).text()))
    cy.get('li').last().click()
    // cy.contains('Select Song', { matchCase: false })

    // text alive にAPIリクエストが飛ぶ処理は失敗するのでできない
    // cy.contains('Press Enter or Space')
    // playButton.click()
    // cy.contains(songName)

    // const backButton = cy.get('.stop-button')
    // backButton.click()
    // cy.contains('Select Song')
  })
})
