function timeOut() {
  console.log("calling our setTimeout");

  setTimeout(function testFunc() {
    console.log("executed testFunc");
  }, 0);

  console.log("setTimeout was called");
}

function longLoop() {
  for (let i = 0; i < 10000; i++) {
    console.log(i);
  }
  return null;
}

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

// timeOut();
// longLoop();
// console.log("still blocking the callstack");
doubleTimeOut(7, 0);
