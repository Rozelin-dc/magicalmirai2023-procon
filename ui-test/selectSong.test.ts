import { Builder, By, Capabilities, until, WebDriver } from 'selenium-webdriver'
import { describe, test, expect } from 'vitest'

const capabilities: Capabilities = Capabilities.chrome()
capabilities.set('chromeOptions', {
  w3c: false,
})

describe('楽曲選択と再生ができる', () => {
  test('default', async () => {
    const driver: WebDriver = await new Builder()
      .withCapabilities(capabilities)
      .build()
    try {
      await driver.get('http://localhost:2323')
      let pageSource = await driver.getPageSource()
      expect(pageSource.includes('Select Song')).toBe(true)

      const lis = await driver.findElements(By.css('li'))
      expect(lis.length).toBe(6)
      const songName = await lis[0].getText()
      await lis[0].click()
      pageSource = await driver.getPageSource()
      expect(pageSource.includes('Select Song')).toBe(false)

      await driver.wait(until.elementLocated(By.className('play-button')))
      pageSource = await driver.getPageSource()
      expect(pageSource.includes('Press Enter or Space')).toBe(true)

      const playButton = await driver.findElement(By.className('play-button'))
      await playButton.click()
      await driver.wait(until.elementLocated(By.className('score-area')))
      pageSource = await driver.getPageSource()
      expect(pageSource.includes(songName)).toBe(true)
    } catch (e) {
      console.log(`error!\n${JSON.stringify(e)}`)
    } finally {
      driver && (await driver.quit())
    }
  })
})
