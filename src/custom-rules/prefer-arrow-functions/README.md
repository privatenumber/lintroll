# Prefer arrow functions

This ESLint rule encourages the use of arrow functions (`() => {}`) over traditional `function () {}` syntax whenever possible.


## Why prefer arrow functions?

Arrow functions are more concise and have fewer features compared to regular functions. Notably, they do not support `this` and `arguments`. By defaulting to arrow functions when possible, the code signals that it's simpler and easier to understand.

When you encounter an arrow function, you can quickly assume it's straightforward. Conversely, when you encounter traditional `function () {}` syntax, you can expect it to be more complex and requiring closer attention.

## Behavior

This rule generates warnings when traditional function syntax (`function () {}`) is used when it could be replaced with arrow function syntax (`() => {}`). The fixes preserve comments, whitespace, and types.


### Examples of passing code
```js
// Arrow functions are allowed
(() => {});
(async () => {})

const foo = () => {}
export const bar = () => {}
export default () => {}

// Ignores references to this, arguments, and new.target
(function () {
    this;
    (() => this)

    arguments;
    (() => arguments)

    new.target;
    (() => new.target)
});

// Object getters & setters
({
    get foo() { return value },
    set foo(value) {}
})

// Class definition
class myClass {
    constructor() {}

    accessSuper() {
        super.foo()
    }

    * generator() {}

    get foo() { return value }

    set foo(value) {}

    arrow = () => {}
}

// Prototype setting and function properties
function myFunction() {
    return myFunction.name
}
myFunction.myFunctype = {}
myFunction.name
myFunction.length

// Ignores generators
function* generator() {}
async function* asyncGenerator() {}

// Hoisting
hoisted()
function hoisted() {}
```


### Examples of failing code

<!-- eslint-disable pvtnbr/prefer-arrow-functions -->
```ts
/* Function declarations */
function foo() {}
// Fixed: const foo = () => {}

async function bar() {}
// Fixed: const foo = async () => {}

/* Function with comments */
function/* a */baz/* b */()/* c */ {}
// Fixed: const /* a */ baz /* b */ = /* c */ () => {}

/* Function expressions */
(async function () {})
// Fixed: (async () => {})

/* Object properties */
const object = {
    method() {}
}
// Fixed: { method: () => {} }

/* Classes */
class MyClass {
    method() {}
}
// Fixed: class MyClass { method = () => value }

/* Exports */
export function namedExport() {}
// Fixed: export const namedExport = () => {}

export default function defaultExport() {}
// Fixed: export default () => {}

/* TypeScript */
function typescript<T extends string>(a: T) {}
// Fixed: const typescript = <T extends string>(a: T) => {}
```
<!-- eslint-enable pvtnbr/prefer-arrow-functions -->

### Limitations
This rule will not generate warnings or fixes for traditional functions that use any of the following features:

#### Inside function body
- [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)
- [`function*`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
- [`new.target`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)
- [`super`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super)

#### Function properties
- [`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
- [`length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
- [`prototype`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype)

#### Declaration style
- [Hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#hoisting)
- [`get`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [`set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)
- [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)


> [!WARNING]  
> This rule only detects these flags within the file. This may be lead to false positives, for example when the functions are exported and the `.length` property is checked in another file.
