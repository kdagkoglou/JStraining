# Updates

Although Assure uses a schema-less MongoDB database, changes to the application can require updates to the collections, e.g.

* a new field is added which must be indexed for improved searching (e.g. new SMS keyword and code fields)
* user permissions must be updated (e.g. a new report is added which can be accessed by certain users)
* a feature is added or modified (e.g. introducing issues functionality and global breach types required conversion of old data)
* a feature is fixed or improved (e.g. test search indexes are created or dropped)

Updates are made by:

1. Shutting down Assure (`npm run stop`).
1. Pulling the latest update (`git pull && npm i`)
1. Running the update process with `npm run update <db>` where `<db>` is either `test` or `live` (the default if unspecified). This runs all update code released since the previous update run (zero or more files).
1. Restarting Assure (`gulp run && npm run all`).

Note that some updates cannot be completed during an update because it would take too long, e.g. re-generation of image fuzzy hash checksums. Those can be carried out by an ongoing task.


## Semantic versioning

Assure uses semantic versioning specified in the `version` value of `package.json`:

```json
{
  "name": "assure3",
  "version": "1.57.2",
  ...
}
```

which specifies `<major>.<minor>.<patch>`:

* `<major>`: a change which fundamentally breaks the API. This will always be `1` for Assure3/FraudScan.
* `<minor>`: feature addition or removal. This could change the API, but it will remain backward-compatible.
* `<patch>`: a change to an existing feature, such as small updates, bug fixes, etc.

When an update is successfully completed, the current version number is stored in the `version` data field of the single document in the `setting` collection.


## Update code

Update files are contained in the `update` folder. Each filename is the version number with a `.js` extension, e.g. `1.54.0.js`, `1.55.7.js` etc. Not all releases require an update file, but all updates for a version are contained in one file.

Each exports a single function with a single callback parameter which is run on completion. It is passed an error and the version number (extracted from the filename).

The majority of updates run through an array of functions handled by the `Process` object defined in `/lib/util-update.js`. If any function returns an error, further processing is cancelled.


## update.js

`/update.js` is responsible for running any number of updates in sequence:

1. It loads common modules and database connections which can be used globally by all updates.
1. It obtains the current database version from the `version` field in the `setting` collection.
1. It reads the filename of every file in the `/update` folder and calculates whether it is later than the current version. Updates to apply are sorted into the correct order.
1. The next update file to apply is loaded and executed.
1. If the update is successful, the `version` field is updated and the next file is processed. An update failure cancels all processing.

The file and function being processed is output to the console.

The process can therefore be run multiple times until all updates are successfully applied.


### Version number calculation

The version is converted from a string to an integer by splitting into parts and multiplying by a weighting:

```js
(major * 100000) + (minor * 1000) + patch;
```

Example:

* `1.36.2` becomes `136002`
* `1.57.1` becomes `157001`

It is therefore easy to determine that `1.57.1` is a later update than `1.36.2`.


## Rerun an update

Specific updates can be re-run with `npm run update <db> <version>`, e.g.

```bash
npm run update live 1.56.0
```

This will re-run the update but will not change the `version` stored in the DB `setting` collection.


## Database considerations

Development and test databases are normally small so updates rarely pose a problem. As of May 2019, the live database contains 1.5 million tests, 3.2 million assets, and 262,000 issues collated over four years.

In some cases, a single `updateMany()` method is not possible because each document must be read, processed by JavaScript, then updated, e.g. determining which test image is a banner. Unfortunately, updates on large datasets will fail because MongoDB imposes a limit of 1,000 concurrent processes.

To solve this issue, updates are often batch processed, e.g.

1. Set a start record (typically, with `_id: ObjectID('000000000000000000000000')`).
1. Run a query to fetch the next 1,000 documents greater than the start record. End processing when no more can be found.
1. Update the start record to a value from the current document being processed.
1. Analyse the document and, where necessary, define an update in the [MongoDB initializeUnorderedBulkOp](https://docs.mongodb.com/manual/reference/method/db.collection.initializeUnorderedBulkOp/) bulk operations builder.
1. Run the current bulk operation once all documents have been processed.
1. Output an indication to the console, such as the number of documents processed, and return to step 2.

Examples in the `/update` folder where this is used:

* `1.28.0.js` - issue tracking and message conversion
* `1.45.6.js` - identifying the merchant in a company list for search/indexing
* `1.47.0.js` - identify banner, prelanding, and landing images in existing tests
* `1.54.7.js` - breach type updates requested by analysts
