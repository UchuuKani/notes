# Wednesday, February 5th, 2020

## Thoughts from Bloomberg Phone Screen at 12:15 PM

### Technical

- First question: Given two strings of equal length, determine how many changes must be made to turn the first string into an anagram of the second

  - My approach was create hash table of second string with counts of characters, iterate through first string and decrement from hash table for every character found in first string
  - Add up absolute values of all counts after decrementing and return the number

- Second question: Given a string representing a binary number, e.g. "001" and possible wild cards (represented as "?") in the string that can be represented as a 0 or a 1, return the number of permutations possibly created by the input string
  - I was observing that output seems to be dependent on number of wild cards and number of non-wild cards did not matter
  - Eventually, interviewer gave hint and affirmed that recursive trees should be part of the solution, though I did not get much farther than that
  - Overall, feel like this did question did not go well

#### Take Away

- Think I should try solving an algo where I have to build of a tree of choices (CS Dojo reviews a problem where you have to do so I believe, Robbing Houses?) - may have to implement memoization?

### Behavioral

- Was asked to give my pitch - I feel like I kind of rambled a bit at the WVA being old-fashioned part and about how I got into programming because of it
- Asked about a project that I thought helped me grow a bit and talked about Grace Jammer (Grace Shopper). Was asked specifically about a part that I think was challenging for me - I said deciding on how to code out updating cart quantities, but I felt I was not very concise or clear with my explanation. Kind of jumped between how I wasn't sure how we should handle the cart quantity updating in the database when items are added as the technical challenge, and how the DB schema was a challenge for the team overall, not me specifically

## Project Work - Expense Tracker

- Looked up some examples of React hooks in larger open-source projects, have references bookmarked under `React` bookmarks in VM
- Last task accomplished:

  - Built out form to submit new a new transaction with `Description` and `Amount` fields

- TODO:

  - Currently the form does not do anything on submit, need to build out back-end `POST` route to save transaction to DB (transactions) for specific user, try to create any tags associated with the submitted transaction (tags), and create association between transaction and tags (transactions-tags)
  - Looking into using UPSERT with unique constraint to create tags if not already in tags table
  - **NOTE**: probably need to create a `transactions` route so that I can `GET` tags associated with an individual transaction, `PUT` to update tags associated with a transaction, other actions to be decided

## VIM

- Shortcut to move to beginning of line is `0`
- Shortcut to move to end of line is `$`
- Shortcut to move to top of file is `gg`
- Shortcut to move to bottom of file is `G`
