# Prefer arrow functions

This ESLint rule encourages the use of arrow functions (`() => {}`) over traditional `function () {}` syntax whenever possible.


## Why prefer arrow functions?

Arrow functions are more concise and have fewer features compared to regular functions. Notably, they do not support `this` and `arguments`. By defaulting to arrow functions when possible, the code signals that it's simpler and easier to understand.

When you encounter an arrow function, you can quickly assume it's straightforward. Conversely, when you encounter traditional `function () {}` syntax, you can expect it to be more complex and requiring closer attention.

## Behavior

This rule generates warnings when traditional function syntax (`function () {}`) is used when it could be replaced with arrow function syntax (`() => {}`). The fixes preserve comments, whitespace, and types.


### Examples of passing code
<!-- eslint-disable pvtnbr/no-function-hoisting -->
```ts
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

// Class definition (class methods are only converted with `classMethods: true`)
class myClass {
    constructor() {}

    method() {}

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

// Constructors
function Constructor() {}
new Constructor()

// Ignores generators
function* generator() {}
async function* asyncGenerator() {}

// Hoisting
hoisted()
function hoisted() {}

// Reassignment
function reassigned() {}
reassigned = otherFunction

// TypeScript overloads and `this` parameters
function overloaded(value: string): void
function overloaded(value: unknown) {}

function withThis(this: Window) {}
```
<!-- eslint-enable pvtnbr/no-function-hoisting -->


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

/* Classes (with `classMethods: true`) */
class MyClass {
    method() {}
}
// Fixed: class MyClass { method = () => {} }

/* Exports */
export function namedExport() {}
// Fixed: export const namedExport = () => {}

export default function defaultExport() {}
// Fixed: const defaultExport = () => {}; export default defaultExport

/* Operands are wrapped in parentheses when needed */
const callback = function () {} as Callback
// Fixed: const callback = (() => {}) as Callback

/* TypeScript */
function typescript<T extends string>(a: T) {}
// Fixed: const typescript = <T extends string>(a: T) => {}

/* TSX: a trailing comma keeps the type parameter from parsing as JSX */
function tsx<T>(a: T) {}
// Fixed: const tsx = <T,>(a: T) => {}
```
<!-- eslint-enable pvtnbr/prefer-arrow-functions -->

## Options

### `classMethods`

Type: `boolean`

Default: `false`

Converts class methods to arrow function class fields. This is off by default because the conversion changes behavior: the method moves from the prototype to each instance, so subclasses can no longer override it or call it with `super`.

```js
export default [{
    rules: {
        'pvtnbr/prefer-arrow-functions': ['error', { classMethods: true }]
    }
}]
```

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

#### Constructor usage
- [`new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
- [`extends`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)

#### Declaration style
- [Hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#hoisting)
- Reassigning the function, or declaring the same name more than once (including `var` and TypeScript overloads)
- Declarations used as the body of `if` or a label, where `const` is not allowed
- [`get`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [`set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)
- [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)
- Class methods, unless `classMethods` is enabled. Overloaded or decorated class methods are never converted.

#### TypeScript
- [`this` parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)
- [Assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) (`asserts value`) and `never` return types. TypeScript only uses them to narrow types and detect unreachable code when the function is a declaration.


> [!WARNING]  
> This rule only detects these flags within the file. This may be lead to false positives, for example when the functions are exported and the `.length` property is checked in another file.
