# Assure maintenance

Assure normally runs well for many weeks at a time but there are background maintenance jobs to keep things running smoothly.


## Process monitoring

The process log often reports problems before users are aware:

```bash
sudo -s
forever list
more /home/ubuntu/.forever/XXXX.log
```

where `XXXX` is the log name for process `0`, `app.js`

The `top` command also reveals `%CPU` and `%MEM` usage:

* `mongod` (MongoDB) is always the busiest process and typically uses half the CPU and memory or more during busy times
* the 16 `node` processes (Assure) rarely exceed 1% each.

`node` memory overflows eventually cause Assure to run slowly, crash, and restart. They are rare and often caused by bad callbacks, i.e. `process.nextTick` has not been used when an immediate error callback is necessary.


### Clear MongoDB log

MongoDB creates a huge log file at `/var/log/mongodb/mongod.log` which would eventually cause the OS to run out of disk space. (I have attempted less verbose configuration settings but it rarely makes a difference!)

To reset it, run the following commands from the `mongo` prompt:

```txt
use admin;
db.runCommand({logRotate:1});
```

The old `.log` file is copied to a new one which normally contains the date - this can be deleted with `sudo rm <file>`.

`.gz` files in the `/var/log/` folder can also be safely deleted.


## Module updates

Assure's third-party modules are kept up-to-date to ensure security patches and changes are applied. In general, module updates are applied when other changes are implemented.

`npm outdated` shows which modules have new versions so `package.json` can be updated accordingly. Exact version numbers are used (without `^`) to guarantee the same versions are installed on all servers.

Relatively few third-party modules are used and most are Gulp.js plugins used at build time. The core application modules:

|module|description|
|-|-|
|`express`|Express.js server|
|`body-parser`|Express.js middleware to parse incoming POST requests|
|`multer`|Express.js middleware to parse incoming `multipart/form-data` requests|
|`express-dot-engine`|Express.js doT template system|
|`compression`|Express.js GZIP middleware|
|`serve-favicon`|Express.js favicon middleware|
|`mongodb`|MongoDB database driver|
|`jimp`|image processing library used to calculate fuzzy image hashes|
|`xlsx-populate`|Excel file manipulation used by MO export report|
|`nodemailer`|email sending|
|`request`|HTTP calls used to fetch Assure and other API data|
|`aws-sdk`|AWS (S3) upload/download modules|

Express.js and middleware modules update infrequently and rarely cause compatibility problems.

`multer` and `jimp` have changed APIs a few times but code changes are usually minimal.

`mongodb` is updated every few months and new major versions can change the API. Warnings are usually output to the log, but significant changes may be necessary. **These should not be ignored!...** they are often introduced by updates to MongoDB itself.

`aws-sdk` updates occur almost daily but the API remains consistent.


## OS updates

The TEST and LIVE servers run Ubuntu Server 14.04. The latest distro and application patches are applied regularly:

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-update
sudo apt-get autoremove
sudo apt-get clean
```

This will not upgrade Node.js or MongoDB to the next major/minor versions.

Support for Ubuntu 14.04 ends in 2019 so a full OS upgrade must be considered.


## Node.js upgrades

In general, Long-Term Support (LTS) editions of Node.js are installed on the LIVE and TEST servers. These are normally the even-numbered versions (6, 8, 10, 12 etc.)

To upgrade Node.js to the next version:

1. Install using the [package manager instructions](https://nodejs.org/en/download/package-manager/) (this currently leads to [NodeSource Binary Distributions](https://github.com/nodesource/distributions/blob/master/README.md#debinstall))
1. Remove Assure's `node_modules` directory and `package-lock.json` file (`rm -rf ./node_modules && rm package-lock.json`)
1. Reinstall all modules with `npm i`
1. Update global modules with `npm update -g`.


## MongoDB updates

Assure was initially developed for MongoDB 2.2 but has been migrated to the latest current version when available. This often provides new features and performance improvements.

The process:

1. Ensure all Assure tasks have finished, i.e. no items are queued.
1. Shut down Assure and sevices.
1. Run `s3migrate.js` and `s3verify.js` tasks until all assets are migrated to S3.
1. Back up the database using `mongodump`.
1. Make a copy of the MongoDB configuration file at `/etc/mongod.conf`.
1. Remove all MongoDB applications and data files.
1. Install the new edition of MongoDB.
1. Modify the configuration accordingly and restart the service.
1. Restore the database from its backup.

*And hope for the best...*
