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

// Cypress.Commands.overwriteQuery('get', function (originalFn, ...args) {
//   const innerFn = originalFn.apply(this, args)

//   return (subject) => {
//     const el = innerFn(subject)

//     console.info(`Command: get\nquery: ${args[0]}\noptions: ${args}\nElement class: ${el[0].className}\nElement data-test: ${el[0].dataset?.test}`)

//     return el
//   }
// })

Cypress.Commands.add('logElementInfo', (method: keyof (typeof cy), locator: string) => {
  // @ts-ignore
  cy[method](locator).then((element: { attributes: { name: string, value: unknown }[] }[]) => {
    const parent = {
      index: 'parent',
      // @ts-ignore
      text: element.text(),
      // @ts-ignore
      html: element.html(),
      method,
      locator,
      len: element.length
    }
    cy.writeFile('./log.txt', parent, { flag: 'a' });
    // if (!Array.isArray(element)) {
    //   element = [element];
    // }
    for (let idx = 0; idx < element.length; idx++) {
      const el = element[idx];
      const attributes = Array.from(el.attributes).reduce((acc: Record<string, unknown>, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {});
      const elementInfo = {
        index: idx,
        // @ts-ignore
        text: el.text,
        // @ts-ignore
        html: el.html,
        attributes: attributes,
        method,
        locator,
      };
      cy.writeFile('./log.txt', elementInfo, { flag: 'a' });
    }
  });

  // @ts-ignore
  return cy[method](locator)
});
