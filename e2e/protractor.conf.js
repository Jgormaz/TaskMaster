exports.config = {
    
    chromeDriver: 'C:/Users/cuchi/AppData/Roaming/npm/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver.exe',
    allScriptsTimeout: 11000,
    specs: [
      './specs/*.e2e-spec.ts'
    ],
    capabilities: {
      'browserName': 'chrome',
      'loggingPrefs': {
        'driver': 'ALL', 
        'server': 'ALL', 
        'browser': 'ALL'
        }
    },
    directConnect: true,
    baseUrl: 'http://localhost:8100/',
    framework: 'jasmine',
    jasmineNodeOpts: {
      showColors: true,
      defaultTimeoutInterval: 600000,
      print: function() {}
    },
    onPrepare() {
      require('ts-node').register({
        project: require('path').join(__dirname, './tsconfig.json')
      });
    }
  };