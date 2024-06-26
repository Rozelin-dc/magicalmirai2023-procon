module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-target-blank': 'off',
    'import/default': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        warnOnUnassignedImports: true,
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
}
