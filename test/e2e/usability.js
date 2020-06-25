
module.exports = { // adapted from: https://git.io/vodU0
  before: function (browser) {
    browser.resizeWindow(1280, 1024)
  },
  'usability': function (browser) {
    browser
      .url('http://192.168.5.41:3000')
      .waitForElementVisible('input[name="username"]', 1000)
      .setValue('input[name="username"]', 'zty')
      .setValue('input[name="password"]', 'zty123zty')
      .click('button[type=submit]')
      .pause(1000)
      .execute(function () {
        let table = document.getElementsByTagName('table')[0]
        let p1 = table.rows[1].children[1].textContent
        let p2 = table.rows[2].children[1].textContent
        return parseInt(p2) > parseInt(p1)
      }, [], function (response) {
        browser.assert.equal(response.value, true, 'sort standart checked')
      })
      .useXpath().click("//*[contains(text(), 'Money')]")
      .useCss()
      .pause(2000)
    .execute(function () {
      let table = document.getElementsByTagName('table')[0]
      let p1 = table.rows[1].children[1].textContent
      let p2 = table.rows[2].children[1].textContent
      return parseInt(p2) < parseInt(p1)
    }, [], function (response) {
      browser.assert.equal(response.value, true, 'sort reverse checked')
    })
      .useXpath().click("//*[contains(text(), 'Money')]")
      .useCss()
      .click('select[name="select"] option[value="money"]')
      .pause(1000)
      .useXpath().click("//*[contains(text(), 'money')]")
      .useCss()
    .setValue('input[name="search"]', '20')
      .pause(1000)
      .click("button[name='goButton'")
      .pause(2000)
      .execute(function () {
        let table = document.getElementsByTagName('table')[0]
        return table.rows[1].children[1].textContent === '20'
      }, [], function (response) {
        browser.assert.equal(response.value, true, 'search complete')
      })
     .click("button[name='resetButton'")
      .pause(1500)
      .execute(function () {
        let table = document.getElementsByTagName('table')[0]
        return table.rows[2].children[1].textContent === '60'
      }, [], function (response) {
        browser.assert.equal(response.value, true, 'reset complete')
      })
    browser.end()
  }
}
