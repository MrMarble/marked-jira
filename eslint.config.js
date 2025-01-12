import markedEslintConfig from '@markedjs/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/lib', '*.min.js', '**/demo', 'node_modules'],
  },
  tseslint.configs.recommended,
  ...markedEslintConfig,
);
