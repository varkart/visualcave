const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'tests/report/**',
      'tests/screenshots/**',
      'test-results/**',
      '.git/**',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        Image: 'readonly',
        Blob: 'readonly',
        XMLSerializer: 'readonly',
        URL: 'readonly',
        localStorage: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'off',
    },
  },
  eslintConfigPrettier,
];
