# Event object

The event handler is passed a single value which is an [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event). This has many properties and methods but the most useful are:

* `.target` - the element which fired the event (very useful)
* `.type` - the event type, e.g. `click`, `blur`, `mouseover` etc. (a single handler can be used for many types)
* `.currentTarget` - a reference to the element the event was attached to

Methods:

* `.preventDefault()` - cancel the event, e.g. stop a form submitting or a character being entered
* `.stopPropagation()` - stops the event propagating up the DOM
* `.stopImmediatePropagation()` - cancel all other listeners

[Mouse event properties](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

* `.clientX` or `.x` - X co-ordinate in DOM element
* `.clientY` or `.y` - Y co-ordinate in DOM element
* `.pageX` - X co-ordinate in page
* `.pageY` - Y co-ordinate in page
* `.button`

[Keyboard event properties](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent):
Be wary about cross-browser handling.

* `.charCode`
* `.code`
* `.key`
