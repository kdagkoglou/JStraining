# Issues

Assure's issue tracking is complicated. It is easy for users and administrators to use, but there are many states and conditions. Always be wary when someone asks for a change or new feature: they will not know how others see the system.


## Basic concepts

An issue is raised when there is a fault that should be fixed. This can range from a simple text problems to fraudulent activities.


### Commentator

Someone who can comment on an issue (in the discussions box).

They must be a member of a company referenced on the test or an Empello administrator.


### Assignee

Someone who can acknowledge an issue and mark it as fixed.

Assignees also have full commentator rights. They must be a member of a company referenced on the test or an Empello administrator.


### Regulator

Someone who can close an issue. This can mark the fix as verified (it's been tested) or unverified (it's not been tested, but we trust the assignee!)

Regulators also have full assignee and commentator rights. They must be a member of a company referenced on the test or an Empello administrator.

*Do not confuse **regulator** with an industry regulator - they need not be one.*


### Company users

Any user can be assigned commentator, assignee or regulator rights - even users within the same company. It is possible for a company to be both the assignee and regulator on the same issue.


### Linked issues

A single issue can be linked to up to 100 tests. This can be useful when the same problem is spotted multiple times, e.g. a number of tests reach the same landing page where the price is missing.

To assign an existing issue to another test, Assure shows the most recent issues for a country where the issue assignee and regulator companies are present on the test.

Fixing a linked issue on one test fixes them on all tests.


### Issue work flow

The system is flexible but, in general, the following process occurs:

1. An analyst adds an issue to a test.
1. The issue is assigned to an assignee company and a regulator company.
1. Assignees in the assignee company receive an email alert or see the issue on the dashboard. They can acknowledge the issue or add comments.
1. An assignee fixes the issue (this also marks it as acknowledged if that has not already occurred).
1. Regulators in the regulator company receive an email alert or see the issue on the dashboard. This can happen after a delay of N hours.
1. The regulator can close the issue as either verified or unverified.

This is the full process but not all steps necessarily occur. For example:

* no assignee is set
* no regulator is set
* the issue is closed before the regulator delay expires - they never receive an alert
* users are not configured to receive alerts for particular types of event or status

Various buttons can be shown depending on the user type and issue state:

* **RESPOND** - add a comment only
* **ACKNOWLEDGE** - adds an optional comment and acknowledges receipt by an assignee
* **FIXED** - adds an optional comment and marks an issue as fixed by an assignee
* **CLOSE** - adds an optional comment and marks the issue as fixed and closed by a regulator
* **CLOSE/UNVERIFIED** - adds an optional comment and marks the issue as (possibly) unfixed but closed by a regulator


## Issue data

The MongoDB `issues` collection is separate from the `test` collection so issues can be linked to one or more tests. This has a performance cost so the country and status is duplicated on issue data to aid searching and linking.

The issue definition also contains dates:

1. The date the issue was opened (always required).
1. The date the issue was acknowledged by an assignee (optional).
1. The date the issue was fixed by an assignee (optional).
1. The date the issue was closed (optional, but should occur eventually).

When an issue is closed as unverified, the fixed date (if any) is removed.

A retest date can also be set if the analyst wants to check the test at a future date.

One or more breach types are normally set or an issue note must be entered.

The status must be set to technical, medium, high or pink.

The issue can be assigned to an assignee company. Only companies on the test with one or more assignee users can be set.

The issue can be assigned to an regulator company. Only companies on the test with one or more regulator users can be set.

A regulator notice period of N hours can be defined. The issue will only be sent via email alerts and appear on the dashboard for regulators after that period has expired.

Any user with commenting rights can comment on the test. This leaves a message, their user name, and a timestamp.


## Flexible vs Rational

Issue tracking is flexible but few people appreciate the underlying complexity. No user sees all the options, so they presume others see the same! We've had requests to:

* add buttons that already exist in some views
* remove buttons that don't exist in all views
* remove issue closing rights from regulators despite that being the only right they have!
* adding further user types which would dramatically increase complexity

Recommendation: users always try to suggest solutions based on their limited understanding of the system and technology. Never presume you are the implementer of their vision - it is up to you to find out what the problem is. Only then can you determine the most practical approach.


However, this flexibility means analysts can do unusual things, e.g.

* link two or more unrelated issues
* attempt to link hundreds of tests to a single issue (it may have been better to remove duplicate tests)
* link an issue then change the assignee or regulator to a company which does not exist on other tests.


There are some known "features", e.g.

* changing the country on a test with an issue removes/unlinks the issue entirely
* changing the status on an issue will change it on all linked tests
* changing the assignee or regular does ... nothing. It's permitted. It would be dangerous to add or remove companies from linked tests. Therefore, the issue remains as-is but it may effectively be invalidated on some tests.

