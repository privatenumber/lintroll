'use strict';

var fs = require('node:fs');
var index = require('../index-58f2e892.cjs');
var resolvePkgMaps = require('resolve-pkg-maps');
var getConditions = require('get-conditions');
require('node:process');
require('node:fs/promises');
require('node:url');
require('node:path');

const notfound = Object.freeze({ found: false });
const resolve = (source, file) => {
  if (source[0] === "#") {
    const packageJsonPath = index.findUpSync(
      "package.json",
      { cwd: file }
    );
    if (!packageJsonPath) {
      return notfound;
    }
    const pacakageJsonString = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(pacakageJsonString);
    if (!packageJson.imports) {
      return notfound;
    }
    const result = resolvePkgMaps.resolveImports(
      packageJson.imports,
      source,
      getConditions.getConditions()
    );
    if (!result || result.length === 0) {
      return notfound;
    }
    return {
      found: true,
      path: result[0]
    };
  }
  return notfound;
};
const interfaceVersion = 2;

exports.interfaceVersion = interfaceVersion;
exports.resolve = resolve;
