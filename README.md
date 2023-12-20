
<p align="center">
	<img src="./.github/logo.webp" width="240">
</p>
<h2 align="center">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ESLint config <sub><em>by pvtnbr</em></sub>
</h2>

This ESLint configuration was originally forked from Airbnb's ESLint config, taking inspiration from their comprehensive [JavaScript style guide](https://github.com/airbnb/javascript).

It's been enhanced with plugins, cutting edge tooling, and offers a comprehensive linting solution for a wide range of JavaScript ecosystems, including TypeScript, React, Vue.js, and Markdown code blocks.

### Features

- **Streamlined syntax**: Single quotes, semicolons, tabs, and arrow functions for a clear & intentional coding style.

- **Versatile language support**: Tailored for TypeScript, React, Vue.js, and even Markdown code blocks, ensuring a wide range of applications.

- **Handy CLI command** Comes with a quick and easy-to-use CLI command, which even supports `eslint.config.ts`.

- **Extended plugin support**: A rich set of plugins to lint ESlint comments, imports, JSON, YAML and more.

<!--
### What does the styled code look like?
Playground
-->

## Install

```sh
pnpm i -D @pvtnbr/eslint-config
```

## Quick usage

This package includes a streamlined `lint` CLI command. It's is a direct alternative to `eslint`, allowing you to lint your code with this config without the need for any configuration.

#### Lint files in the current directory

```sh
pnpm lint .
```

#### Apply auto fix

```sh
pnpm lint . --fix
```

#### Lint with caching enabled
```sh
pnpm lint --cache .
```

#### Add it to your `package.json` scripts

In addition to documenting the available commands in a central place, adding it to `package.json#scripts` also gives you the convenience of not needing to pass in the current directory (`.`) every time so you can simply run `pnpm lint` instead.

```diff
  "scripts": {
+   "lint": "lint .",
    "build": "..."
    "dev": "..."
  }
```

### Configuration

If you'd like to customize the linting rules further, you can add one of these ESLint config files to your project root and `lint` will detect them automatically:

- `eslint.config.ts`: The typed version of the configuration file, ideal if you are working with TypeScript.

- `eslint.config.js`: A standard JavaScript file for ESLint configuration, suitable for projects not using TypeScript.

Note: when creating an ESLint config file, you must manually add the `pvtnbr` config. Read the section below to learn how.

## ESLint setup

When using `eslint`, the [flat configuration format](https://eslint.org/docs/latest/use/configure/configuration-files-new) requires that a `eslint.config.js` is created at your project root. This file is used to configure ESLint, and is where you can add the `pvtnbr` config.

> [!TIP]
> If you're using TypeScript, you can use `eslint.config.ts` with the `lint` command from the previous section.

### Simple config
If you want a simple setup with no customizations, create the following `eslint.config.js`:

Module:
```js
export { default } from '@pvtnbr/eslint-config'
```

CommonJS:
```js
module.exports = require('@pvtnbr/eslint-config')
```

### Extended config

If you're using TypeScript, you can add [`@ts-check`](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#ts-check) to the top of the file to enable type checking.

In `eslint.config.js`:

Module:
```js
// @ts-check

import { defineConfig, pvtnbr } from '@pvtnbr/eslint-config'

export default defineConfig([
    {
        // Don't lint these files
        ignores: [
            'tests/fixtures/**/*'
        ]
    },

    // Configure the pvtnbr config
    ...pvtnbr({

        // Indicate Node.js project
        node: true,

        // Indicate Vue.js project (auto-detected by default)
        vue: true
    })

    // Other configs...
])
```

CommonJS:
```js
// @ts-check

const { defineConfig, pvtnbr } = require('@pvtnbr/eslint-config')

module.exports = defineConfig([
    {
        // Don't lint these files
        ignores: [
            'tests/fixtures/**/*'
        ]
    },

    // Configure the pvtnbr config
    ...pvtnbr({

        // Indicate Node.js project
        node: true,

        // Indicate Vue.js project (auto-detected by default)
        vue: true
    })

    // Other configs...
])
```


## API

### pvtbr(options)

The main config factory. It takes an object of options and returns a config object.

#### options.node

Type: `boolean`
Default: `false`

Whether to lint Node.js code.

#### options.vue

Type: `boolean`
Default: `isInstalled('vue')`

Whether to lint Vue code.

#### options.react

Type: `boolean`
Default: `isInstalled('react')`

Whether to lint React code.

### defineConfig(configs)

An identity function to enforce type checking on the config.

#### configs

Type: `FlatConfig | FlatConfig[]`

## Dependencies
- Plugins:
	- [eslint-comments](https://www.npmjs.com/package/@eslint-community/eslint-plugin-eslint-comments): Lints ESLint comments
	- [node](https://www.npmjs.com/package/eslint-plugin-n): Lints Node.js
	- [@typescript-eslint](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin): Lints TypeScript
	- [@stylistic](https://www.npmjs.com/package/@stylistic/eslint-plugin): Lints JS code style
	- [prefer-arrow-functions](https://www.npmjs.com/package/eslint-plugin-prefer-arrow-functions): Lints function style
	- [promise](https://www.npmjs.com/package/eslint-plugin-promise): Lints Promises
	- [regexp](https://www.npmjs.com/package/eslint-plugin-regexp): Lints Regular Expressions
	- [import](https://www.npmjs.com/package/eslint-plugin-import): Lints imports
	- [jsonc](https://www.npmjs.com/package/eslint-plugin-jsonc): Lints JSON & JSONC
    - [yml](https://www.npmjs.com/package/eslint-plugin-yml): Lints YAML
	- [vue](https://www.npmjs.com/package/eslint-plugin-vue): Lints Vue.js
	- [react](https://www.npmjs.com/package/eslint-plugin-react) & [react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks): Lints React
	- [markdown](https://www.npmjs.com/package/eslint-plugin-markdown): Lints Markdown
	- [no-use-extend-native](https://www.npmjs.com/package/eslint-plugin-no-use-extend-native): Lints native prototypes
	- [unicorn](https://www.npmjs.com/package/eslint-plugin-unicorn): Miscellaneous linting rules

## Other ESLint configs

Also check out these awesome ESLint configs. They have inspired me and are great alternatives to consider.

- [@antfu](https://github.com/antfu)'s ESLint config: [antfu/eslint-config](https://github.com/antfu/eslint-config)
- [@sxzz](https://github.com/sxzz)'s ESLint config: [sxzz/eslint-config](https://github.com/sxzz/eslint-config)
- [@ota-meshi](https://github.com/ota-meshi)'s ESlint config & plugin: [@ota-meshi/eslint-plugin](https://github.com/ota-meshi/eslint-plugin)
- [standard config](https://github.com/standard/eslint-config-standard)

Hope they also inspire you to create your own ESLint config!
