module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  plugins: ['vue', '@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-strongly-recommended',
  ],
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'vue/no-setup-props-destructure': 0,
    'max-len': ['warn', { code: 160 }],
    'no-trailing-spaces': [2, { skipBlankLines: true }],
    'no-console': 'off',
    'no-debugger': 'off',
    'linebreak-style': 0,
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-cycle': 'off',
    'no-underscore-dangle': 'off',
    'prefer-const': 'off',
    'global-require': 'off',
    'no-use-before-define': 'off',
    'no-plusplus': 'off',
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': [
      0,
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    allowImportExportEverywhere: 0,
    'import/no-dynamic-import': 'off',
    'func-names': 'off',
    'object-curly-newline': 'off',
    semi: ['error', 'never'],
    'space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'eol-last': ['error', 'always'],
    'arrow-parens': ['error', 'as-needed'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
    ],
    'vue/no-duplicate-attributes': [
      'error',
      {
        allowCoexistClass: true,
        allowCoexistStyle: true,
      },
    ],
    'vue/no-v-html': 0,
    'vue/no-use-v-if-with-v-for': [
      'warn',
      {
        allowUsingIterationVar: true,
      },
    ],
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/attribute-hyphenation': [
      'warn',
      'always',
      {
        ignore: ['testId'],
      },
    ],
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: false,
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/multi-word-component-names': 0,
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
        },
      },
    ],
  },
  ignorePatterns: ['node_modules/', 'modules', '*.jpg'],
  overrides: [
    {
      files: ['*.svg'],
      rules: {
        'max-len': 0,
        'vue/component-tags-order': 0,
        'vue/comment-directive': 0,
      },
    },
  ],
}
