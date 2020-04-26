# My General Understanding of Async in JS

I am writing this document just to be able to review my understanding of async operations and the event loop in the JS runtime as time goes on. Code for these examples will live in the `settimeout_example.js`.

- this was kind of inspired by this blog post: `http://www.robert-drummond.com/2015/04/21/event-driven-programming-finite-state-machines-and-nodejs/`

## April 25th, 2020

In the below code block, we define a `timeOut` function which logs `calling our setTimeout`, calls `setTimeOut` with a callback which logs `executed testFunc` and a timeout of 2000 ms, then finishes by logging `setTimeout was called`.

We also define a function `longLoop` which simply loops from 0 to some number and for each number in the loop, logs it. We then call `timeOut` followed by `longLoop`. The output, while being dependent on how quickly an individual computer can process everything, is assuming that the `longLoop` takes longer to execute than the time out duration of 2000 ms.

My attempt at describing the behavior here is as follows:

- `timeOut` is invoked and the first expression is logged: `calling our setTimeout`
- `setTimeOut` is invoked with a callback called `testFunc` (this callback logs `executed testFunc`) and a timeout of 2000 ms. By doing this, `setTimeOut` places the `testFunc` callback into the callback queue (or is it event loop first? They are not the same I believe) and put a minimum timeout of 2000 ms before `testFunc` will be placed into the call stack
- the second expression in `timeOut` is logged: `setTimeOut was called`

- the `longLoop` function is invoked starting from `i = 0` and going for 10 000 iterations, logging `i` at each iteration
- in the background, the `testFunc` callback is sitting in the callback queue for 2000 ms at the minimum waiting until the call stack is empty to run
  - since

```js
function timeOut() {
  console.log("calling our setTimeout");

  setTimeout(function testFunc() {
    console.log("executed testFunc");
  }, 2000);

  console.log("setTimeout was called");
}

function longLoop() {
  for (let i = 0; i < 10000; i++) {
    console.log(i);
  }
  return null;
}

timeOut();
longLoop();

// order of logging
// "calling our setTimeOut"
// "setTimeOut was called"
// ...0 to 9999 is logged, taking up a frame on the callstack until the for-loop is finished
// ... assuming the logging from 0 to 9999 takes more than 2000 ms to execute, "executed testFunc" is logged immediately after 9999 is logged - so the callback took however long it took for longLoop to be popped off the stack to execute, rather than the base 2000 ms
// if logging up to 9999 took less than the 2000 ms or so to execute, then we would see "executed testFunc" in 2000 ms or so
```

In another test, this time without invoking `longLoop`, we can see that any callback placed into the event queue must still wait for the call stack to be empty until it is executed by calling `setTimeOut` with a timeout of 0 ms. The order of logging is `calling our setTimeOut`, then `setTimeOut was called`, then `blocking the call stack`, and finally `executed testFunc`. What's going on step-by-step:

- we invoke `timeOut` which first logs the expression `calling our setTimeOut`
- `setTimeOut` is invoked with a callback that will log `executed testFunc` and a timeout of 0 ms - the `testFunc` callback is placed into the callback queue and will placed into the call stack once the call stack is empty
- the last expression in `timeOut` is logged saying `setTimeOut was called`

- the expression `blocking the call stack` is logged while `testFunc` is still in the callback queue because it is synchronous code that is executed after `timeOut` is invoked
- once `blocking the call stack` is logged, the call stack is empty, so our `testFunc` callback is finally pushed onto it and executed - `executed testFunc` is finally logged to the screen

```js
function timeOut() {
  console.log("calling our setTimeout");

  setTimeout(function testFunc() {
    console.log("executed testFunc");
  }, 0);

  console.log("setTimeout was called");
}

timeOut();
console.log("blocking the call stack");
```

One last example tests two `setTimeOut` invokations within the same function body. My understanding of what goes in is as follows:

- the first expression `calling first setTimeout with a 10 ms delay` is logged
- `setTimeOut` is invoked with `testFuncOne` as a callback with a delay of `10 ms`. At this point, `testFuncOne` is placed into the callback queue and waiting for a minimum of 10 ms to check if it can be placed onto the call stack
- the second expression `calling second setTimeout with a 0 ms delay` is logged
- `setTimeOut` is invoked with `testFuncTwo` as a callback with a delay of `0 ms`. At this point, `testFuncTwo` is placed into the callback queue and waiting to be placed on the call stack immediately. Since `testFuncOne` is still waiting on its minimum timeout, `testFuncTwo` is placed ahead of it in the callback queue
- since the synchronous code has executed and the call stack is empty, `testFuncTwo` is invoked and `executed testFuncTwo` is logged
- since the call stack is empty and `testFuncOne` is waiting in the callback queue, it is pushed onto the call stack and finally executed to log `executed testFuncOne`

I realize now that I neglected to account for another process happening in the background - the web API/Node API "pool" (not sure of this terminology, just don't know what else it can be called since all the diagrams I see just call label it as `web APIs` and it doesn't quite seem like a queue or stack). This is where callbacks are initially placed when they are registered, and need to stay until being placed into the callback queue. The first callback from this "pool" which is ready to be placed into the callback queue is enqueued.

- in the `doubleTimeOut` example below, `setTimeOut` with a timeout of 10 ms prevents the first callback from being placed in the callback queue before the second callback
- without this other structure, if we only had the callback queue to reason with, I feel like it would be harder/more ambiguous to explain exactly why the callback with a timeout of 0 ms is ran before the one with a timeout of 10 ms.

```js
function doubleTimeOut(firstMs, secondMs) {
  console.log(`calling first setTimeout with a ${firstMs} ms delay`);

  setTimeout(function testFuncOne() {
    console.log("executed testFuncOne");
  }, firstMs);

  console.log(`calling second setTimeout with a ${secondMs} ms delay`);

  setTimeout(function testFuncTwo() {
    console.log("executed testFuncTwo");
  }, secondMs);
}

doubleTimeOut(10, 0);
// the order of logged output
// "calling first setTimeOut with a 10 ms delay"
// "calling second setTimeOut with a 0 ms delay"
// "executed testFuncTwo"
// "executed testFuncOne"
```

**Note:** an interesting but probably ultimately meaningless observation is that if `firstMs` is set to a non-zero number while `secondMs` is 0, `testFuncOne` still sometimes is logged before `testFuncTwo` up to a certain point and the order is subject to change at very low inputs of `firstMs` - in a `repl.it` environment, the cutoff where the order is always fixed with `testFuncOne` first seems to be at a value of `1` for `firstMs`. For any value greater than 1, `testFuncTwo` seems to always be logged first. The underlying reason is lost on me. In my Node environment on my current laptop, the cutoff for `firstMs` seems to be a little higher - none of these were very carefully controlled tests anyway, so who can really say.
