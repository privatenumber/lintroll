
<p align="center">
	<img src="./.github/logo.png" width="240">
</p>
<h2 align="center">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ESLint config <sup>by pvtnbr</sup>
</h2>


- Forked from [Airbnb's ESLint config](https://github.com/airbnb/javascript/tree/master)

- Single quotes + semicolons



- Code vertically: we have more space vertically than horizontally, so use it generously


- Lints JavaScript, TypeScript, React, Vue.js code (also in code blocks in Markdown files!)

- Supports import map resolution

- Plugins:


- What does good code look like?



## Install

```sh
npm install --save-dev @pvtnbr/eslint-config
```

## Setup

The configuration is exported in [flat format](https://eslint.org/docs/latest/use/configure/configuration-files-new), which requires it to be in the `eslint.config.js` file at your project root.

### Quick usage


#### CLI

#### ESLint

In `eslint.config.js`:

```js
export { default } from '@pvtnbr/eslint-config'
```

### Configuration

In `eslint.config.js`:

```js
console.log(1)
```
