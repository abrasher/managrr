// module.exports = {
//   root: true,
//   env: {
//     es6: true,
//     browser: true,
//   },
//   parser: 'vue-eslint-parser',
//   parserOptions: {
//     parser: '@typescript-eslint/parser',
//     project: './tsconfig.json',
//     sourceType: 'module',
//     ecmaVersion: 2021,
//     extraFileExtensions: ['.vue'],
//   },
//   plugins: ['vue', '@typescript-eslint'],
//   extends: [
//     'plugin:vue/vue3-recommended',
//     'eslint:recommended',
//     'plugin:import/typescript',
//     'plugin:@typescript-eslint/recommended',
//     // 'plugin:@typescript-eslint/recommended-requiring-type-checking', // Disabled as it is too finicky for benefits
//     'prettier',
//   ],
//   rules: {
//     '@typescript-eslint/no-unused-vars': 'off',
//     '@typescript-eslint/no-unsafe-assignment': 'off',
//     'no-undef': 'off',
//     'vue/html-self-closing': [
//       'error',
//       {
//         html: {
//           void: 'never',
//           normal: 'always',
//           component: 'always',
//         },
//       },
//     ],
//   },
// }

module.exports = {
  extends: ['@antfu'],
}
