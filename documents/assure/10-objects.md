# Assure object models

This tutorial describes the primary object and data models used extensively throughout Assure.


## General concepts

Assure is, effectively, a collection of Single Page Applications rather than one SPA. The majority of URLs are initially server-rendered which provides the best response and permits bookmarking, sharing, etc. CSS and JavaScript progressively enhance the page when necessary, e.g. showing an upload progress bar rather than a basic form submit.

General server-side process used by Assure:

1. Express.js routes URLs to a router (`routes/` folder).
1. The router examines the HTTP request type (PUT, POST, GET, DELETE etc.) and any passed values. A redirect or error is raised if the user session is invalid.
1. The router initialises appropriate objects (`lib/` folder), calls methods with passed data, and gets a result.
1. The router determines how the data should be returned (HTML template, web service, JSON file, CSV, SVG, etc.)

General client-side process used by Assure:

1. HTML is returned which loads the single CSS and JavaScript files.
1. JavaScript components initialise themselves according to the HTML content. For example, the test list and user list use the same `table.js` component to control data pagination when an appropriate table is present in the page.


## package.json configuration

The majority of runtime configuration settings are defined in the `assure` section of `package.json`.

In some cases, configuration is determined by environment variables (`NODE_ENV`, `PORT`) or the OS hostname (SSL, S3 credentials, cookies names) so it is custom for each installation.


## Language

At the time of writing, Assure only supports an English UI (British and US variations are avoided). Languages are defined for tokens in `/lib/lang.js`. This is loaded as a global variable and sets localised strings for global use, the login form, the dashboard, tests, and users:

```js
lang = {

  GLOBAL: {
    uk: {...}
  },

  LOGIN: {
    uk: {...}
  },

  DASHBOARD: {
    uk: {...}
  },

  TEST: {
    uk: {...}
  },

  USER: {
    uk: {...}
  }

}
```

The appropriate strings are normally referenced by running `lib/utils.js/token(TYPE, language)` in `lib/` objects, e.g. `= util.token('TEST', 'en')`.

Support for other languages - such as *fr** - could therefore be added by:

1. Adding (uncommenting) the `fr` language to `shared.language.values` in `lib/lang.js`.
1. Copying the `uk` strings in `lib/lang.js` to new `fr` sections and translating accordingly.

The `lib/utils.js/token()` function would also need modification to use the appropriate language based on the current user settings determined by the session.


## `lib/statistic.js`

Generates in-memory system state and statistics. These are primarily used for the dashboard but are also essential to determine which tests are GM, which companies can be an issue assignee, which can be issue regulators, etc.


## `lib/company.js`

Companies are central to operation and control test access, user rights, etc. `company.js` maintains an in-memory company list and updates the database when necessary:

* fetches all companies from the `company` collection (id, name, tests, users, assignees, regulators)
* returns information about a single company
* search for a company in the database using regular expressions (for auto-complete)
* increment/decrement tests, users, assignees, or regulators
* manage company changes on a test (remove old, add new)


## `lib/test.js`

One of the most complex objects used to manage a single test:

* fetch a single test
* add/update a test. The previous test data is also analysed since the API can pass partial data and companies and assets need to be managed appropriately
* create, update, remove, or reopen an attached issue
* delete a test and manage attached issues, companies and assets accordingly
* reset statistics
* find matching brands (for auto-complete)


## `lib/issue.js`

Manages an issue attached to a test:

* fetches a single issue by ID
* fetches a range of possible issues (for linking) when passed a country and list of companies
* updates issue information
* adds a new message to the issue
* updates the status of all linked tests when an issue is updated
* updates the test count and deletes the issue if it is no longer linked to any
* reopens an issue


## `lib/issuetable.js`

Generates HTML issue tables for the dashboard.


## `lib/asset.js`

Manages test asset files in the `asset` collection. For efficiency, assets are shared across tests so the same ad image is only stored once regardless of how many times it is uploaded.

* fetches an asset by its ID either from the database or S3 if it has been transferred
* verifies and creates a single asset (or references one previously uploaded)
* verifies and creates any number of assets
* increments/decrements usage and deletes the asset if no longer required
* removes any number of assets and deleted when necessary


## `lib/testlist.js`

