# Prefer arrow functions

This rule prefers the use of arrow functions `() => {}` over traditional `function () {}` when possible.

## Why?

Arrow functions are more concise and have minimal features compared to regular functions. Adopting arrow functions as the default function syntax allows readers to quickly grasp the functionality and limitations of the code.

For example, when you see arrow function syntax, you can assume less complexity. Conversely, the traditional `function () {}` syntax might imply more complex features like using `this`, handling `arguments`, or modifying `prototypes` and require keeping a larger mental model of the code.

Noticing these differences may even help make better design choices. For example, if you have an arrow function in a `class`, do you really need that method on the class? Should it leverage `this`? If not, should it be a static method?

## Behavior

Preserves comments, whitespace, and types.

### Passing code
```js
// Allows arrow functions
(() => {});
(async () => {})

const foo = () => {}
export const bar = () => {}
export default () => {};

// Ignores this, arguments, new.target
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

// Class
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
function proto() {}
proto.prototype = {}
proto.name
proto.length

// Ignores generators
function* generator() {}
async function* asyncGenerator() {}

// Hoisting
hoisted()
function hoisted() {}
```


### Failing code
TODO: disable this rule for this block
```ts
/* Function declarations */
const foo = () => {}
// Fixed: const foo = () => {}

const bar = async () => {}
// Fixed: const foo = async () => {}

/* Function with comments */
const/* a */baz = /* b */() =>/* c */ {}
// Fixed: const/*a*/foo=/*b*/()=>/*c*/{}

/* Function expressions */
(async () => {})
// Fixed: (async () => {})

/* Object properties */
const object = {
    method: () => {}
}
// Fixed: { method: () => {} };

/* Classes */
class MyClass {
    method() => value
}
// Fixed: class MyClass { method = () => value }

/* Exports */
export const namedExport = () => {}
// Fixed: export const myFunction = () => {}

export default () => {}
// Fixed: export default () => {}

/* TypeScript */
const typescript = <a extends string>(a: a) => {}
// Fixed: const foo = <a extends string>(a: a) => {}
```

### Limitations
This rule will not warn or fix functions if it detects that the function uses any of these features:

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
- [`hoisting`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#hoisting)
- [`getter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [`setter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)
- [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)


> [!WARNING]  
> This rule only detects these flags within the file. This may be lead to false positives, for example when the functions are exported and the `.length` property is checked in another file.
