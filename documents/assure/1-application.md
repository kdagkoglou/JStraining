# Assure application design

Empello's business has evolved since 2012. The initial PHP/MySQL version of Assure were designed so companies could track their own problems. Unfortunately, companies rarely knew what the problems were and found Assure too complex (it was essentially a configurable database front-end).

Assure2 was an adaptation of the system which created a consistent set of fields for tests. A separate instance of the application was installed for each client - there were more than 100 by 2015.

Assure3 was a new Node.js application started in April 2015 and put into general usage by September 2015 following analysis and experience of existing workflows. It took a different approach:

* there was a single system for all data and users
* simplicity for clients was the overriding factor
* there is little business logic to stop analysts working
* this has increased flexibility; there's usually a workaround without coding
* test fields could evolve over time
* tests could be assigned to any number of companies so the data was shared
* data could be shared with anyone - you did not need to be a user
* clients were saved from the usual password and access problems
* an API allowed other processes to upload data
* agile development was used to launch quickly and evolve rapidly
