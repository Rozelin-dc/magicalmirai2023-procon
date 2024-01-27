import { defineConfig } from 'cypress'
import logOutput from 'cypress-log-to-output'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      logOutput.install(on, (type, event) => {
        // return true or false from this plugin to control if the event is logged
        // `type` is either `console` or `browser`
        // if `type` is `browser`, `event` is an object of the type `LogEntry`:
        //  https://chromedevtools.github.io/devtools-protocol/tot/Log#type-LogEntry
        // if `type` is `console`, `event` is an object of the type passed to `Runtime.consoleAPICalled`:
        //  https://chromedevtools.github.io/devtools-protocol/tot/Runtime#event-consoleAPICalled

        // for example, to only show error events:

        if (event.level === 'info' || event.type === 'info') {
          return true
        }

        return false
      })
    },
    baseUrl: 'http://localhost:2323',
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 100000,
  },
})
