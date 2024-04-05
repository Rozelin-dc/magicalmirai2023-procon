/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.overwriteQuery('get', function (originalFn, ...args) {
  const innerFn = originalFn.apply(this, args)

  return (subject) => {
    const el = innerFn(subject)

    const testIds: string[] = []
    // const elData: string[] = []
    for (let i = 0; i < el.length; i++) {
      // elData.push(JSON.stringify(el[i], undefined, 2))
      const testId = el[i].dataset['test']
      if (testId) {
        testIds.push(testId)
      }
    }

    Cypress.log({
      name: 'get',
      message: `get command run\nlocator: ${args[0]}\ntest ids: ${testIds.join(
        ', '
      )}`,
      $el: el,
    })
    // cy.log(`get command run: ${args[0]}\nreturnd element: ${el}`)

    // console.info('get element: ', JSON.stringify(el))

    return el
  }
})
