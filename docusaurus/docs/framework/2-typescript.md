# TypeScript

[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

[Total TypeScript tutorials](https://www.totaltypescript.com/tutorials)

## Installation

Run the following from the root of your course repository:

```bash
npm install -D typescript
```

Then add this file also in the root of your course repository:

```json title="tsconfig.json"
{
  "compilerOptions": {
    /* Base Options: */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": false,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    /* If transpiling with TypeScript: */
    "module": "preserve",
    "sourceMap": true,
    /* If your code runs in the DOM: */
    "lib": ["es2022", "dom", "dom.iterable"],
    // for ES modules
    "rewriteRelativeImportExtensions": true,
    "baseUrl": ".", // Base directory for resolving non-relative module names
    "paths": {
      "/*": ["./*"]
    }
  }
}
```

This is adapted from Matt Pocock's [TSConfig cheat sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet).
