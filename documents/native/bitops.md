# Bitwise operations

Operations on bits (0 or 1) is incredibly fast in any language. That said, be aware of code readability: `x * 2` will always be more obvious than `x << 1`.

## Boolean logic

You can set numbers in a variety of bases:

```js
// decimal - all values below are equivalent
let d = 123;

// hexadecimal
let h = 0x7b;

// octal
let o = 0o173;

// binary
let b = 0b01111011;
```

One reason hexadecimal is so useful is because each digit maps directly to four binary digits (half a byte):

```txt
0111 1011
   7    b
```

Each octal digit maps to three binary digits, but this is generally less useful:

```txt
001 111 011
  1   7   3
```

A Number value can be converted to a string representation of other bases using `toString`, e.g.

```js
let d = 123;
console.log( d.toString(16) ); // 7b
console.log( d.toString( 8) ); // 173
console.log( d.toString( 2) ); // 1111011
```

A string value can be converted another base using `parseInt(string, radix)` where the radix is the base from 2 to 36:

```js
let b = '1111011';
console.log( b.toString(2) ); // 123
```

You can also [encode and decode base-64 data](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding) in browser client-side code using `btoa()` and `atob()` respectively:

```js
let h = btoa('Hello');  // SGVsbG8=
console.log( btoa(h) ); // Hello
```

This is often used to manage images or obfuscate code or strings.

## Bitwise operators

Binary numbers in JavaScript use 32-bits, however, if the left-most bit is one, the number is presumed to be negative. This means numbers range from -2,147,483,648 to +2,147,483,648. The primary JavaScript [bitwise operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators):

|operator|syntax|description|
|-|-|-|
|AND|`a & b`|`1` returned where corresponding bits are both `1`|
|OR|`a | b`|`1` returned where either corresponding bit is `1`|
|XOR|`a ^ b`|`1` returned where either corresponding bit - but not both - is `1`|
|NOT|`~ a`|inverts all bits|
|left shift|`a << b`|shifts `a` bits by `b` places to the left, e.g. `0b10 << 1 === 0b100`|
|right shift|`a >> b`|shifts `a` bits by `b` places to the right and preserves the +/- sign, e.g. `-7 >> 1 === -4`|
|right shift|`a >>> b`|shifts `a` bits by `b` places to the right but discards the +/- sign, e.g. `-7 >>> 1 === 2147483644`|

A left shift by one multiplies a number by two. Similarly, a right shift divides by two (rounded to the nearest integer).

These operators are not used often but may be handy for image processing, encryption, and masking.

Basic encryption using a known XOR value:

```js
let key = 12345;
let data = 98765;

let encrypted = data ^ key; // 111092

// 111092 is transmitted somewhere

// it can then decoded by anyone who has the key:
console.log(encrypted ^ key) // 98765
```

Basic masking using AND and merging with OR:

```js
let v = 0x7b;

// swap hex values around, i.e. obtain 0xb7

// mask values
let
  d1 = v & 0b11110000,  // 70
  d2 = v & 0b00001111;  // 0b

// shift
d1 >>= 4; // same as d1 = d1 >> 4, result is 07
d2 <<= 4; // same as d2 = d2 << 4, result is b0

// merge back
let r = d1 | d2;

console.log( r.toString(16) ); // b7
```
