# Ajax

AJAX: "Asynchronous JavaScript and XML" but...

1. It probably will be asynchronous but doesn't need to be.
1. It probably will use JavaScript but Flash or VBScript were options.
1. It can be XML but is more likely to be JSON.

For this reason, "Ajax" is commonly used as a generic term for any client-side process which fetches data from a server and updates the DOM dynamically without a full-page refresh.

Ajax is a technique rather than a technology and there the three primary options are described below.


## Useful public APIs

List can be seen at <https://github.com/toddmotto/public-apis>

Many are open and accept a request from anywhere because the following Cross-Origin Resource Sharing (CORS) HTTP header is set:

```text
Access-Control-Allow-Origin: *
```

*(This is returned on an OPTION request made by the browser prior to the real request.)*

Some may request authorisation using a secret key or OAuth.

Example joke generator: <https://official-joke-api.herokuapp.com/random_joke>


## `<script>` injection

A `<script>` tag is dynamically added to the DOM. This calls a web service which returns JavaScript which can be generated and contain data.

A `load` event is triggered when the script is ready but the JSON-P (JSON with padding) format can be more useful because it wraps the data in a function callback. Example:

```js
let script = document.createElement('script');
script.src = 'https://domain.com/myservice/?a=1&b=2&c=3&callback=myHandler';
script.async = 1;
document.head.appendChild(script);


function myHandler(ret) {
  // do something with ret
  console.log(ret.name);
}
```

The server returns a script call and passes the data, e.g.

```js
myHandler({ name: 'returned data', value: 42, x: 1, y: 2, etc: 0 });
```

The pros:

* simple
* works cross-domain (CORS is unnecessary)
* no need to parse the returned object

The cons:

* security - any page can call the service
* an error in the callback could stop JavaScript running
* only practical for HTTP GET requests. POST, PUT, DELETE etc. would probably be impractical.


## XMLHttpRequest

The [`XMLHttpRequest (XHR)`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) object was originally developed by Microsoft for IE5.0 in order to implement a web system for Outlook. It took five years for the API to achieve widespread use after the term [Ajax was conceived](https://adaptivepath.org/ideas/ajax-new-approach-web-applications/).

Basic usage for just GET calls:

```js
// basic GET call
function ajaxCall(url, callback) {

  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // useful header

  // request state change
  req.onreadystatechange = function() {

    if (req.readyState !== 4) return;

    callback(
      (req.status === 200 ? false : req.status),  // error code
      (req.response || null)                      // data string
    )

  };

  // start request
  req.send(data);

}


// make call
ajax('https://domain.com/myservice/?a=1&b=2&c=3', function (err, data) {

  if (err) {
    console.log('error', err);
  }
  else {

    try {
      var json = JSON.parse(data);
      console.log('success!', json);
    }
    catch(e) {
      console.log('JSON parse failed', e);
    }

  }

});
```

Most Ajax libraries also handle errors, timeouts, non-JSON responses, POST data, file uploads, progress bars, etc.

The pros:

* more robust and supports all HTTP types (POST, PUT etc.)
* better features including progress meters and file uploading
* better security - can only make calls to the same server unless [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is set

The cons:

* a fair amount of code - most developers use jQuery or similar
* can be some browser differences, but less evident now


## Progressive Enhancement using Ajax

Assure's `lib.ajax()` (see `src/js/lib.js`) method implements Progressive Enhancement techniques which intercept a form submission and convert a server-rendered page to an Ajax-powered page (presuming the browser can download and run the necessary JavaScript).

The [`FormData` API](https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData) is specifically designed for this purpose since it can read all the values set by a form and pass them in an Ajax request.

Example sign-up form:

```html
<form id="signup" method="POST" action="/signup">

  <input type="email" name="email" required="" minlength="6" maxlength="50" />
  <input type="password" name="password" required="" minlength="5" maxlength="50" />

  <button type="submit">sign up</button>

</form>
```

The form will POST data to the `/signup` endpoint which will return another HTML page containing a success or failure message.

Progressive enhancement can avoid this new page refresh. The server can detect that `X-Requested-With` is set to `XMLHttpRequest` in the HTTP request header and return a JSON response rather than a full HTML page:

```js
// client-side JS

// get the signup form node
var signup = document.getElementById('signup');

// check all APIs are supported
if (signup && signup.nodeName === 'FORM' && addEventListener && XMLHttpRequest && FormData) {

  // intercept form submit event
  signup.addEventListener('submit', function(e) {

    // stop submit
    e.preventDefault();

    // make ajax call
    ajaxIntercept(signup, function(err, data) {

      if (err && data.success) {
        alert('sign-up successful!');
      }
      else {
        alert('sign-up failed\n' + (data && data.reason ? data.reason : ''));
      }

    });

  });

}


// send form data via Ajax request
function ajaxIntercept(form, callback) {

  // prevent submissions in progress
  if (form.inProgress) return;
  form.inProgress = true;

  var
    req = new XMLHttpRequest(),
    data = new FormData(form);

  req.open(form.method, form.action);
  req.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // useful header

  // request state change
  req.onreadystatechange = function() {

    if (req.readyState !== 4) return;

    var
      err = req.status === 200 ? false : req.status,
      data = req.response;

    if (!err) {
      try { data = JSON.parse(data); }
      catch(e) {} // not JSON
    }

    form.inProgress = false;
    callback(err, data);

  };

  // send form data
  req.send(data);
}
```

The browser will fall back to the standard form submit if there is a problem, e.g. the JavaScript fails to load, Ajax is not supported, another script terminates JS processing, etc.


## Fetch API

The newer [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is a promise-based alternative to XMLHttpRequest but it is not supported in older browsers such as IE.

Example JSON upload:

```js
var
  url = '/webservice',
  data = { name: 'test', value: 'data', stuff: 42};

fetch(url, {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then( res => res.json() )
  .then( response => console.log('Success!') )
  .catch( error => console.error('Error:', error) );
```

The pros:

* shorter code, easier to read
* some security features not available to XHR

The cons:

* more limited browser support
* primarily for JSON data
* errors can be difficult to parse
* no direct support for timeouts and request cancellation.

Recommendation: it is fine to use `Fetch()` for internal or demonstration code but `XMLHttpRequest` is currently a better for more robust client-facing systems. That situation will change over time.
