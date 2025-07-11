import { afterEach, beforeEach, describe, it } from 'node:test'
import * as assert from 'node:assert'
import path from 'path'
import { fileURLToPath } from 'url'

import selenium from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import { injectDriver } from '@rozelin-dc/js-uitestfix'

describe('test typing-lyrics top page', () => {
  /** @type {selenium.WebDriver} */
  let driver

  beforeEach(async (context) => {
    const options = new chrome.Options()
    options.addArguments('--headless', '--window-size=1920,1080')
    driver = await new selenium.Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    driver = await injectDriver(driver, context.name, {
      outputDir: path.join(__dirname, '../output'),
      answerDataDir: path.join(__dirname, '../answer-data'),
      configPath: path.join(__dirname, '../config.properties'),
      resultSavePath: path.join(__dirname, '../result'),
    })
    await driver.get('http://localhost:1123')
  })

  afterEach(async () => {
    await driver.quit()
  })

  it('get caption', async () => {
    const captionElement = await driver.findElement(
      selenium.By.className('caption')
    )
    const captionText = await captionElement.getText()
    assert.equal(captionText.includes('UTAWO UTAOU'), true)
  })

  it('get caption container', async () => {
    const captionElement = await driver.findElement(
      selenium.By.className('caption-container')
    )
    const visible = await captionElement.isDisplayed()
    assert.equal(visible, true)
  })
})
