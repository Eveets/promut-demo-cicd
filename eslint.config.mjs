export default [
  { ignores: ['node_modules/**', '.tools/**'] },
  {
    files: ['**/*.mjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: { 'no-unused-vars': 'error', 'no-unreachable': 'error', 'no-constant-condition': 'error' },
  },
];
