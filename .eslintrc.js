module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
  },
  overrides: [{
    files: ['.eslintrc.js', 'config-overrides.js'],
    rules: {
      'import/no-extraneous-dependencies': 0,
    },
  }],
};
