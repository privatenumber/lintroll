'use strict';

require('tsx/esm');
var cleye = require('cleye');
var eslintApi = require('eslint/use-at-your-own-risk');
var index = require('./index-58f2e892.cjs');
var index$1 = require('./index.cjs');
require('node:process');
require('node:fs/promises');
require('node:url');
require('node:fs');
require('node:path');
require('module');
require('@eslint/js');
require('globals');
require('confusing-browser-globals');
require('@eslint-community/eslint-plugin-eslint-comments');
require('@stylistic/eslint-plugin');
require('url');
require('eslint-plugin-import');
require('@typescript-eslint/eslint-plugin');
require('@typescript-eslint/parser');
require('eslint-plugin-regexp');
require('eslint-plugin-n');
require('read-package-up');
require('eslint-plugin-promise');
require('eslint-plugin-markdown');
require('eslint-plugin-jsonc');
require('eslint-plugin-no-use-extend-native');
require('eslint-plugin-unicorn');
require('eslint-plugin-react');
require('eslint-plugin-react-hooks');
require('get-tsconfig');
require('fs');
require('eslint-plugin-vue');
require('vue-eslint-parser');

const getConfig = async () => {
  const configFilePath = await index.findUp("eslint.config.ts") ?? await index.findUp("eslint.config.js");
  if (configFilePath) {
    const configModule = await import(configFilePath);
    if (configModule.default) {
      return configModule.default;
    }
  }
  return index$1.pvtnbr();
};
const argv = cleye.cli({
  name: "lint",
  parameters: ["<files...>"],
  help: {
    description: "by @pvtnbr/eslint-config"
  },
  flags: {
    fix: {
      type: Boolean,
      description: "Automatically fix problems"
    },
    quiet: {
      type: Boolean,
      description: "Report errors only"
    },
    cache: {
      type: Boolean,
      description: "Only check changed files"
    },
    cacheLocation: {
      type: String,
      description: "Path to the cache file or directory"
    }
  }
});
(async () => {
  const { FlatESLint } = eslintApi;
  const eslint = new FlatESLint({
    baseConfig: await getConfig(),
    // Don't look up config file
    overrideConfigFile: true,
    fix: argv.flags.fix,
    cache: argv.flags.cache,
    cacheLocation: argv.flags.cacheLocation
  });
  const results = await eslint.lintFiles(argv._.files);
  if (argv.flags.fix) {
    await FlatESLint.outputFixes(results);
  }
  let resultsToPrint = results;
  if (argv.flags.quiet) {
    resultsToPrint = FlatESLint.getErrorResults(results);
  }
  const formatter = await eslint.loadFormatter();
  const output = await formatter.format(resultsToPrint);
  if (output) {
    console.log(output);
  }
})();
