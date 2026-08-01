module.exports = {
  default: {
    require: [
      'src/hooks/*.js',
      'src/steps/*.js'
    ],
    paths: [
      'src/feature/*.feature'
    ],
    format: [
      'progress',
      'json:test-results/reports/cucumber-report.json'
    ]
  }
};