# ESlint

ESLint validates JavaScript code and checks for common syntax errors, undeclared variables, missing brackets, invalid regular expressions, unreachable code, etc.

**Please use it!** It will make your code cleaner and spot problems before you attempt to run the application.

See [eslint.org](https://eslint.org/).


## Installation

Install globally using:

```bash
npm i -g eslint
```


## Usage

Check any JavaScript file to show a list of issues:

```bash
eslint file.js
```

`eslint -h` provides further command line options.


## Use in VS Code

Install the VS Code ESLint from [marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) or by searching for 'ESLint' in the extensions panel.

Once installed, any errors or warnings are shown in the Problems panel.


## Configuration

By default, ESLint is fussy. Probably too fussy. Fortunately, everything is configurable using an `.eslintrc.json` file.

A custom configuration file can be added to every project. To create it, run `eslint --init` and modify accordingly - [see the rules documentation](https://eslint.org/docs/rules/).

Most projects are likely to use similar settings so you can create a single `.eslintrc.json` file which applies to every project. On Windows, this is saved to `C:\Users\<yourname>\.eslintrc.json`. This is mine:

```json
{
  "parserOptions": {
    "ecmaVersion": 8
  },
  "env": {
    "node": true,
    "browser": true,
    "commonjs": true,
    "es6": true,
    "serviceworker": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-console": [0]
  }
}
```

This uses the recommended settings but sets an indent of two spaces, the Unix linebreak, single quotes, semi-colon line endings, and permits `console.log()` commands.


## File-specific configuration flags

There are may be situations where ESLint shows a problem which you want to disable. For example, your library code uses global variables which are defined in another file. To suppress the `undeclared variables` error, add a list at the top of your file:

```js
// a library function

/* global DBconnection util */

module.exports = function() {

  return util.getUserFromDatabase(DBconnection);

}
```

Or perhaps you want to suppress messages when declaring global variables which are unused in the current file, e.g.

```js
/* eslint-disable no-unused-vars */

// variable not used elsewhere in this file
const cfg = global.cfg = { name: 'my app' };

/* eslint-enable */

// variables used elsewhere in this file
const app = require('express');
```


## Other options

You could also consider using [Prettier](https://prettier.io/) to consistently format code. This can be added as an [ESLint plugin](https://prettier.io/docs/en/eslint.html) so faults such as indentation can be fixed before they are checked.
