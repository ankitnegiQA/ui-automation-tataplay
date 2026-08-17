export default {
  default: {
    paths: ['PrismStructure/tests/**/*.feature'],
    import: [
      'PrismStructure/tests/helpers/steps/**/*.js',
      'PrismStructure/tests/helpers/hooks/**/*.js'
    ],
    format: ['progress']
  }
};
