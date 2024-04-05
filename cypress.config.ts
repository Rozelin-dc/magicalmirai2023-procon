import { defineConfig } from 'cypress'

import terminalReport from './cypress-plugins/cypress-terminal-report/src/installLogsPrinter'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // on('task', {
      //   'on:get'(el: Cypress.Chainable) {
      //     console.log('element', JSON.stringify(el))
      //   },
      // })

      // require('cypress-log-to-output').install(on, (type, event) => {
      //   // return true or false from this plugin to control if the event is logged
      //   // `type` is either `console` or `browser`
      //   // if `type` is `browser`, `event` is an object of the type `LogEntry`:
      //   //  https://chromedevtools.github.io/devtools-protocol/tot/Log#type-LogEntry
      //   // if `type` is `console`, `event` is an object of the type passed to `Runtime.consoleAPICalled`:
      //   //  https://chromedevtools.github.io/devtools-protocol/tot/Runtime#event-consoleAPICalled

      //   // for example, to only show error events:

      //   if (event.level === 'info' || event.type === 'info') {
      //     return true
      //   }

      //   return false
      // })

      terminalReport(on, {
        printLogsToConsole: 'always',
      })
    },
    // reporter: "mochawesome",
    baseUrl: 'http://localhost:2323',
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 100000,
  },
})
