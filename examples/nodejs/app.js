var fs = require('fs');
var esprima = require('esprima');
var eslevels = require('../../eslevels');

var script = process.argv[2];
var code = fs.readFileSync(script);
var ast = esprima.parse(code, {range: true});

var levels = eslevels.levels(ast);

console.log(levels);
