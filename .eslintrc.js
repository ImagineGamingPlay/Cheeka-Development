module.exports = {
    extends: './node_modules/gts/',
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'node/no-unpublished-import': 'off',
        'prettier/prettier': ['error', { endOfLine: 'lf' }],
    },
};
