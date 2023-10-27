import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:2323',
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 100000,
  },
})
