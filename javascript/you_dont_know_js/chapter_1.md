## Get Started - Chapter 1

- Polyfill is the act of providing a definition for some missing API method not present in older environments (e.g. browsers) that stands in and acts as if the older environment already had it natively defined. Also called a "shim"

## Get Started - Chapter 2: Surveying JS

### Each File is a Program

---

- In JS, each standalone file is its own separate program.

### ES Modules

- Modules are defined in a file, and can be considered `singletons` - they are not instantiated, just imported. There is only one instance ever created, at first import in your program, then all other imports receive a reference to that same single instance.
  -An example of using modules, along with classic JS modules (I guess factory functions) is as follows:

this is the file `publication.js`

```javascript
function printDetails(title, author, pubDate) {
  console.log(`
        Title: ${title}
        By: ${author}
        ${pubDate}
    `);
}

export function create(title, author, pubDate) {
  var publicAPI = {
    print() {
      printDetails(title, author, pubDate);
    }
  };

  return publicAPI;
}
```

To import and use this module, from another ES module like `blogpost.js`:

```javascript
import { create as createPub } from "publication.js";

function printDetails(pub, URL) {
  pub.print();
  console.log(URL);
}

export function create(title, author, pubDate, URL) {
  var pub = createPub(title, author, pubDate);

  var publicAPI = {
    print() {
      printDetails(pub, URL);
    }
  };

  return publicAPI;
}
```

And finally, to use this module, we import into another ES module like `main.js`:

```javascript
import { create as newBlogPost } from "blogpost.js";

var forAgainstLet = newBlogPost(
  "For and against let",
  "Kyle Simpson",
  "October 27, 2014",
  "https://davidwalsh.name/for-and-against-let"
);

forAgainstLet.print();
// Title: For and against let
// By: Kyle Simpson
// October 27, 2014
// https://davidwalsh.name/for-and-against-let
```