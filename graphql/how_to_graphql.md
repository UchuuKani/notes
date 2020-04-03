# How To GraphQL Introduction

Reasons Facebook developed GraphQL:

- Increased mobile usage created need for efficient data loading
- Variety of frontend frameworks and platforms on client-side
- Fast development speed and expectation for rapid feature development

GraphQL is not a database querying language, rather it is an alternative to REST architecture where a client makes a declarative request for data and receives only the requested fields rather than everything from a REST endpoint call being returned

## Differences Between GraphQL and REST

With a REST api, you potentially have over- and under- fetching of data, whereas with GraphQL the client receives only the data that is specified in its query

Say with a REST api, there are multiple endpoints that a client would hit to get data:

- `/users/:id` to fetch initial user data
- `/users/:id/posts` to fetch all of a user's posts
- `/users/:id/followers` to fetch a list of followers per user

In GraphQL, you would define a single query to the GraphQL server that includes concrete data requirements and the server would respond with a JSON object with the requirements fulfilled

GraphQL uses a strong type system to define the capabilities of an api. All the types exposed in an api are written down in a schema using the GraphQL Schema Definition Language (SDL). This schema serves as a contract between the client and server to define how a client can access data. Once the schema is defined, front end and back end teams need to communicate less about the structure of the data because it is already defined. Frontend teams can easily test their applications by mocking the required data structures. Once the server is ready, the switch can be flipped for the client apps to load the data from the actual API.

## Core Concepts
