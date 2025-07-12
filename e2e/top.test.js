import { afterEach, beforeEach, describe, it } from 'node:test'
import * as assert from 'node:assert'
import path from 'path'
import { fileURLToPath } from 'url'

import selenium from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import { injectDriver } from '@rozelin-dc/js-uitestfix'

const createDriver = async (testName) => {
  const options = new chrome.Options()
  options.addArguments('--headless', '--window-size=1920,1080')
  let driver = await new selenium.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build()
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  driver = await injectDriver(driver, testName, {
    outputDir: path.join(__dirname, '../output'),
    answerDataDir: path.join(__dirname, '../answer-data'),
    configPath: path.join(__dirname, '../config.properties'),
    resultSavePath: path.join(__dirname, '../result'),
  })
  await driver.get('http://localhost:1123')
  return driver
}

describe('test typing-lyrics top page', () => {
  it('get caption', async (context) => {
    const driver = await createDriver(context.name)

    const captionElement = await driver.findElement(
      selenium.By.className('caption')
    )
    const captionText = await captionElement.getText()
    assert.equal(captionText.includes('UTAWO UTAOU'), true)

    await driver.quit()
  })

  it('get caption container', async (context) => {
    const driver = await createDriver(context.name)

    const captionElement = await driver.findElement(
      selenium.By.className('caption-container')
    )
    const visible = await captionElement.isDisplayed()
    assert.equal(visible, true)

    await driver.quit()
  })
})
