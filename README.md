[![Build Status](https://travis-ci.org/mazurov/eslevels.png)](https://travis-ci.org/mazurov/eslevels)  [![Stories in Ready](https://badge.waffle.io/mazurov/eslevels.png?label=ready)](https://waffle.io/mazurov/eslevels)

![Status](https://nodei.co/npm/eslevels.png)


EsLevels
=======

ECMAScript scope **levels** analyzer based on [escope](https://github.com/Constellation/escope) library.
The original purpose of this library is to enable scope context coloring in javascript editors
(for [SublimeText](https://github.com/mazurov/sublime-levels) in first order).

The library has only one method `levels(syntax, options)`.  It requires the use of a javascript's
Mozilla Parser AST argument that can be obtained from such parsers as [esprima](git://github.com/ariya/esprima.git)
([acorn](https://github.com/marijnh/acorn) parser has different "range" format). The leavels method returns an array of tuples.
Each tuple contains 3 numbers:

*  nesting level number &mdash The Integer : -1 for implicit global variables, deeper scopes have higher numbers 0,1,2,...
*  a level's starting position
*  a level's end position

Eslevels runs on many popular web browsers, as well as other ECMAScript platforms such as V8 and Node.js.

## Getting Started

### Installation

Eslevels library is only a single file that you can grab directly from
[repository](https://raw.github.com/mazurov/eslevels/master/eslevels.js), or
use [npm](https://npmjs.org/package/eslevels) or [bower](http://bower.io/) package managers

**Npm:**

```sh
$> npm install eslevels
```

, or you could clone a library source code with examples

```sh
$> git clone https://github.com/mazurov/eslevels.git
$> cd eslevels
$> npm install
```

**Bower:**

```sh
$> bower install eslevels
```

### Usage

#### Library interface

**Basic usage:**
```var levels = eslevels.levels(syntax, options)```

How to get ```syntax``` is described at [esprima documentation](http://esprima.org/doc/index.html) in details.

```options``` is a dictionary and so far only one option is available:

* **mode** &mdash; The String control what javascript constructions should be marked. Available values:
  - __"full"__ &mdash; (default)  Mark a whole source code (white spaces, operators, all keywords,...)
	- __"mini"__ &mdash; Mark only important scope-related constructions (identifiers, function and catch keywords)

You can understand the meaning of **mode** option from the pictures below:

* "full" mode:

![Full mode](https://raw.github.com/mazurov/eslevels/master/docs/images/mode-full.png)

* "mini" mode:

![Mini mode](https://raw.github.com/mazurov/eslevels/master/docs/images/mode-mini.png)


#### In a web browser

Open example/browser/index.html in your browser. You will see scope colorizing example.

You need to include 4 scripts:

```html
<script type="text/javascript" src="esprima.js"></script>
<script type="text/javascript" src="estraverse.js"></script>
<script type="text/javascript" src="escope.js"></script>
<script type="text/javascript" src="eslevels.js"></script>
```

 Then parse source code and obtain levels information:

 ```javascript
 var syntax = esprima.parse(code, {range: true});
 var levels = eslevels.levels(syntax);
 console.log(levels);
 ```

![demo](https://raw.github.com/mazurov/eslevels/master/examples/browser/screenshot.png)

#### With Node.js

Clone the library source code (described in install section) and run an example:

```sh
$> node examples/nodejs/app.js example/nodejs/example.js
```

In console you will see an ouput of ``levels`` function runned on ```example/nodejs/example.js``` file.

Something like this:

```javascript
[ [ 0, 0, 14 ],
  [ -1, 15, 16 ],
  [ 0, 17, 23 ],
  [ 1, 24, 32 ],
  [ 0, 33, 38 ],
  [ 1, 39, 108 ],
  [ 2, 109, 131 ],
  [ 1, 132, 135 ],
  [ 2, 136, 137 ],
  [ 1, 138, 141 ],
  [ 2, 142, 151 ],
  [ 1, 152, 162 ],
  [ 2, 163, 171 ],
  [ 1, 172, 177 ],
  [ 2, 178, 212 ],
  [ 1, 213, 218 ],
  [ 2, 219, 221 ],
  [ 1, 222, 227 ],
  [ 2, 228, 230 ],
  [ 0, 231, 234 ],
  [ 2, 235, 268 ],
  [ 1, 269, 271 ] ]
```


## Credits

* Yusuke Suzuki (twitter: @Constellation) and other contributors of escope library.
