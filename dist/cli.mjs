#!/usr/bin/env node
import 'tsx/esm';
import { cli } from 'cleye';
import eslintApi from 'eslint/use-at-your-own-risk';
import { f as findUp } from './index-0090162b.mjs';
import { pvtnbr } from './index.mjs';
import 'node:process';
import 'node:fs/promises';
import 'node:url';
import 'node:fs';
import 'node:path';
import 'module';
import '@eslint/js';
import 'globals';
import 'confusing-browser-globals';
import '@eslint-community/eslint-plugin-eslint-comments';
import '@stylistic/eslint-plugin';
import 'url';
import 'eslint-plugin-import';
import '@typescript-eslint/eslint-plugin';
import '@typescript-eslint/parser';
import 'eslint-plugin-regexp';
import 'eslint-plugin-n';
import 'read-package-up';
import 'eslint-plugin-promise';
import 'eslint-plugin-markdown';
import 'eslint-plugin-jsonc';
import 'eslint-plugin-no-use-extend-native';
import 'eslint-plugin-unicorn';
import 'eslint-plugin-react';
import 'eslint-plugin-react-hooks';
import 'get-tsconfig';
import 'fs';
import 'eslint-plugin-vue';
import 'vue-eslint-parser';

const getConfig = async () => {
  const configFilePath = await findUp("eslint.config.ts") ?? await findUp("eslint.config.js");
  if (configFilePath) {
    const configModule = await import(configFilePath);
    if (configModule.default) {
      return configModule.default;
    }
  }
  return pvtnbr();
};
const argv = cli({
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
