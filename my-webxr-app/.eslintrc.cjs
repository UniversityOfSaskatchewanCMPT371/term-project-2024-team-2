module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'check-file',
  ],
  ignorePatterns: ['vite.config.ts', 'vite-env.d.ts', 'dist/', 'node_modules/'],
  rules: {
    // Not required for React V18+
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',

    // WebXR libraries don't have well-defined properties, so we can not force no unknowns
    'react/no-unknown-property': 'off',

    // Allow ternary expressions (useful to save code and improve readability)
    '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],

    // Enforce our naming standard
    'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
    'check-file/filename-naming-convention': ['error', {
      'src/**/*.tsx': 'PASCAL_CASE',
      'src/**/*.ts': 'PASCAL_CASE',
    }],

    // Disable prop spreading rule (not feasible with the large # of Three.js object properties)
    'react/jsx-props-no-spreading': 'off',
  },
};
