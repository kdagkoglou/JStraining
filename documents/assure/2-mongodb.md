# Assure: why MongoDB?

A server-side database is the foundation of almost all web applications. Get the data store right, and the application can succeed.


## SQL databases

SQL databases define data in tables, e.g. a `user` table:

|id|name|email|password|
|-|-|-|-|
|1|Anne|anne@email.com|xxxxx|
|2|Bob|bob@email.com|xxxxx|
|3|Craig|craig@email.com|xxxxx|


A `session` table can then store which user is actively logged on:

|id|userid|starttime|expire|
|-|-|-|-|
|1|3|01-02-2020|07-02-2020|

`user.id` is the foreign key for `session.userid`. Database logic could be defined so that it's impossible to delete user 3 if they have an active login, or all sessions are deleted if user 3 is deleted.

In SQL, strict data schemas are defined. They have referential logic and transactions ensure data integrity is maintained: it becomes impossible to add, edit or remove invalid data. In addition, tables are normalised and data should never be replicated.

99% of web applications *should* use a SQL database.


## MongoDB and NoSQL databases

There are different types of NoSQL but MongoDB is a document store. Instead of tables, you define a collection. Each collection can have any number of documents which are simply JavaScript objects, e.g. a test:

```json
{
  "_id" : ObjectId("55c1cb9a7e52932b4fc950fc"),
  "status" : 1000,
  "country" : "uk",
  "ref" : "test 000001",
  "brand" : "Test One",
  "company" : [
    "Empello Ltd",
    "OptimalWorks Ltd"
  ],
  "adflow" : "web",
  "device" : "mobile",
  "connection" : "m3g",
  "network" : "vf",
  "classification" : "competition",
  "testtype" : "marketing",
  "process" : "manual",
  "url" : "http://test.com",
  "published" : ISODate("2015-08-05T08:38:50.744Z"),
  "checked" : ISODate("2015-11-17T13:18:13.959Z"),
  "created" : ISODate("2015-08-05T08:38:50.744Z"),
  "lastupdated" : ISODate("2015-11-17T13:18:13.959Z"),
  "merchant" : "Empello Ltd"
}
```

A single document can contain any data:

* It need not match others in the collection *(although it should be similar)*.
* References to other documents are generally avoided and data is denormalised *(although it cannot be avoided altogether)*

There is no need to create a schema - you simply add a document to a collection. *(Although be aware that some libraries such as Mongoose make you adopt one which largely defeats the point of using NoSQL!)*

In reality, SQL and NoSQL systems are copying some popular features of each other. For example, MySQL has a JSON field type and MongoDB permits cross-collection lookups in aggregate queries.


## Why does Assure use NoSQL?

Assure had some unusual requirements:

1. It was difficult to determine a schema when Assure was initially created (that's not a great reason usually, though). The UI and API permit new fields without significant development.
1. Tests are generally self-contained documents and data fields can differ.
1. Replicating tests in SQL tables would have been awkward, e.g. a separate company mapping table would have been required.
1. The ratio of data written to data read is considerably higher than most applications. NoSQL writes are generally faster.

With hindsight, MongoDB was a good fit for Assure. I would also consider NoSQL for a WordPress-like CMS, but few other applications would benefit.


## Assure collections

The following collections have been created:

|collection|description|
|-|-|
|test|the primary test data|
|issue|issues applied to one or more tests|
|asset|test images, documents, etc. A file is stored only once even if it has been uploaded many times. File data is eventually transferred to S3.|
|company|a list of companies with the number of tests, users, assignees and regulators. This used for quick reference|
|setting|a single document containing application settings such as the database version, number of tests, last migrated asset, etc.|
|store|a store of name/value pairs. Currently used for auto-fill settings which complete fields when certain combinations of company and brand are entered|
|user|registered users who can log on|
|api|API users with permissions. These define a token that can be used in an API header to upload, modify or delete data as appropriate|
|session|user login sessions|
|queue|items which require processing. For example, one process adds data to the queue when a user should receive an email alert. Another process sends that email. If the sending fails, the queued item can be attempted again.|

All collections have appropriate indexes. Indexes are supported in both SQL and NoSQL and work like an index in a book. For example, the user collection has email and company indexes stored in alphabetical order. The database can then easily find a specific user by their email address or all users for a specific company.

In general, most update tasks modify indexes or change data in some way.
