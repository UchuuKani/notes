# Understanding the express-session Library

How do cookies work with sessions, and what kind of config do we have to do to use the express-session middleware?

## Difference Between a Session and a Cookie

They differ in where their data is stored. A cookie has its data stored in the browser, and the browser will attach a cookie key-value pair to every http request it does.

A session is stored server-side and can store much larger amounts of data than a cookie. Also useful b/c with a cookie user credentials or secrets cannot be stored (not secure), but in a session those things can be stored securely.

## Configuring express-session

To use the middleware, we can write:

```js
app.use(session({ optionsObject }));
```

This can look like:

```js
app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUnitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
```

A session store is basically the persistent memory that we would use to store our sessions in. By default, express-session uses an in-memory store than doesn't get persisted. Ideally, would connect a database to the express-session middleware

When the session middleware fires, it will create a session and a session id which will be stored in a cookie in the browser

## Session Middleware Options

- secret: if the secret is invalid, means the session is too. Not exactly sure how a secret would be invalid? Is it a secret that the cookie has as a value?
- resave and saveUninitialized: options related to what does the session do if nothing has changed? Read docs I guess
- cookie.maxAge - determines how long the cookie is stored for

Basic overview of what happens: when a request is sent by the browser (say a GET request), session middleware (placed above route handlers) is going to initialize a session then create a session id and set a cookie equal to the session id. The cookie will then be placed in the `set-cookie` header and be sent to the browser to set the cookie (by default, cookie key in the browser when using express-session will be `connect.sid`)

Browser will send the cookie with the session id on every request, express-session middleware will read the cookie and its value, and use the value to look up the session id in the session store, check if the session is valid, and if so, use information from the session to authenticate the user, find out some data about the user, or other data.

To see what the actual session looks like, can console.log `express.session` out in the route handler where the user is requesting. Can also directly modify the `req.session` object
