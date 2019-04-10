# Assure Express.js configuration

Assure is an [Express.js](https://expressjs.com/) application. Express.js is a minimalist framework which provides:

* HTTP/S request and response
* URL routing
* middleware (plugin-like) components

In essence, Express.js is to Node.js what Apache is to PHP. It's mostly a web server. The primary difference is that Express.js becomes part of the application.


## Configuration

On the live servers, the `NODE_ENV` environment variable should be set to `production`:

```bash
export NODE_ENV=production
```

This configures Express.js internally for performance as well as Assure's build (full minification, no sourcemaps) and runtime (HTTP port, cache time, error handling, etc.).

Additionally, further settings are defined in `package.json` including:

* domain names
* MongoDB connection strings
* AWS S3 parameters
* cookie defaults
* file upload configuration
* email configuration

Finally, the `os.hostname()` is used to determine domain and SSL settings.


## Starting Assure

Assure's main server application is started with `node ./app.js` although the global [forever module](https://www.npmjs.com/package/forever) is normally used to run it as a background task. This configures the application, connects to the database, initiates background statistics calculations, and starts Express.


## Statistics processing

Statistics generation is one of the most complicated aspects of Assure. Dashboard and general processing statistics change each time a test, issue or user is added - often in major ways, e.g. a user is granted access to a county which removes those tests from the general market.

Most applications generate statistics on the fly each time a user requests that information. This is impractical for Assure since it contains millions of data items. To improve efficiency:

1. Statistics are generated on request, i.e. CompanyX's statistics are only generated when someone from that company logs in.
1. Statistics are generated in the background. Adding a test may not update the count on the dashboard for several seconds.
1. Statistics are cached. They are only regenerated when the data is known to be 'dirty'.
1. Even dirty data may be cached for a while. For example, GM regeneration will occurs at ten minute intervals at most.

Company statistics are stored in the global `cfg.stat` object. For example, `cfg.stat['Company One']` contains all data from every country (`cfg.stat['Company One'].uk`, `cfg.stat['Company One']fr`, etc.) for that company's own and GM configuration. When a user with specific access to N countries, the appropriate statistics and totals can be returned quickly.

*Note that Empello administrator statistics are stored in `cfg.stat.ALL`. Never create a company named `ALL` - it's one of the only names that will be blocked!)*


## Clustering

All Node.js applications run on a single processing thread. Therefore, a server with eight processor cores can only use an eighth of its capacity.

The [pm2 module](https://www.npmjs.com/package/pm2) is an option for some applications because it can start multiple processes depending on the number of processors available. It launches N separate instances of the application, but this is not suitable for Assure because cached statistics in one instance would never match those in another. It would be possible to store statistics in the database and access from those records, but that would be less efficient.

For this reason, Assure implements [Node.js clustering](https://nodejs.org/api/cluster.html). This is similar to launching web workers:

1. A single `master` thread (the first initiated) is responsible for starting, restarting, and communicating with child threads (it also handles HTTP to HTTPS redirects in Assure).
1. A child thread is launched for each processor (`os.cpus().length`). Each handles a separate instance of the Express.js application.

The master and a child thread can only communicate via data sent using `process.send(data)` and received using `process.on('message', (data) => {...})` event handlers. A child can communicate with the master and vice versa - *it is not possible for two child processes to communicate directly*.

The general processing method:

1. A single child process wants to calculate or reset statistics (perhaps because a user from a specific company has accessed the dashboard via its instance of Express.js).
1. The child sends a `statisticprocessing` message to the master.
1. The master broadcasts the `statisticprocessing` message to all child processes. This informs them not to calculate statistics for that company.
1. The child finishes statistical generation and sends a `statistic` message to the master containing updated data.
1. The master broadcasts the `statistic` message to all child processes which update their `cfg.stat` data. All child processes are now free to restart this processing.

Similar broadcast methods are used to update the company list, number of tests, and maintenance mode signal.


## Database connections

A single MongoDB database connection will queue all requests. If someone requests a report which takes 30 seconds to generate, every other user will wait at least 30 seconds before their request is handled.

This restriction is partly solved with multiple child processes. However, Assure also makes multiple database connections in each child process for additional efficiency:

1. `dDB` - used by statistics generation
1. `sDB` - used by reports
1. `tDB` - used by the test list
1. `DB` - used by everything else; sessions, users, queues, etc.


## Express.js configuration

The primary Express.js configuration sets:

1. various global variables such as the `host`, `port` and `domain` which are used by other components
1. the doT template engine
1. GZIP [compression](https://www.npmjs.com/package/compression) middleware
1. the favicon image
1. the `static` folder containing images, CSS and JavaScript. Files are cached for one day.
1. the [body-parser](https://www.npmjs.com/package/body-parser) middleware to handle incoming HTTP POST data
1. [multer](https://www.npmjs.com/package/multer) settings for handling multipart/form-data file uploads
1. Assure's `session.init` middleware which determines the standard/API user and appends session and user data to the Express.js `req.session` variable
1. URL routing. All valid endpoints passed to `express.Router()` handlers in the `routes` folder
1. error and exception handlers.

Assure runs `lib\init.js` before Express.js is launched. This connects to all database instances, S3, fetches companies, fetches the current number of tests, calculates the 'live' date (28 days ago - and updated every three hours), and launches generation for analyst statistics in the background (a random child will normally initiate the process).

Express.js will launch using the appropriate SSL certificates once initiation has successfully completed.


## Express.js operation

The general processing:

1. A URL is requested, optionally with parameters or data posted.
1. The appropriate route file is chosen the `/routes` folder.
1. A specific handler function is run according to the URL.
1. The handler function parses any passed parameters (normally into an object named `prm`).
1. An appropriate business logic function/object in the `/lib` folder is called and passed parameters as necessary.
1. The business logic function calculates a result based on a database search or other functionality. A JavaScript object is normally returned.
1. An appropriate response is returned to the calling browser/system.

In most cases, the JavaScript object is placed into a doT template and returned as HTML, but there are other possibilities:

* a JSON string is returned to API users or when `req.xhr` is true (an Ajax call sets the `X-Requested-With` HTTP header to `XMLHttpRequest`)
* a JSON file (downloaded attachment) is returned on some reports when a `format=json` querystring parameter is set
* a CSV file (downloaded attachment) is returned on some reports when a `format=csv` querystring parameter is set. The data is generated from the
* a SVG image file (downloaded attachment) is returned on some reports when a `format=svg` querystring parameter is set
* some simpler web services return a single string containing one data item.

This effectively means the same URL endpoints return data formatted appropriately for the request. Assure's API can therefore perform all actions possible within the UI.


## doT templates

The [doT](https://www.npmjs.com/package/dot) template system is used to [render HTML](http://olado.github.io/doT/). This is one of the fastest and simplest options - it mostly uses JavaScript rather than its own syntax. (Note that `[[...]]` delimiters have been set - they require less typing effort!)

The Gulp.js build system creates templates in the `/views` folder. Includes and static strings are processed at build time so Express.js has as little to do as possible at runtime.

In most cases, the input parameters and resulting data are placed into templates using `[[= model.value ]]` or `[[! model.value ]]` where encoding is necessary.
