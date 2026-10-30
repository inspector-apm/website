module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-clean-order',
    'stylelint-config-html/astro',
  ],
  plugins: ['stylelint-order'],
  rules: {
    'function-no-unknown': null,
    'selector-class-pattern': '^[A-Za-z0-9]+$',
    // scss @if issue fix
    'at-rule-empty-line-before': null,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
  },
};
