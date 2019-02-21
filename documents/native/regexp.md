# Regular Expressions

Regular expressions (regexs) are string matching patterns which can be used to:

* verify data, e.g. is a value an email address, telephone number, co-ordinate, etc.
* search and replace, e.g. convert markdown to HTML or vice versa.

Regexs are incredibly powerful and supported in most languages. Developing without them would require many lines of code. However, they can be difficult to read.


## Creating regular expressions

JavaScript allows you create an expression with flags in two ways. The first is a literal between slashes:

```js
// find abc and ignore the case
let re = /abc/i;
```

The second calls the constructor of the [RegExp object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

```js
// find abc and ignore the case
let re = new RegExp('abc', 'i');
```

This second method can be used to dynamically create regular expressions:

```js
let char = 'c';
let re = new RegExp('ab' + char, 'i');
```


## Using a regular expression

The regex itself offers two methods:

1. [regex.test(string)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) - returns true or false when a match can be made
1. [regex.exec(string)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) - returns a result array or null

Examples:

```js
let re = /abc/i;
let str = '123ABC456DEF';

console.log( re.test(str) ); // true

console.log( re.exec(str) ); // ['ABC']
```

Strings also provide the following methods:

1. [string.search(regex)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search) - returns the index of the first match or -1
1. [string.split(regex)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) - splits a string into an array of sub-strings
1. [string.match(regex)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) - returns a result array or null
1. [string.replace(regex, str)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) - returns a new string following a search and replace

```js
let re = /abc/i;
let str = '123ABC456DEF';

console.log( str.search(re) ); // 3
console.log( str.split(re) ); // ['123', '456DEF']
console.log( str.match(re) ); // ['ABC']
console.log( str.replace(re, 'abc') ); // '123abc456DEF'
```


## Special characters

Regular expressions are rarely this simple! Most will use [special characters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters) to loosely match strings. More often used characters:

|character|explanation|
|-|-|
|`^`|match from the beginning of the string, `/^ab/` matches `abc` but not `bac`|
|`$`|match to the end of the string, `/ab$/` matches `cab` but not `abc`|
|`.`|matches a single character (except a carriage return), `/a.c/` matches `abc`, `axb` etc.|
|`?`|matches the preceding expression 0 or 1 times, `/a?b/` matches `b`, `ab`|
|`*`|matches the preceding expression 0 or more times, `/a*b/` matches `b`, `aaab`|
|`+`|matches the preceding expression 1 or more times, `/a+b/` matches `ab`, `aaab`|
|`{n}`|matches the preceding expression between n times, `/a{2}b/` matches `aab` but nothing else|
|`{min,max}`|matches the preceding expression between max and min times, `/a{1,2}b/` matches `ab` and `aab` but nothing else|
|`(x)`|matches the expression and remembers the match for $1, $2, etc. variables, e.g. `'AB'.replace(/(.)(.)/,'$2$1')` returns `BA`|
|`(?:x)`|matches the expression but does not remember it|
|`x|y`|matches x or y; `/a|b/` matches `a` or `b`|
|`[xyz]`|a character set, `/^[1-4]?[0-9]?$/` matches `'0'` to `'49'`|
|`\s`|matches any whitespace character|
|`\S`|matches any non-space character|
|`\d`|matches any digit character|
|`\D`|matches any non-digit character|
|`\w`|matches any alphanumeric character - same as [A-Za-z0-9_]|
|`\D`|matches any non-alphanumeric character|

The following flags can also be applied:

|flag|explanation|
|-|-|
|`g`|global search, e.g. replace all instances: `'abcba'.replace(/a/g, '')` returns `bcb`|
|`i`|case-insensitive search, `/a/ig` finds all instances of `a` or `A`|
|`m`|multi-line search|
|`s`|allows `.` to match newline characters|


## Tips

HTML5 input fields can set emails, URLs, numbers, etc. but you will still need to verify those values on the server.

Be wary that Mac and Linux line endings are normally `\n` while Windows uses `\r\n`. This can be a problem when parsing user strings. I often normalise a string by using a character to remember line-endings (`^` below) then remove all unnecessary whitespace, e.g.

```js
let inputString = '  something\r\n \r from \n the \r\n  \n user\n\n';

inputString
  .replace(/\s*\n\s*/g, '^')
  .replace(/\s+/g, ' ')
  .replace(/\^+/g, '^')
  .replace(/^\^|\^$/g, '')
  .replace(/\^/g, '\n')
  .trim();

/* result (all line endings use \n):
something
from
the
user
/*
```


## Tools

Good options include:

* [Refiddle](http://refiddle.com/)
* [Regexly](https://regexly.chipto.io/)
* [Regexr](https://regexr.com/)
* [RegEx Pal](https://www.regexpal.com/)
* [Regex](http://regex.larsolavtorvik.com/)

Ensure you set JavaScript regular expression options rather than PHP or Perl.
