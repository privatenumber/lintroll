import fs from 'node:fs';
import { a as findUpSync } from '../index-0090162b.mjs';
import { resolveImports } from 'resolve-pkg-maps';
import { getConditions } from 'get-conditions';
import 'node:process';
import 'node:fs/promises';
import 'node:url';
import 'node:path';

const notfound = Object.freeze({ found: false });
const resolve = (source, file) => {
  if (source[0] === "#") {
    const packageJsonPath = findUpSync(
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
    const result = resolveImports(
      packageJson.imports,
      source,
      getConditions()
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

export { interfaceVersion, resolve };
