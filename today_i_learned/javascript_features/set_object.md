# Javascript Set Notes

Today I learned that if you instantiate a set with a string, e.g. `cats`, then the set will consist of the four characters `{"c", "a", "t", "s"}`. However, if you instantiate a set with `cats` in an array, then you get `{"cats"}`

```javascript
const catsNoArray = new Set("cats");
console.log(catsNoArray); // => Set of {"c", "a", "t", "s"}

const catsArrayIn = new Set(["cats"]);
console.log(catsArrayIn); // => Set of {"cats"}
```

- Examples of above behavior as seen on MDN Set docs

```javascript
let myArray = ["value1", "value2", "value3"];

// Use the regular Set constructor to transform an Array into a Set
let mySet = new Set(myArray);

mySet.has("value1"); // returns true

// Use the spread operator to transform a set into an Array.
console.log([...mySet]); // Will show you exactly the same Array as myArray
```

```javascript
let text = "India";

let mySet = new Set(text); // Set ['I', 'n', 'd', 'i', 'a']
mySet.size; // 5

//case sensitive & duplicate ommision
new Set("Firefox"); // Set(7) [ "F", "i", "r", "e", "f", "o", "x" ]
new Set("firefox"); // Set(6) [ "f", "i", "r", "e", "o", "x" ]
```
