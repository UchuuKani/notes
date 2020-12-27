# What is Express Middleware

Say we create a simple `express` app like this:

```js
const expres = require("expresS");
const app = express();

// this is a more transparent version of the callback passed into app.get
function standardExpressCallback(
  requestObject,
  responseObject,
  nextMiddleware
) {
  // the nextMiddleware parameter is a function that just passes data to next middleware in the chain
  console.log("standardExpressCallback");
  responseObject.send("<h1>Hello</h1>");
}

app.get("/", standardExpressCallback);

// this is the same thing as passing standardExpressCallback as a function to app.get("/", ...);
// app.get("/", (req, res, next) => {
//   res.send("<h1>Hello</h1>");
// });

app.listen(3000);
```

In addition to the `standardExpressCallback` defined above (which is just middleware?), we can define other middleware in the same fashion:

```js
function middlewareOne(req, res, next) {
  console.log("this is middleware");
}
```

and pass the middleware into the `app.get` call `app.get("/", middlewareOne, standardExpressCallback)`

- note that we don't currently call `next` in our middleware definition, so the request would hang when hitting `"/"` route
- also note, in this case we are passing a route-specific middleware directly into a route, but it is also possible to use global middleware
  - to use a middleware globally, need to pass it to `app.use`, so can do `app.use(middlewareOne)` above the routes that need the middleware
  - note that the global middleware doesn't fire off immediately when starting the express server, but instead is just like adding the middleware directly in the chain
    - would need to have a route get run for the global middleware to run

---

## Error-handling Middleware in Express

Simply defined with with a function like `function errorHandler(err, req, res, next) {...check error status or something}` where the `err` parameter is an error object

- if passing an argument to `next` function, the error is thrown (is this correct?). Want to be able to handle the error in a more robust way than default error response that `express` will send to the client. Can do so by defining an error-handling `app.use` call at the end of the middleware chain

---

## Appending Properties to Request and Response objects

Note that in each middleware, we can mutate the response and request objects and those changes will be available to middlewares lower down in the chain
