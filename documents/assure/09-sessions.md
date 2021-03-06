# Assure user sessions

Assure uses a lightweight, custom, passwordless login system. This has been a considerable success: users often access infrequently and forget their password. Password-related support calls have been reduced from many hours per month to almost nil. *(Definitely consider passwordless logins for other systems!)*

Some pages, such as individual tests and help, can be accessed without logging on. Information and interaction is reduced, but it permits non-clients or those who rarely log in to access and share Assure data with minimal effort. This has helped clients become aware of Empello's service and is possibly overlooked as a sales benefit.

To log in:

1. The user is directed to the login page (`/`).
1. They submit their email address.
1. Assuming the user is registered, Assure creates a new session in the database, sets a 30-minute cookie in the browser, and emails a verification link to the user.
1. When that link is clicked, the data is verified and the cookie is set to a real session ID with a 2-week expiry.

The user is now logged and subsequent requests for the root `/` URL will show the dashboard. The value of the session cookie is parsed on every request to fetch session and user information from the database. The cookie expiry and session `datelast` datetime is also updated accordingly.

The user can log on via multiple devices at the same time. Each device will have a separate session.


## API users

API users do not use sessions - the calling application passes a shared token in the HTTP header. This is checked prior to checking any cookies and effectively creates a session for the remainder of the request.


## Technical implementation

Standard user definitions are stored in the MongoDB `user` collection. The most important information is the `_id` (generated on user creation), the `email` address, and whether the user is `active`.

Active user sessions are stored in the MongoDB `session` collection. Each session has a generated `_id`, the `userid` (reference to `user._id`), the login datetime, the datetime of last access, the IP, and useragent.

API user definitions are stored in the MongoDB `api` collection.

A single, lightweight cookie value is set using the Express.js `res.cookie()` method. At most, this adds another 24 bytes to each request.

All requests are passed to through the `init()` middleware function in `lib/session.js`. This fetches the current session and user from the database when a session ID is set in the Assure cookie (or defines an appropriate session when API users pass a valid token in the HTTP header). It also updates the session `datelast` to the current datetime.

Any page which requires a valid session (e.g. the test list, reports, etc.) will redirect to the `/` home page when a session cannot be found. The router will show the login page.

On submission of an email address, Assure:

1. wipes all expired sessions (any with `datelast` over two weeks)
1. checks an active user exists with that email address
1. creates a new record in the `session` collection which points to that user
1. records the session `_id` and a 6-character hash of that ID
1. sends an email to that user. The link includes the hash and session `_id`
1. presuming the email is sent, a 30-minute cookie is set to the hash
1. after the link is clicked, the hash and session `_id` are extracted and compared against the cookie. The session data is retrieved from the database.
1. presuming the session is valid, a 2-week cookie is set to the `session._id` value.


To log out, the user is directed to `/0` which deletes the current session record from the database, resets the cookie, and redirects to `/` to show the login page.

Note that Assure uses a single HTTPS server-only cookie to store the session ID. It would not be possible for a third-party system to analyse the cookie and spoof requests.


### Cross-Origin Resource Sharing (CORS)

Assure's session cookie is shared with all applications on a sub-domain of empello.net. This is implemented using CORS when an initial HTTP OPTIONS request or an Ajax request is sent. The application does not need to implement its own login procedures; any logged in user can trigger an Assure client-side request for data and receive a response which adheres with that user's permission rights.

The appropriate headers are set by the `setCORS()` function called by the `init()` Express.js middleware in `lib/session.js`. *(Note it also sets the HTTP `Vary` header to `X-Requested-With` which ensures Chrome-based browsers do not presume any cached HTML and JSON from the API are valid for all requests to the same URL endpoint.)*

Note that the cookie for TEST (and an older AN system) use a different cookie name because these are on sub-domains of empello.net but must be treated as separate systems, i.e. being logged in at test.empello.net does not log you in at empello.net.
