# Wednesday, January 29th, 2020

## LeetCode # 328 - Odd Even Linked List

### My Approach

- First check to make sure that the list is greater than two elements long
  - If it isn't just return the head since list will already be sorted
- Otherwise, initialize variables to hold references to even nodes (`temp`), the current node (`current`, only ever the odd nodes in the list) and one to reference the first even node in the list (`firstEven`) so that the last odd can be linked to the first even node

- Iterate through the list while the current node is not the last one in the list

  - break out of the loop if the current odd node that we're on is the last one in the list, otherwise:

  - assign `temp` to be `current`'s `next` since that is the next even node in the list
  - assign `current.next` to be `temp`'s next since that will be the next odd node in the list
  - assign `temp.next` to be `current.next.next`, which is the next even node in the list

- Once finished iterating, assign `current.next` (at this point, it is the last odd node in the list) to be `firstEven`, the first even node in the list
- Return head of the list

- Operates in O(n) time since we need to traverse just before the end of the list to assign everything
- Uses O(1) space as no extra data structures are created, variables are only assigned to a single node at a time

```javascript
var oddEvenList = function(head) {
  if (!head || !head.next) {
    //empty or one element list
    return head;
  } else if (head.next) {
    if (!head.next.next) {
      //two element list
      return head;
    }
  }

  const firstEven = head.next;
  let current = head;
  let temp = null;

  while (current.next) {
    if (!current.next.next) {
      break;
    }
    temp = current.next;
    current.next = temp.next;

    if (current.next) {
      temp.next = current.next.next;
    }

    current = current.next;
  }

  current.next = firstEven;

  return head;
};
```

### LC Approach # 3
