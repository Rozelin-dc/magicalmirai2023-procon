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

interface ElementInfo {
  commandIndex: number
  text: string
  html: string
  method: keyof typeof cy
  locator: string
  len: number
  elements: {
    index: number
    text: string
    html: string
    attributes: Record<string, unknown>
  }[]
}

let commands: ElementInfo[] = []
let commandIndex = 0
let testName = ''

Cypress.on('test:before:run', (_atr, test) => {
  commands = []
  commandIndex = 0
  testName = test.title
})

Cypress.Commands.add(
  'logElementInfo',
  (method: keyof typeof cy, locator: string) => {
    // @ts-ignore
    cy[method](locator).then(
      (element: JQuery<HTMLElement>) => {
        const elementInfo: ElementInfo = {
          commandIndex,
          text: element.text(),
          html: element.html(),
          method,
          locator,
          len: element.length,
          elements: []
        }
        for (let idx = 0; idx < element.length; idx++) {
          const el = element[idx]
          const attributes = Array.from(el.attributes).reduce(
            (acc: Record<string, string>, attr) => {
              acc[attr.name] = attr.value
              return acc
            },
            {}
          )
          elementInfo.elements.push({
            index: idx,
            text: el.innerText,
            html: el.outerHTML,
            attributes: attributes,
          })
        }
        commands.push(elementInfo)

        cy.writeFile(`${testName}.log.json`, JSON.stringify(commands, null, 2), { flag: 'w' })
      }
    )

    // @ts-ignore
    return cy[method](locator)
  }
)
