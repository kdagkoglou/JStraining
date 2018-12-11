# Ajax

AJAX: "Asynchronous JavaScript and XML" but...

1. It probably will be asynchronous but doesn't need to be.
1. It probably will use JavaScript but Flash or VBScript were options.
1. It can be XML but is more likely to be JSON.

For this reason, "Ajax" is commonly used as a generic term for any client-side process which fetches data from a server and updates the DOM dynamically without a full-page refresh.

Ajax is a technique rather than a technology and there are various options:


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
* works cross-domain
* no need to parse the returned object

The cons:

* security - any page can call the service
* an error in the callback could stop JavaScript running


## XMLHttpRequest

The [`XMLHttpRequest (XHR)`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) object was originally developed by Microsoft for IE5.0 in order to implement a web system for Outlook. It took five years for the API to achieve widespread use after the term AJAX was conceived.

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

Most Ajax libraries also handle timeouts, POST data, progress bars, etc.

The pros:

* more robust
* better features including progress meters and file uploading
* better security - can only make calls to the same server unless [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is set

The cons:

* a fair amount of code - most developers use jQuery or similar
* can be some browser differences, but less evident now


## Progressive Enhancement using Ajax

Assure's `lib.ajax()` (see `src/js/lib.js`) method implements Progressive Enhancement techniques which can be used to intercept a form submission and convert a server-rendered page to an Ajax-powered page when the browser can download and run JavaScript.

The [`FormData` API](https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData) is specifically designed for this purpose since it can read all the values set by a form and pass them to an Ajax request.

Example sign-up form:

```html
<form id="signup" method="POST" action="/signup">

  <input type="email" name="email" required="" minlength="6" maxlength="50" />
  <input type="password" name="password" required="" minlength="5" maxlength="50" />

  <button type="submit">sign up</button>

</form>
```

The form will POST data to the `/signup` endpoint which will return another HTML page containing a success or failure message.

Progressive enhancement can be used to avoid downloading a new page:

```js
var signup = document.getElementById('signup');

// check all APIs are supported
if (signup && signup.nodeName === 'FORM' && addEventListener && XMLHttpRequest && FormData) {

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

    callback(err, data);

  };

  // send form data
  req.send(data);
}
```


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
* no direct support for timeouts and request cancellation.