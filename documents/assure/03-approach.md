# Assure development

Assure uses industry best practises.


## Minimal business logic

Very few restrictions are placed on analysts. Tests can have almost no data and still be saved so the analyst can progress. The system therefore remains flexible. Often, new features are "implemented" by applying a workaround rather than writing new code.

Always be certain that a new feature is required and has not been implemented in some way already.


## User-centric

The application puts clients first and all unnecessary distractions are removed.

That said, most users are probably unaware of features such as the help, keyboard shortcuts, URL bookmarking, field focusing, etc.


## Data-first

The data requirements come before any coding takes place. Fields are only added where absolutely necessary.


## API-first

Assure's API is effectively a machine-usable version of the UI. For example, adding a new test field to the UI means it is instantly available in the API without further coding.


## Mobile-first UI

The interface adopts a simpler linear mobile interface. This expands when a more capable device with a larger screen is used.


## Lightweight

The application is very lightweight. This is important since it is used around the world on slower or mobile connections.

The dashboard requires just 90Kb of code, and a test list is typically 52Kb. This includes 12.4Kb of compressed CSS and 16.2Kb of compressed JavaScript which is cached across pages.

Browser-based controls have been used in preference to JavaScript alternatives, e.g. an HTML5 email field has been used instead of client-side regular expression validation (although code-based validation is still used server-side).

Where possible, savings are made at build time rather than render time.

*Always assess the payload and avoid third-party client-side libraries.*


## Progressive Enhancement

Assure will work in every browser because Progressive Enhancement is adopted:

1. Features are developed in HTML alone.
1. CSS is used to enhance the HTML when supported.
1. JavaScript is used to enhance the HTML and CSS when supported.

Some aspects of the application may not work in older browsers, e.g. dragging a file to the browser. However, the user may still be able to use the browse button and choose a file manually.

* A-grade browser support is provided for Chrome, Firefox, Edge (EdgeHTML version) and all Blink-based applications.
* B-grade browser support is provided for IE11.

Safari is generally considered A- since it will support most features but it's not tested often.


## Server-rendered initial load

Assure is a series of single-page apps rather than a single monolithic SPA. The initial page load is always server-rendered which means it is fast and works regardless of JavaScript. Other benefits include:

* reliability: a fault in one page cannot cause the whole application to stop
* memory use: the browser clears RAM between page loads
* practicality: every view has a URL which can be bookmarked or sent to others (the history API is used even when JavaScript controls the view)
