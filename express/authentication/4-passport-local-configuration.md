# Passport Local Configuration

One dependency being included (which is built into `node` is the `crypto` library) - not sure if I already have this required into my express app?

- as of 12/24/2020 at 5:06 PM EST, do not have `crypto` required in `expense-tracker`

## Passport Local Strategy

First, will define the `verify` callback

- in video, importing `passport`, `passport-local`, db connection client/pool object, and a model for a `user` for a mongo database

Define `passport.use(...stuff)` - roughly looks like below (snippet is from docs at `http://www.passportjs.org/docs/configure/`)

```js
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);
```

Video goes on to break the above example snippet into more digestible chunks:

```js
// verifyCallback corresponds to function passed into new LocalStrategy instantiation
// the "done" parameter is a function that you will eventually pass the results of authenticating a user to
const verifyCallback = (username, password, done) => {};

const strategy = new LocalStrategy(); //corresponds to argument passed to passport.use seen above
```
