# Cookies

Despite privacy scare stories, cookies are simply text values which are shared between the client and server on every HTTP request. They are normally used to retain state, e.g. indicate that a user has logged in.

The server defines `Set-Cookie` responses in the header, e.g.

```http
Set-Cookie: var1=123
Set-Cookie: var2=abc
```

The browser (client) returns all previously-sent, new or updated cookies in the header of every request:

```http
Cookie: var1=123; var2=abc
```

## Security

Cookies should **never** be used to store sensitive information. Care should be taken to avoid Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) attacks which can be used to copy cookie values or use a cookie maliciously. This is especially problematic if the site loads third-party JavaScript.


## Performance

Browsers typically limit cookie usage, typically to 20 cookies of 4Kb per domain. This would equate to 80Kb sent with every HTTP request and returned with every HTTP response for HTML pages, CSS, JavaScript, images and other assets.

In general, keep cookie usage and sizes to an absolute minimum.


## Cookie options

A number of options are available...

### Expires

By default, cookies are session only and are removed once the user closes their browser unless an `Expires` date is set, e.g.

```http
Set-Cookie: id=abc; Expires=Tue, 1 Jan 2019 07:00:00 GMT;
```

When a browser operates in incognito mode, all cookies are effectively made session-only regardless of any expiry setting.

### Domain

By default, cookies are only shared on the same domain. However, setting a `Domain` header permits them to be shared on sub-domains, e.g. `Domain=empello.net`.

### Path

Setting a `Path` indicates that a cookie is only available to the server/client when a path matches, e.g. `Path=/doc` will permit the cookie on any URL path or sub-path starting with `doc`.

### Secure

Secure cookies are only sent when HTTPS is used.

### HttpOnly

HttpOnly cookies are available to the server but hidden from client-side JavaScript. This adds an extra level of security.


## Setting cookies on the server

Cookies are returned with the HTTP header so they must be set BEFORE any response is sent.

Most server-side languages provide some way to set cookies, e.g. in PHP:

```php
setcookie('name1', 123); // session cookie
setcookie('name2', 'abc', time()+3600); // expire in one hour
```

Various [cookie parser middleware libraries](https://www.npmjs.com/package/cookie-parser) are available for Express.js, but they are not necessarily required:

```js
app.get('/hello/', (req, res) => {

  res.cookie('name1', 123); // session cookie

  res.cookie('name2', 'abc', {
    maxAge: 3600 // expire in one hour
  });

  res.send('hello world');

});
```

Cookie values can be updated as necessary.

To delete a cookie, it can be written again with an empty string value and an expiry set to now or a short time in the past. Express.js also provides a [`res.clearCookie`](https://expressjs.com/en/4x/api.html#res.clearCookie) method.


## Fetching cookies on the server

Similarly, most server-side languages provide a way to get cookies either directly from the HTTP header or utility functions, e.g. in PHP:

```php
echo $_COOKIE; // all cookies
echo $_COOKIE['name1']; // named cookie
```

or in Express.js:

```js
app.get('/showcookie/', (req, res) => {

  let cookie = req.headers.cookie;
  res.send('cookie value:' + cookie);

});
```

The returned string contains all cookie values separated by semi-colons, e.g.

```http
name1=123; name2=abc
```

## Client-side JavaScript cookies

JavaScript running in the browser can get and set the `document.cookie` value, e.g.

```js
let cookie = document.cookie; // name1=123; name2=abc

document.cookie = 'name1=321; name2=zyx';
```

or, with an expiry:

```js
let date = new Date();
date.setTime( date.getTime() + 3600000 ); // one hour in milliseconds
document.cookie = 'name1=321; name2=zyx; expires=' + date.toUTCString();
```

## Cookie string management

All server and client-side cookie libraries do the same thing and manage the cookie string for you, e.g.

* splitting the cookie string into usable variables
* handling encoding of special characters such as semi-colons and carriage returns.
* easier expiry, path and domain settings

However, this is rarely necessary if you have simple cookie requirements such as a single user login session value.
