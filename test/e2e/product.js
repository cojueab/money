
module.exports = { // adapted from: https://git.io/vodU0
  before: function (browser) {
    browser.resizeWindow(1280, 1024)
  },
  'product': function (browser) {
    browser
      .url('http://192.168.5.41:3000')
      .waitForElementVisible('input[name="username"]', 1000)
      .setValue('input[name="username"]', 'zty')
      .setValue('input[name="password"]', 'zty123zty')
      .click('button[type=submit]')
      .pause(3000)
      .click('button[id="addButtonDesktop"]')
      .clearValue('input[name="money"]')
      .setValue('input[name="product"]', 'test')
      .clearValue('input[name="money"]')
      .setValue('input[name="money"]', '3.4')
      .click('button[id="addButton"]')
      .pause(2000)
      .execute(function () {
        let table = document.getElementsByTagName('table')[0]
        let p1 = table.rows[1].children[0].textContent
        let p2 = table.rows[1].children[1].textContent
        return p1 === 'test' && p2 === '3.4'
      }, [], function (response) {
        browser.assert.equal(response.value, true, 'Product added')
      })
      .useXpath().click("//*[contains(text(), 'test')]")
      .useCss()
      .pause(1000)
      .execute(function () {
        document.querySelector('input[name="product"]').value = ''
      })
      .pause(1000)
      .setValue('input[name="product"]', 'test2')
      .clearValue('input[name="money"]')
      .setValue('input[name="money"]', '3.5')
      .click('button[id="updateButton"]')
      .pause(2000)
      .execute(function () {
        let table = document.getElementsByTagName('table')[0]
        let p1 = table.rows[1].children[0].textContent
        let p2 = table.rows[1].children[1].textContent
        return p1 === 'test2' && p2 === '3.5'
      }, [], function (response) {
        browser.assert.equal(response.value, true, 'Product updated')
      })
      .execute(function () {
        let table1 = document.getElementsByTagName('table')[0]
        table1.rows[1].children[3].children[0].children[0].click()
        return false
      }, [], function (response) {
        browser.assert.equal(response.value, false, 'Product delete click')
      })
      .pause(2000)
      .execute(function () {
        let table = document.getElementsByTagName('table')[0]
        let p1 = table.rows[1].children[0].textContent
        let p2 = table.rows[1].children[1].textContent
        return p1 === 'test2' && p2 === '3.5'
      }, [], function (response) {
        browser.assert.equal(response.value, false, 'Product deleted')
      })

    browser.end()
  }
}
