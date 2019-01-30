# Progessive Web Apps (PWA)

PWAs can make a web application feel like a native mobile or desktop application. They can be:

1. discovered on the web or some app stores
1. installed as an icon on the home screen
1. launched with a splash screen
1. set to run full-screen without browser UIs
1. permitted to use OS notifications
1. made to work offline.

They can also work cross-platform, launch faster than native apps, use far less space on the device, and do not have a costly or arcane app store approval process.

My prediction: *PWAs will replace many native apps over the next few years*. Native apps are only necessary when:

1. The application needs to use systems which do not currently have a web-based API, e.g. the contacts address book.
1. Speed is essential, e.g. a fast-action game (even then, WebGL and WebAssembly go some way to solving that).

Most Google tutorials describe creating PWAs as a new single-page applications (SPA). This is not necessary: any existing web site or app can become a PWA with a few hours effort.

At the time of writing, PWA technology has a reasonable level of support on most browsers and platforms. However, that does not matter because it's *progressive*. If an OS or browser does not implement PWA technologies, the app will continue to work like a standard web application. The user just won't have the benefit of installation or offline capabilities.

## PWA recipes

Perhaps the hardest part of creating a PWA is deciding how offline functionality will work. Do you:

* cache the whole application once and never return to the network again?
* use cached data where possible with a network fallback?
* use cached data but then fetch from the network and update the cache?
* use network data where possible with a cache fallback?

Service worker recipes are available at [serviceworke.rs](https://serviceworke.rs/) and [googlechrome.github.io/samples/service-worker/](https://googlechrome.github.io/samples/service-worker/).

In addition, be wary about caching inappropriate files such as Google fonts and some Ajax requests.

## PWA requirements

A PWA has three basic requirements:

1. HTTPS.
1. A web app manifest file which provides the application name, colours, icons, and launch factors.
1. A service worker. This is a special JavaScript web worker which acts like a proxy server.

### Testing PWAs

Chrome offers the best developer tools for testing PWAs. Launching in incognito mode also helps because cached files will be wiped when the browser closes.

Real Android devices can also be tested via a USB connection. Open the `Remote devices` tab in Chrome (in `More tools`) and enable `Discover USB devices`. Port forwarding must also be set, e.g. forward port `8888` to `localhost:8888` to test a local development server.

Connect a device to your PC using a USB cable and it should appear as `Connected`. Enter a `localhost:8888` URL as a `New tab` address and it will load on the device. You can now remotely control and inspect how the site runs on a real mobile browser.

### HTTPS

HTTPS is required because the service worker script is critical. The browser must be sure a service worker originated from the same domain and has not been tampered with (via a public wifi network, man-in-the-middle attack, etc). If a service worker was changed maliciously, it could modify all requests for a website, e.g. change all x.com requests to y.com responses.

Note that most browsers permit testing via HTTP when using a `localhost` address.

### Web app manifest

The [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) is a JSON file which describe the application. The file is normally placed in the root of your application's web space and specified in the HTML `<head>`:

```html
<link rel="manifest" href="/manifest.webmanifest">
```

The file can be named anything, but `.webmanifest` is becoming a standard and it must be served with a `application/manifest+json` MIME type.

Example manifest:

```json
{
  "name": "MyApp",
  "short_name": "My Application",
  "description": "My amazing Progressive Web Application",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#fff",
  "icons": [
    {
      "src": "images/icon192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/icon512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Any number of bitmap icons can be set (not SVGs). One of 512x512px is essential.

Tools:

* [Web App Manifest Generator](https://tomitm.github.io/appmanifest/)
* [another Manifest Generator](https://app-manifest.firebaseapp.com/)
* [Web Manifest Validator](https://manifest-validator.appspot.com/)

### Service Worker

A service worker is a special type of JavaScript web worker which must be placed in the root of the application. It intercepts all HTTP requests and can:

1. complete the network request and, optionally, cache the response
1. return data from the cache from a previous request, or
1. return any other appropriate data.

A service worker is registered from the main page JavaScript, e.g.

```js
// is service worker supported?
if ('serviceWorker' in navigator) {

  // register service worker
  navigator.serviceWorker.register('/sw.js');

}
```

The `sw.js` file can be empty and you'll still have a functioning PWA!... It just won't have the benefits of offline processing.

Three basic events are defined with `self.addEventListener`:

1. `install` - called when the service worker is run for the first time or it has been updated. It typically downloads essential files for the application to function. `self.skipWaiting()` must be called at some point to ensure any new versions of the service worker are activated.
1. `activate`- called when the application is launched. It typically clears old caches then runs `self.clients.claim()` to set the current worker as active.
1. `fetch` - this analyses the `event.request` object and returns a response. If a new file is requested, a clone of it is placed in the cache.

Other events are being added such as notifications which canshow even when your application is not running and synchronisation which can upload data in the background, perhaps after the network has reconnected.

Most service workers use the [CacheStorage API](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) to manage domain-specific named storage areas where data can be placed. Opening a cache returns a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) object which can be used to add, update, remove and return items from the cache.

## Example PWA

An example can be found in the `code/pwa/` folder. Launch as server with `node server.js` then navigate in a browser to [`http://localhost:8888/code/pwa/`](http://localhost:8888/code/pwa/)

The example code creates a cache named `1.0.0::testsite`. The `install` event then caches all essential files in that cache. If the application is ever updated, the name will change, e.g. `1.1.0::testsite`, and the `install` event will trigger again.

The `activate` event then deletes all other caches which do not match the current name.

The `fetch` event attempts to locate a requested file in the cache. If that does not exist, it fetches it from the network and caches it. If the network is not available, it returns the pre-cached `offline.html` page.

The offline page also checks the cache and shows a list of pages which are available offline. The user can therefore access a previously-read page.

Service workers and the cache objects use `Promises` and/or `async/await`.
