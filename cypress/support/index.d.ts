/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    logElementInfo(method: keyof (typeof cy), locator: string): Chainable<Element>
  }
}
