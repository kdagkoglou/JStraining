# Tasks (background cron-like jobs)

Assure has various stand-alone command-line applications which perform various background tasks at certain intervals. All tasks run independently of the main Express.js application to ensure efficient processing.


## `userexpire.js`

This process sets a user's `active` status to `false` when the `expire` date is set for them in the `user` collection.

It is run every three hours except between 1:00 and 4:00 when database backups are being run.


## `datalookup.js`

The process retrieves company and affiliate data from a web service at <http://138.68.166.83/api/>. Country-specific data is parsed, constructed into objects, and stored as values in the MongoDB `store` collection. These objects are then used by Assure for auto-fill functionality: entering specific URLs will automatically complete associated brands, companies, MNOs, service types, payment types, etc.

The process is run every six hours between 6:00 and 19:00 daily.


## `s3migrate.js`

Uploaded images and other files are stored as binary data in the `asset` collection. This process uploads each file to S3 in order to reduce the database size, however, the binary data is not removed until transfer has been verified by `s3verify.js`.

Up to 25 assets are uploaded during every execution. It is run every 3 minutes except between 1:00 and 4:00 when database backups are being run.


## `s3verify.js`

This process analyses an asset's data on S3 and in the database. The database data is removed when the match is confirmed.

Up to 25 assets are verified during every execution. It is run every 5 minutes except between 1:00 and 4:00 when database backups are being run.


## `imghash.js`

This process re-generates the perceptual (fuzzy) image hash for the many millions of images stored in the `asset` collection. It starts from the most recently-uploaded image and works through to the oldest. Image data is loaded from the database or S3 as appropriate.

The process is only necessary when a change is made to the hashing algorithm. It takes several weeks to complete and has only been attempted twice in the past four years.

Up to 500 images are processed during a single execution (5 images are processed concurrently in child processes). The next run is started one minute later during evenings (20:00 to 6:00) and weekends.


## `testalert.js`

This process generates the email alerts when a test issue is opened or commented on:

1. The datetime of the last run is determined from the DB `setting` collection (`testalertrun`).
1. All issues opened or commented on since `testalertrun` are fetched. (For regulators, this must be greater that the `regulatoralert` datetime).
1. Fetch data for users associated with those issues who are subscribed to alerts.
1. Construct templates and send emails to the queue.
1. Update `nextissue` and `nextcomment` alert datetime for users.
1. Update `testalertrun`.

It is run every 10 minutes except between 1:00 and 4:00 when database backups are being run.


## `summary.js`

This process sends a summary email to users when they are due (1 to 6 weeks depending on the user's configuration):

1. Active clients with an overdue `nextsummary` datetime.
1. Fetch the number of tests in the period (`n` weeks) which have been raised for each user's company at the required status.
1. Update the user's `nextsummary` as appropriate.
1. Construct templates and send emails to the queue.

Up to 25 users are processed during a single execution. The process runs on a certain day (currently Saturday) at 10-minute intervals.


## `emailer.js`

This process sends queued alert and summary emails via the MailGun service (or any SMTP-compatible service definded in `package.json`). Up to 10 queued items are taken off the queue and emailed. Any failures return to the queue, but items over 8 hours old are purged.

It is run every 10 minutes except between 1:00 and 4:00 when database backups are being run. If more than one email is sent, the process runs again immediately.


## Task configuration and execution

All tasks are launched by running `tasks.js` (`npm run tasks` runs it as a background process using [forever](https://www.npmjs.com/package/forever)). This loads the `tasks/tasks.json` configuration file which determines when a task is run.

On start-up, all tasks are placed on a queue array unless they have `disabled` set true. An item is taken off the queue and executed as a child process with a timeout of 10 minutes (`timeout` in `tasks.json`).

Each task outputs text to the console which is captured, e.g.

* `sent: [10]` - a number of operations (like email sending) were successful
* `errors: [1]` - a number of errors occurred during processing
* `ERROR` - a critical error occurred, such as a database failure
* `SLEEP` - task is not run at this time

This is used to determine when the next run should occur. An example for `emailer.js`:

```json
{
  "name": "Send emails",
  "cmd":  "node ./tasks/emailer.js",
  "result": [
    { "output": "SLEEP", "next": 120 },
    { "output": "ERROR", "next": 30 },
    { "output": "errors", "next": 20 },
    { "output": "sent: [0]", "next": 10 },
    { "output": "", "next": 0 }
  ]
}
```

The output is compared to the `result` configuration in the order shown and will stop at the first match. So, if `emailer.js` output:

* `SLEEP`, the next run would be in 120 minutes (two hours).
* `errors: [1]`, the next run would be in 20 minutes
* `sent: [0]`, the next run would be in 10 minutes
* `sent: [2]`, this would only match the last (default) entry, so the next run would be triggered immediately.

Tasks are processed one at a time but any can be added at any point. Therefore, other operations will be run even when long-running processes are triggered immediately following completion.


## Database backup

Database backups are triggered by a Linux cron job which runs `~/dbbackup.sh` at 2:00 every day. This triggers a `mongodump` to the file named `~/db/backup/dbYYYYMMDD` (where `YYYYMMDD` is the current date). The dump created five days ago is automatically destroyed.

Full content of `~/dbbackup.sh`:

```bash
#!/bin/bash -e
#
# daily MongoDB backup
# register as cron job which runs at 4am every day
# edit : crontab -e
# add line: 0 2 * * * /path/to/this.sh
# restart : service crond restart

backup="/home/ubuntu/db/backup/db"
newbackup=$backup`date +%Y%m%d`
oldbackup=$backup`date -d "5 days ago" +%Y%m%d`

# remove old backup
echo "remove old: $oldbackup"
rm -rf $oldbackup

# create new backup
echo "new backup: $newbackup"
rm -rf $newbackup
mongodump --out $newbackup --quiet
```

### RESTORING THE DATABASE IS A LAST RESORT!

The database backup is a snapshot of data at a moment in time. Restoring it means losing all data added since the backup was made. That includes:

1. new tests, issues, and users
1. edited tests, issues, and users
1. issue comments from analysts and clients
1. user configuration changes
1. application configuration changes, i.e. email alerts could be resent.

It should only be considered in the event of catastrophic data loss.

It should never be considered during standard Assure updates which have changed functionality and database fields. It is normally better to rectify mistakes and omissions by issuing a further update to modify data.
