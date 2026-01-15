// External packages may use non-camelCase exports (e.g. Cloudflare's wrangler)
// ignoreImports: true allows using them without renaming
import { unstable_dev } from 'external-package'; // eslint-disable-line import-x/no-unresolved, n/no-missing-import

// Using the import is allowed
unstable_dev();
