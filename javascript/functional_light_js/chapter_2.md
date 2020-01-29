# The Nature of Functions

## What is a Function

---

### Brief Math Review

- "In math, a function always takes input(s), and always gives an output. A term you'll often hear around FP is "morphism"; this is a fancy way of describing a set of values that maps to another set of values, like the inputs of a function related to the outputs of that function."

### Function vs Procedure

- "You may be more accustomed to thinking of functions as procedures. What's the difference? A procedure is an arbitrary collection of functionality. It may have inputs, it may not. It may have an output (return value), it may not."
- "A function takes input(s) and definitely always has a return value."
- "If you plan to do Functional Programming, you should be using functions as much as possible, and trying to avoid procedures wherever possible. All your functions should take input(s) and return output(s)."
- Above will be explained throughout the book

## Function Input

---

- "_Arguments_ are the values you pass in, and _parameters_ are the named variables inside the function that receive those passed-in values. Example:"

```javascript
function foo(x, y) {
  // ..
}

var a = 3;

foo(a, a * 2);
```

- "`a` and `a * 2` (actually, the result of `a * 2`, which is `6`) are the arguments to the `foo(..)` call. `x` and `y` are the parameters that receive the argument values (`3` and `6`, respectively).

## Counting Inputs

---

- "The number of arguments a function "expects" is called `arity`. Arity is the number of parameters in a function declaration."
- "Furthermore, a function with arity 1 is also called "unary", a function with arity 2 is also called "binary", and a function with arity 3 or higher is called "n-ary"."
- You may wish to inspect a function reference during the runtime of a program to determine its arity. This can be done with the length property of that function reference:

```javascript
function foo(x, y, z) {
  // ..
}

foo.length; // 3
```

- "One reason for determining the arity during execution would be if a piece of code received a function reference from multiple sources, and sent different values depending on the arity of each."
- "For example, imagine a case where an fn function reference could expect one, two, or three arguments, but you always want to just pass a variable x in the last position:"

```javascript
// `fn` is set to some function reference
// `x` exists with some value

if (fn.length == 1) {
  fn(x);
} else if (fn.length == 2) {
  fn(undefined, x);
} else if (fn.length == 3) {
  fn(undefined, undefined, x);
}
```

**Tip**: The `length` property of a function is read-only and it's determined at the time you declare the function. It should be thought of as essentially a piece of metadata that describes something about the intended usage of the function.

```javascript
function foo(x, y, z, ...args) {
  // ..
}
```

- "See the `...args` in the parameter list? That's an ES6 declarative form that tells the engine to collect (ahem, "gather") all remaining arguments (if any) not assigned to named parameters, and put them in a real array named `args`. `args` will always be an array, even if it's empty. But it will not include values that are assigned to the x, y, and z parameters, only anything else that's passed in beyond those first three values:"

```javascript
function foo(x, y, z, ...args) {
  console.log(x, y, z, args);
}

foo(); // undefined undefined undefined []
foo(1, 2, 3); // 1 2 3 []
foo(1, 2, 3, 4); // 1 2 3 [ 4 ]
foo(1, 2, 3, 4, 5); // 1 2 3 [ 4, 5 ]
```

- "You can use the `...` operator in the parameter list even if there's no other formal parameters declared:"

```javascript
function foo(...args) {
  // ..
}
```

- "Now `args` will be the full array of arguments, whatever they are, and you can use `args.length` to know exactly how many arguments have been passed in."

## Arrays of Arguments

- "What if you wanted to pass along an array of values as the arguments to a function call?"

```javascript
function foo(...args) {
  console.log(args[3]);
}

var arr = [1, 2, 3, 4, 5];

foo(...arr); // 4
```

- "Our new friend `...` is used, but now not just in the parameter list; it's also used in the argument list at the call-site. It has the opposite behavior in this context. In a parameter list, we said it gathered arguments together. In an argument list, it spreads them out. So the contents of `arr` are actually spread out as individual arguments to the `foo(..)` call. Do you see how that's different from just passing in a reference to the whole `arr` array?"
- "By the way, multiple values and `...` spreadings can be interleaved, as you see fit:"

```javascript
var arr = [2];

foo(1, ...arr, 3, ...[4, 5]); // 4
```

- "Think of `...` in this symmetric sense: in a value-list position, it spreads. In an assignment position -- like a parameter list, because arguments get assigned to parameters -- it gathers."

## Parameter Destructuring

- "Consider the variadic `foo(..)` from the previous section:"

```javascript
function foo(...args) {
  // ..
}

foo(...[1, 2, 3]);
```

- "What if we wanted to change that interaction so the caller of our function passes in an array of values instead of individual argument values? Just drop the two ... usages:"

```javascript
function foo(args) {
  // ..
}

foo([1, 2, 3]);
```

- "Simple enough. But what if now we wanted to give a parameter name to each of the first two values in the passed-in array? We aren't declaring individual parameters anymore, so it seems we lost that ability."
- "Thankfully, ES6 destructuring is the answer. Destructuring is a way to declare a pattern for the kind of structure (object, array, etc.) that you expect to see, and how decomposition (assignment) of its individual parts should be processed."
- "Consider:"

```javascript
function foo([x, y, ...args] = []) {
  // ..
}

foo([1, 2, 3]);
```

- "Do you spot the `[ .. ]` brackets around the parameter list now? This is called array parameter destructuring."
- "In this example, destructuring tells the engine that an array is expected in this assignment position (aka parameter). The pattern says to take the first value of that array and assign to a local parameter variable called `x`, the second to `y`, and whatever is left is gathered into `args`."

## Function Output

- "The `undefined` value is implicitly returned if you have no `return` or if you just have an empty `return;`."
- "But keeping as much with the spirit of FP function definition as possible -- using functions and not procedures -- our functions should always have outputs, which means they should explicitly `return` a value, and usually not `undefined`."
- "Collecting multiple values into an array (or object) to return, and subsequently destructuring those values back into distinct assignments, is a way to transparently express multiple outputs for a function."

- "**Tip**: I'd be remiss if I didn't suggest you take a moment to consider if a function needing multiple outputs could be refactored to avoid that, perhaps separated into two or more smaller single-purpose functions? Sometimes that will be possible, sometimes not; but you should at least consider it."

## Early Returns

- "I'm not unconditionally saying that you should always have a single return, or that you should never do early returns, but I do think you should be careful about the flow control part of return creating more implicitness in your function definitions. Try to figure out the most explicit way to express the logic; that will often be the best way."

## Un`return`ed Outputs

- Basically, prefer to write functions which affect variables outside of their scope - functions should be pure and have no side-effects
