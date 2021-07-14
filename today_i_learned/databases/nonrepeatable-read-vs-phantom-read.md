# Difference between a non-repeatable read and a phantom read?


This came up during the ACID portion of Hussein Nasser database engineering intro course on Udemy
- can maybe reference this StackOverflow thread: https://stackoverflow.com/questions/11043712/what-is-the-difference-between-non-repeatable-read-and-phantom-read

From my understanding, a non-repeatable read occurs when one transaction is querying data which returns a row or rows, and a different transaction concurrently updates that row or rows while the first transaction is still happening - so that the first transaction would read the updated rows if it does another read. In this case, the data in the row or rows changes in between reads, which is probably not desirable

A phantom read occurs (from my understanding) when, during one transaction which reads some table rows, another transaction inserts or deletes a row and the first transaction then sees the inserted row (or that the row was deleted) in the returned table data

Basically, seems like difference is that a non-repeatable read relates to a row being mutated during a transaction between reads, and phantom read refers to when the number of rows returned by a read is different due to a concurrent transaction inserting or deleting a row
- can prevent a non-repeatable read or a phantom read by changing the isolation level of a transaction it seems. Apparently Postgres isolation level for repeatable read is somewhat different than behavior seen in MySql or Oracle or MS Sql Server? 