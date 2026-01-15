// String property named 'size' should not trigger explicit-length-check
// https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1266
const props = { size: 'medium' };
const size = props.size || 'large';

export { size };
