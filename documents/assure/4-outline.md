# Application outline

Assure consists of several primary systems.


## 1. Semantic version numbers

Assure uses `major.minor.patch` semantic version numbers where:

* **major** will always be `1` unless a breaking API change is made.
* **minor** indicates a change which typically adds, removes or modifies features but would not break existing third-party processes.
* **patch** indicates a bug fix or minor update.


## 2. Development and production builds

By default, development builds are created which:

1. Append sourcemaps to CSS and JavaScript.
1. Output additional logging.
1. Integrate with nodemon and browsersync for easier development.

Live servers (TEST and LIVE) have the `NODE_ENV` environment variable set to `production`:

```bash
export NODE_ENV=production
```

This removes development facilities and logging - the application will run faster.


## 3. SSL certificates

SSL certificates for specific hosts are placed in the `ssl/<hostname>` folder where `<hostname>` is the server name returned by `hostname -f` or `os.hostname();` in Node.js.


## 4. The gulp.js build process

Builds optimised static assets including:

1. HTML templates: file includes, SVG includes, and common strings (such as the application name) are rendered at build time to create DoT templates.
1. Image compression.
1. Sass compilation. In some cases, images are embedded into the CSS file - this is primarily for SVGs.
1. JavaScript processing. Includes preprocessing order and strings, plus debug stripping, concatenation and minification.
1. Static asset move to build folder. Includes fonts, favicon, and manifest.


## 5. Database update

The database is configured according to the `assure.dbConnect` credentials in `package.json`. All machines define the same `assure3` and `assure3test` MongoDB databases (the test database is largely unused at this time).

The database is updated to the current version using `npm run update live` (and `npm run update test`). The current version is stored in the `settings` collection so it is not possible to re-run it again. However, a single update can be re-applied using `npm run update live <version>` where `<version>` is the semantic version number such as `1.22.3` - this should be avoided unless absolutely necessary.


## 6. The primary application

The application and background processes are started with `npm run all`.

The primary application is launched by starting `app.js` and is handled by `forever` which runs the task in the background (`pm2` may be used later, but is unlikely to provide significant benefits).

The application uses SSL HTTP port 443 so `sudo` mode is required. This is not normally recommended, but it was the only option when Assure was originally built.

Assure launches a primary cluster thread then an additional thread for each available processing core. The application state is complex and calculates the statistics for each company and user on demand (when one or more users access) which is retained in memory. A single core initiates calculations in the background which are then broadcast to other cores on completion.

Statistics calculations can timeout following a server reboot because MongoDB takes several minutes to initialise indexes. It can be necessary to restart Assure until calculations succeed.


## 7. Background processes

Background processes are launched by starting `task.js` which again, is handled by forever. Tasks include:

1. Fetching auto-complete data from other systems.
1. Re-calculating image hashes.
1. Transferring assets to S3.
1. Verifying assets are on S3 and deleting from the database.
1. Expiring users once their active date has passed.
1. Calculating new test alerts.
1. Calculating summary emails.
1. Sending emails (via SMTP to Mailgun).

`task.js` calls one process at a time, enforces a 10-minute timeout limit, and examines `tasks\tasks.json` to determine when processes are run. For example, fetching auto-complete data occurs every three hours but will only wait one hour if an error occurs or six hours outside office hours.

Some tasks use Assure's queue system. For example, alerts and summary emails are placed on the queue for the emailer process to handle. Items are only removed from the queue once an email has been successfully sent.


## 8. Utilities

Several utilities are provided which run direct database updates to clean data. Several are very dangerous!

The most used is the `rename.js` which renames companies across all collections. Assure must be taken down before it is run.


## 9. Third-party utilities

A number of third-party utilities exist outside of the Assure repository. The most-used is Blast which can be used to update hundreds of tests. It is passed a test list URL and data changes in JSON format but, while it warns of potential problems, it has the capacity to wipe thousands of records or data fields.


## 10. Back-up processes

A single cron job runs `~/dbbackup.sh` at 1:00 GMT and retains up to five days of database backups.

Restoring a database from backup is the absolute last resort. It can take many hours, fail, and there is a risk of catastrophic data loss.
