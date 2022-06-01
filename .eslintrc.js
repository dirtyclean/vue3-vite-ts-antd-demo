module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        jsxPragma: 'React',
        ecmaFeatures: {
            jsx: true
        }
    },
    // 解决提交ts文件抛
    // Error while loading rule '@typescript-eslint/dot-notation': You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.
    // 错误
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parserOptions: {
                // this setting is required to use rules that require type information
                project: './tsconfig.json'
            },
            rules: {
                '@typescript-eslint/prefer-nullish-coalescing': 'error'
            }
        }
    ],
    globals: {
        defineProps: true,
        defineEmits: true,
        useContext: true
    },
    // 改了配置文件不生效，可以重启一下编辑器
    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'standard-with-typescript',
        'plugin:prettier/recommended'
    ],
    rules: {
        'prettier/prettier': ['warn', {}],
        'vue/script-setup-uses-vars': 'error',
        'vue/no-v-html': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'vue/custom-event-name-casing': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }
        ],
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }
        ],
        'space-before-function-paren': 'off',

        'vue/attributes-order': 'off',
        'vue/one-component-per-file': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/attribute-hyphenation': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-explicit-emits': 'off',
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'never',
                    component: 'always'
                },
                svg: 'any',
                math: 'always'
            }
        ],
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-this-alias': [
            'error',
            {
                allowDestructuring: false, // Disallow `const { props, state } = this`; true by default
                allowedNames: ['self'] // Allow `const self = this`; `[]` by default
            }
        ]
    }
}
