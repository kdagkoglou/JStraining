# Assure utilities

Assure has a number of small applications (mostly in the `/util` folder) which modify or fix the database. Most are run rarely - *if ever*.

**UTILITIES SHOULD NEVER BE USED WHEN ASSURE IS RUNNING!**

Further information may be available in [Assure's README.md file](https://bitbucket.org/empello/assure3/).


## Why are they necessary?

The utilities either:

1. automate something which would take considerable effort to achieve manually, or
1. fix a database problem.

SQL databases usually support *transactions*. These guarantee that two or more updates occur.

EXAMPLE: moving money from the bank account of personA to personB requires at least two updates - a debit from personA and a credit to personB. Transactions ensure that both updates succeed. If one or more updates fail, they all fail.

MongoDB does not support transactions. (Actually, updating multiple items in a document is transactional and v4 supports transactions in sharded cluster installations.) In Assure, this means things could go wrong, e.g. a test is deleted but the issue it references is not.

Problems are rarely critical, but orphaned documents or unnecessary data is inefficient.


## `util/rename.js`

Company names are referenced as strings in documents in the `company`, `issue`, `test`, and `user` collections. There may be thousands of references - this causes a problem when a company changes name or has been incorrectly entered.

To fix it, run: `npm run rename <dbname> <oldName> <newName>`

For example, rename all instances of "Company One" to "Company Two" on the live database:

```bash
npm run rename live "Company One" "Company Two"
```

Enclosing quotes are required if a name contains spaces.

Renaming is complex and risky. Back-up the database and shut down Assure before any change is made.

Large datasets can result in timeout errors. If this occurs, wait a few moments before re-running the `rename` process. Repeat until it succeeds.


## `util/fixalertdate.js`

Currently, summary email alerts are sent on a Saturday. Depending when the update goes live, changing the date could cause issues, e.g.

* Saturday to Sunday: a user could receives two almost identical emails on both Saturday and Sunday.
* Saturday to Friday: a user misses a weekly summary.

Run `npm run fixalertdate live` to address these problems.


## `util/fixissues.js`

Tests reference issues and vice versa. Issues also keep a count of how many tests they reference. To fix orphan issues, run `npm run fixissues live`.

This is done rarely - perhaps before a major update or database migration.


## `util/fixsetting.js`

The `setting` collection stores `testnumber` - the number of tests stored. This increases whenever a new test is added and is used to generate the reference field (if left empty).

Run `npm run fixsetting live` if the count becomes incorrect (it has never been done).


## `util/s3verify.js`

Generate a report to `./log/s3verify.csv` of assets which failed to upload to AWS S3:

```bash
npm run s3verify
```

Each row of the CSV contains the ID, the original file name, the date added, and the MD5 hash of the missing asset.

This application should not be necessary. It was only used to discover problems when the S3 code was originally implemented.


## `util/wipe.js`

Completely wipes tests, issues, and assets from the chosen database. Users are retained but have their history wiped. Companies are only retained when they have one or more users.

Never use this - the application runs immediately without warning!


## Blast

Blast is a [separate command-line application](https://bitbucket.org/empello/blast/) which can be run from anywhere. It communicates with [Assure's REST API](https://bitbucket.org/empello/assure3/wiki/Home) to make bulk changes or deletions in the same way a user would.

Blast is passed:

1. A test list URL which identifies the tests to change. This URL can use filters, hidden parameters, and other modifications.
1. A list of field name/value pairs as a JSON string to apply to the identified tests (or a `-d` parameter to delete those tests).

Example: add "Exoclick (AN)" as a company to any test where exoclick.com appears in a URL (carriage returns added to add legibility):

```bash
node ./blast.js
  -u "https://empello.net/test/list/?complete=0&url=exoclick.com"
  -p '{"appendmedia":0,"companyadd":1,"company":"ExoClick (AN)"}'
```

Notes:

* Updates are rarely this simple and may require multiple runs or complex filters.
* Some update requests are impossible, better handled by `rename.js`, or would be more practical to perform manually.
* Blast can only handle around 3,000 tests before timeouts occur. There are ways around this, but they can be clunky.
* Blast can take time to run and causes a significant server hit. It should only be used in quiet periods.
* A database back-up is recommended prior to any run.

Blast is old, can be confusing, increasingly unreliable, and dangerous to use (early versions wiped test images). Never attempt a Blast run without understanding of what the update will do.
