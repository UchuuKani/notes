# Sliding Window

## Online Resources

- https://www.geeksforgeeks.org/window-sliding-technique/
- https://levelup.gitconnected.com/an-introduction-to-sliding-window-algorithms-5533c4fe1cc7
- https://medium.com/outco/how-to-solve-sliding-window-problems-28d67601a66

---

## Examples of this Pattern

- LeetCode # 3 - Longest Substring without Repeating Characters
  - Snippet of JS solution implementing sliding window is below (https://leetcode.com/problems/longest-substring-without-repeating-characters/discuss/173877/on-javascript-solution):

```javascript
var lengthOfLongestSubstring = s => {
  const visited = new Set();
  let left = 0;
  let right = 0;
  let res = 0;

  // use sliding window
  while (right < s.length) {
    const currentChar = s.charAt(right);
    // not visited
    if (!visited.has(currentChar)) {
      visited.add(currentChar);
      res = Math.max(res, right - left + 1);
      right++;
    } else {
      visited.delete(s.charAt(left));
      left++;
    }
  }

  return res;
};
```

- My description of this algorithm (updated 2/01/2020):
  - Create a `set` which represents the current characters being checked in a window
  - Start pointers for `left` of window and `right` of window equal to 0 since a single character is a valid substring, and a `result` variable to point to greatest substring length found so far
  - Iterate while the `right` pointer is in bounds of our string
    - Check if my current `right` character is in the `set`:
      - If it isn't, add the character to the `set` of visited characters for the current window, check if the last unique window size is greater, or if the current one is and increment the `right` window position
      - Else, if the `right` character is part of the set of characters visited so far, remove the `left` window character from the `set` as it can't be used to form a valid window and increment `left`
        window position to see if a valid substring can be formed
  - After iterating, return the `result`

## Basis of Pattern

- Not really sure how to implement still

## Current Take Aways

- For a problem like finding longest length of unique (use a set) substring (sliding window that updates characters in the set?), seems like one approach is to use a set and adjust its contents as you traverse the string and check different windows
