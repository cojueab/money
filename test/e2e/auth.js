module.exports = { // adapted from: https://git.io/vodU0
  before: function (browser) {
    browser.resizeWindow(1280, 1024)
  },
  'login test': function (browser) {
    browser
      .url('http://192.168.5.41:3000')
      .waitForElementVisible('input[name="username"]')
      .setValue('input[name="username"]', 'zty')
      .setValue('input[name="password"]', 'zty123zty')
      .click('button[type=submit]')
      .pause(3000)
    browser.execute(function () {
      return document.getElementsByClassName('table')[0].getElementsByTagName('tbody')[0].childElementCount > 1
    }, [], function (response) {
      browser.assert.equal(response.value, true, 'Count items equal 5')
    })
      .useXpath().click("//*[contains(text(), 'zty')]").click("//*[contains(text(), 'Logout')]").useCss().pause(2000)
      .waitForElementNotPresent('table')
    browser.end()
  }
}
