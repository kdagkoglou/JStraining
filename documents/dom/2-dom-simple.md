# Simple DOM manipulation
Changing the DOM is an expensive operation (some frameworks use virtual DOMs).

However, it's rarely necessary to make big changes to the DOM. Often, a widget is already on the page but it has been hidden or moved using CSS. JavaScript can then apply or toggle a class which triggers other CSS styles which animate or move that element.

## Element information
Information about an element can be obtained using methods including:

* `.textContent` - the text content of the current node and its children
* `.nodeType` - the [node type](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType), i.e. 1 = element, 3 = text, 8 = comment
* `.nodeName` - tag name in uppercase, e.g. `DIV`, `H1` etc.
* `.className` - all classes set in a single string
* `.classList` - [manipulate classes](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) using `.add()`, `.remove()`, `.toggle()`, `.contains()` and `.replace()`
* `.getAttribute([name])` - get an attribute value (can also use a direct `.property`, e.g. `node.id` or `node.href`)
* `.dataset` - [extract HTML5 `data-` attributes](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)
* `.nodeValue` - the text value of a node

Presume you had selected the first list item into the value `li`. That itself does not have a `.nodeValue`! It's first (and only) child is a text node so `li.firstChild.nodeValue` returns `"item 1"`.

Finally, `.innerHTML` and `.outerHTML` return string representation of the HTML itself.


## Changing node values
Some of the properties above can be changed, i.e.

* `node.textContent = 'new text';`
* `node.className = 'active';`
* `node.classList.toggle('active');`
* `node.setAttribute('id', 'myID');` (or node.id = 'myID')
* `node.removeAttribute('id');`
* `node.dataset.value = 1`
* `node.style.color = '#f00'`

### Notes
Cache selected nodes where possible - there's no need to keep fetching the same set.

It's best to avoid using `.style` when you can apply styles in CSS and enable them using a class.

`node.innerHTML = ` and `node.outerHTML = ` can also be used although it can be dangerous, error prone, and a security risk to handle strings.
