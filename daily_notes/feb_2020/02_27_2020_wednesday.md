# Wednesday February 26th, 2020

## List of Algos to Go Over / Attempt Again

- Flatten Multi-level Linked List
- Walls and Gates
- LRU Cache
- 1-D Candy Crush
- Move Zeroes (faster than O(n) possible?)
- Min Stack

- Decode String (I didn't attempt yet but someone did - turns out it was just me and Peter trying to translate one of the Discussion solutions from Java to JS)

## Flatten Linked List Iterative Solution

```javascript
function Node(val, prev, next, child) {
  this.val = val;
  this.prev = prev;
  this.next = next;
  this.child = child;
}

function flatten(head) {
  if (head === null) return head;

  const dummyHead = new Node(0, null, head, null);
  let curr = head;
  let prev = head;

  const stack = [];
  stack.push(head);

  while (!stack.length) {
    // iterate while stack is not empty
    curr = stack.pop();
    prev.next = curr;
    curr.prev = prev;

    if (curr.next !== null) stack.push(curr.next);
    if (curr.child !== null) {
      stack.push(curr.child);
      curr.child = null;
    }
    prev = curr;
  }

  dummyHead.next.prev = null; // reassign head.prev to be null
  return dummyHead.next;
}
```
