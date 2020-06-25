// we use a nightwatch.conf.js file so we can include comments and helper functions
module.exports = {
  'src_folders': ['test/e2e'], // путь к папке с тестами
  'output_folder': 'reports',
  'custom_commands_path': '',
  'custom_assertions_path': '',
  'page_objects_path': '',
  'globals_path': 'test/global.js', // путь к файлу, в котором задаётся глобальный контекст для всех тестов

  'selenium': {
    'start_process': false // отменяем запуск Селениума, т.к. будем обращаться к Chromedriver напрямую
  },

  'test_settings': {
    'default': {
      'selenium_port': 9515, // номер порта Chromedriver по умолчанию ("selenium_" в имени поля — это пережиток прошлого)
      'selenium_host': 'localhost',
      'default_path_prefix': '',
      'globals': {
        'waitForConditionTimeout': 5000 // sometimes internet is slow so wait.
      },
      'screenshots': {
        'enabled': true,
        'on_failure': true,
        'on_error': true,
        'path': 'screenshots'
      },
      'desiredCapabilities': {
        'browserName': 'chrome',
        'chromeOptions': {
          'args': ['--no-sandbox', '--headless', '--disable-gpu'] // специальные флаги для работы Хрома в headless-режиме
        },
        'acceptSslCerts': true
      }
    }
  }
}
