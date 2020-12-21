# HTTP Headers and Cookies

This video mainly focuses on the `set-cookie` and `cookie` headers to understand how server-side sessions work. Will mainly focus on response and request headers as well

---

## Headers

If you make a request to `google.com` and open up the network tab in dev tools, can see one of the types of headers present are `general` headers. These can be either request or response-related and are kind of general metadata about the request made like the url, HTTP method, status code, etc.

In the situation where a browser calls out to `google.com`, the browser creates request headers to tell the server information. Part of those headers are the type of data the browser will accept from the server

The server will set response headers for the request. Response headers give additional information to the client that made the request, such as `content-type`

### The "set-cookie" header

Notice that there exists a `set-cookie` header in the response headers, and a `cookie` header in the response headers. The cookie itself is just a set of key-value pairs.

Remember that HTTP is a stateless protocall by default, so a server is not able to know or remember who makes a request. A cookie is used to identify requesters to a server. A server will check if a client sent a cookie in its request, and if not, will set a cookie for the client to send back on subsequent requests

This pattern of the server setting a cookie, and the browser attaching a cookie to every request is useful tool when it comes to user authentication:

- can say, if a user authenticates correctly, the server sets a header in the response object sent back to the client. The client will now have the cookie that says "this user has already been authenticated" and send it on every request to the server so a user would not hae to re-login.

One thing to consider is how long the authentication cookie should last (how long should the user be logged in for)?

- kind of an arbitrary number, but can determine this by the `expires` portion of a cookie. Says how long the browser should store a cookie for
