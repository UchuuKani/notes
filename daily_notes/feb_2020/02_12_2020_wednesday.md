# Wednesday February 12th, 2020

## LC # 430 - Flatten a Multilevel Doubly Linked List

### My Approach

- Use a stack to maintain correct order while iterating over list, and a map to keep track of next pointers for nodes that have children
- Iterate over list starting from head
  - Pop node from stack
  - Check if it has a child
    - If so, set entry into map as (node, node.next), reassign pointers for current node, put current node back onto stack, and then put child onto stack
    - If not, just put `node.next` onto stack
  - Handle cases for when hitting the end of a sub-linked list, as well as reassigning a node's next to be its `child` if the node exists
- Approach is a little unwieldy when handling edge cases, and overall a little complicated but still want to try to make it work because it seems reasonable

### LC Approach

- Consider the list as a binary tree and perform pre-order traversal (root, left, right). Left can be considered `child` pointer, and right may be considered `next` pointer

### Take Away

- When looking at seemingly obscure or unknown data structures, may be easier to think about in terms of existing basics such as linked lists, binary trees

## LC # 1029 - Two City Scheduling

### My Approach

- Was thinking can calculate costs associated with every combination, and memoize duplicate / non-unique combos (e.g. [0, 1] and [1, 0] would have same cost)
- Not sure of how to actually code that out
- Seems like it would sort be like a recursive decision tree

### LC Approach

- Sorts the input based on which flights have the least negative loss from flying to `city A` rather than `city B` (e.g. a flight like [50, 500] would come before [100, 70] when sorted since (50 - 500) is much more negative than (100 - 70))
- After sorting, iterate through the array and add the first `n` flight costs for `city A` to the total, and the remaining `n` flight costs for `city B` to the total
  - Can iterate with a for loop that runs up to `n = cities.length / 2` and add costs at `cities[i][0] + cities[i + n][1]`
- Return total

## LC - DB 1075 - Project Employees I

### Correct Query

SELECT project_id, ROUND(AVG(employee.experience_years), 2) AS average_years
FROM employee
INNER JOIN project
ON employee.employee_id = project.employee_id
GROUP BY project.project_id;

- inner joins employee table with project table on employee_id from both tables
- then groups rows by project_id (so can imagine have a bunch of tables where project_id is the same)
- then select the project id, and average years of employee_experience from each project group, rounded to two decimal places

## LC - DB 1076 - Project Employees II

### Correct Query

- Have not created query that finds projects where multiple projects have the same largest employee counts
- Below is current query:

SELECT project_id FROM
(SELECT project_id, COUNT(\*) AS employee_counts
FROM employee
INNER JOIN project
ON employee.employee_id = project.employee_id
GROUP BY project_id
ORDER BY employee_counts DESC
LIMIT 1) s
HAVING MAX(employee_counts);

- A solution from the discussion is below:

```sql
SELECT project_id
FROM project
GROUP BY project_id
HAVING COUNT(employee_id) =
(
SELECT count(employee_id)
FROM project
GROUP BY project_id
ORDER BY count(employee_id) desc
LIMIT 1
)
```

- Makes sense that you can `GROUP BY` immediately after a `FROM` without a `JOIN`, but never occurred to me to do that