Primary object used to manage the paginated data on the test list. It is passed various values including filters, search strings, the page number, and sort order and returns a result object, e.g.

```json
{
  "info": {
    "records": 6499,    // total number of records
    "from": 26,         // starting at this record
    "page": 2,          // shown on this page
    "pages": 260,       // of this number of pages
    "pagesize": 25      // with up to this many tests on each
  },
  "data": [
    {
      "_id": "5cada0653af6f8124f52937b",
      "adflow": "web",
      "brand": "Snack Games",
      "checked": "2019-04-10",
      "classification": "games",
      "country": "UK",
      "created": "2019-04-10",
      "merchant": "Cellfish",
      "network": "Vodafone",
      "published": "2019-04-10",
      "ref": "test 1522706",
      "retestdate": "",
      "status": 1000,
      "testtype": "marketing",
      "statusfull": "low",
      "testtypefull": "marketing test",
      "countryfull": "United Kingdom",
      "overdue": false,
      "publishedfull": "2019-04-10 13:07",
      "updated": "2019-04-10"
    },
    {
      "_id": "5cad9c1a6c62b8125df88346",
      "adflow": "web",
      "brand": "Playup",
      "checked": "2019-04-10",
      "classification": "music",
      "country": "UK",
      "created": "2019-04-10",
      "merchant": "Digital Virgo",
      "network": "Vodafone",
      "published": "2019-04-10",
      "ref": "test 1522656",
      "retestdate": "",
      "status": 1000,
      "testtype": "marketing",
      "statusfull": "low",
      "testtypefull": "marketing test",
      "countryfull": "United Kingdom",
      "overdue": false,
      "publishedfull": "2019-04-10 13:07",
      "updated": "2019-04-10"
    },
    { etc... }
  ]
}
```

The API can also pass an image which can be used for fuzzy image searches. This has not been implemented in the UI at this time.


## `lib/user.js`

Used to manage a single user:

* fetch a single user
* add/update a user. The previous user data is also analysed since the API can pass partial data, email addresses must be unique, and companies can be changed
* store a configuration value, typically previous searches and report filters
* delete a user and manage companies accordingly
* reset statistics
* open the dashboard announcement panel for one or all users


## `lib/userlist.js`

Primary object used to manage the paginated data on the user list. It is passed various values including filters, search strings, the page number, and sort order and returns a result object similar to the test list but with user data.


## `lib/chart.js`

Creates a SVG pie chart, SVG bar chart, or HTML bar chart (for IE) when passed a set of name/value pairs (with optional link, style, and priority).

The rendering process can choose the most appropriate type by analysing the data. Pie charts can therefore be rejected when they have too many thin slices.


## `lib/chartstacked.js`

Creates a stacked (multi-value) SVG or HTML bar chart (for IE) when passed a set of name/array pairs (with optional priority).

The HTML stacked chart uses a background linear gradient to represent the bar, although this cannot display individual values.


## `lib/queue.js`

Implements a queue system which can be used to process tasks. The queue is mostly used by background tasks (cron-like jobs) and some utilities. It ensures a task is eventually completed even if the first attempts fail, e.g. an email cannot be sent because MailGun is down.

* add an item to the queue with a type (string such as `EMAIL`) and data (such as the email recipient name, email, subject, and body values)
* process (fetch) the next unprocessed item on the queue of a specific type and set a maximum processing type (default of 5 minutes)
* commit an item - processing completed successfully so the item can be removed from the queue
* rollback an item - processing failed, so re-open the item for processing again later
* purge the queue of certain types or all types added prior to now or an optional date. For example, the emailer removes items older than 8 hours


## `lib/store.js`

Stores, fetches, removes, and purges name/value pairs. This can be used for any purpose but is currently used for auto-fill functionality where a specific landing URL in a country automatically sets the brand, companies, service type, etc.


## `lib/util.js`

A collection of generic functions to clean strings, validate data types, generate hashes, manipulate arrays, manage dates, manage files, fetch application configurations, download SVGs, process an array of functions (useful before Promises and async/await were implemented), and other functionality.

Note that `lib/worker-imagehash.js` is used to calculate fuzzy image hashes. This can fail if the image is corrupt, so it is launched as a forked child process which can be killed if a timeout occurs.
