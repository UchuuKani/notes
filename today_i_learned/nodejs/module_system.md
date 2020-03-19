# Node Module System using require(...)

When a module is imported into another file, any expressions in the imported file get evaluated it seems. For example if I have a `secrets.js` file in the root of my project that looks like this,

```javascript
process.env.SOME_VAR = 15;

console.log("hi from secrets");

function testFunc(variable) {
  return variable;
}

console.log(testFunc("cat"));
```

and if I import the whole `secrets.js` file into the file where I set up some Express app (also in the same level of the file structure, and probably not specific to Express itself but this was where I tested this behavior) by doing

```javascript
var express = require("express");
require("secrets");

var app = express();
// some other stuff
console.log(process.env.SOME_VAR);
// some other stuff
```

then the order of logging in my terminal window is as follows:

```markdown
hi from secrets
cats
15
```

From this behavior, the previous assumption that the imported file gets executed in order on import - so first, an environment variable is set on Node's process object as `process.env.SOME_VAR = 15`, the `"hi from secrets"` string is logged, and finally `"cats"` is logged. Later on in my Express app file, I log `process.env.SOME_VAR` and `15` is logged as everything is executed from top to bottom in the file.
