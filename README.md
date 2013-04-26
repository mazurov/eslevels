EsLevels
=======

ECMAScript scope **levels** analyzer based on [escope](https://github.com/Constellation/escope) library.
The original purpose of this library is to enable scope context coloring in javascript editors 
(for [SublimeText](https://github.com/mazurov/sublime-levels) in first order).

The library has only one method `levels(js_ast_tree)`.  It requires the use of a javascript's
Mozilla Parser AST argument that can be obtained from such parsers as [esprima](git://github.com/ariya/esprima.git)
([acorn](https://github.com/marijnh/acorn) parser has different "range" format). The method returns an array of tuples.
Each tuple contains 3 numbers:

*  nesting level number (0 is global,  deeper functions have higher numbers),
*  a level's starting position
*  a level's end position

Eslevels runs on many popular web browsers, as well as other ECMAScript platforms such as V8 and Node.js.

## Install 

```sh
$> npm install https://github.com/mazurov/eslevels.git
```

,or you could clone a library source code with examples

```sh
$> git clone https://github.com/mazurov/eslevels.git
$> cd eslevels
$> npm install
```


## Browsers
 
 Open example/browser/index.html in your browser. You will see scope colorizing example.

You need to include 4 scripts:

```html
<script type="text/javascript" src="esprima.js"></script>
<script type="text/javascript" src="estraverse.js"></script>
<script type="text/javascript" src="escope.js"></script>
<script type="text/javascript" src="eslevels.js"></script>
```
 
 Then parse source code and obtain levels:

 ```javascript
 var ast = esprima.parse(code, {range: true});
 var levels = eslevels.levels(ast);
 console.log(levels);
 ```

![demo](https://raw.github.com/mazurov/eslevels/master/examples/browser/screenshot.png)

<<<<<<< HEAD
## Node
=======
## NodeJs
>>>>>>> 7d87cbfd666bc69a688c825536ebd7636ec7ea33

Clone the library source code (described in install section) and run example:

```sh
$> node examples/nodejs/app.js example/nodejs/example.js
```

In console you will see an ouput of ``levels`` function runned on ```example/nodejs/example.js``` file.

Something like this:

```javascript
[ [ 0, 0, 14 ],
  [ 1, 15, 23 ],
  [ 0, 24, 29 ],
  [ 1, 30, 75 ],
  [ 2, 76, 84 ],
  [ 1, 85, 90 ],
  [ 2, 91, 125 ],
  [ 1, 126, 131 ],
  [ 2, 132, 134 ],
  [ 1, 135, 140 ],
  [ 2, 141, 148 ],
  [ 1, 149, 150 ] ]

```