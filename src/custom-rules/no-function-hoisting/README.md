# No function hoisting

This ESLint rule reports function declarations that are used before they are defined, and moves them above their first use.

## Why disallow function hoisting?

Function declarations are [hoisted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#hoisting), so they can be called before the line that defines them. Code that relies on this reads out of order: the reader meets a call before the function it calls.

Declaring functions before use also lets [`prefer-arrow-functions`](../prefer-arrow-functions/) convert them to `const` arrow functions, which are not hoisted.

## Behavior

The fix moves the declaration, with the comments directly above it and on its last line, to just before the first statement that uses it. Comments directly above that statement stay attached to it. Moving a function declaration earlier in its own scope does not change behavior, because the function is already defined from the start of the scope.

References inside other functions count. A call from a function body only runs when that function is called, but declaring the helper first keeps the file in reading order.

### Examples of passing code

<!-- eslint-disable pvtnbr/prefer-arrow-functions -->
```ts
function helper() {}
helper()

// Recursion
function recursive() {
    recursive()
}

// Mutual recursion: no order declares both functions first
function isEven(number) {
    return number === 0 || isOdd(number - 1)
}
function isOdd(number) {
    return number !== 0 && isEven(number - 1)
}

// Type-only references
type Helper = typeof typeHelper
function typeHelper() {}
```
<!-- eslint-enable pvtnbr/prefer-arrow-functions -->

### Examples of failing code

<!-- eslint-disable pvtnbr/no-function-hoisting, pvtnbr/prefer-arrow-functions -->
```ts
run()
function run() {}
// Fixed:
// function run() {}
// run()

export const main = () => helper()
function helper() {}
// Fixed:
// function helper() {}
// export const main = () => helper()
```
<!-- eslint-enable pvtnbr/no-function-hoisting, pvtnbr/prefer-arrow-functions -->

### Limitations

- TypeScript overload signatures move together with their implementation, and moved functions are never inserted between another function's signatures and its implementation.
- Other repeated declarations of the same name, such as a `var` or a merged `namespace`, are reported but not fixed.
- A declaration is only moved within its own statement list. If the first use is elsewhere, the error is reported without a fix.
