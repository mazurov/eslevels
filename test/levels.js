'use strict';
var path = require('path');
var fs = require('fs');
var expect = require('expect.js');

var esprima = require('esprima');
var eslevels = require('../');

/*global describe: true, it:true */
describe('levels function', function () {
    var inputDir = path.join(__dirname, 'input');
    var file01 = path.join(inputDir, 'file01.js');

    it('should return right list for '+file01, function () {
        var source = fs.readFileSync(file01);
        var ast = esprima.parse(source, {
            range: true
        });
        var levels = eslevels.levels(ast);
        expect(levels).to.eql([
            [0, 0, 14],
            [1, 15, 23],
            [0, 24, 29],
            [1, 30, 93],
            [2, 94, 102],
            [1, 103, 108],
            [2, 109, 143],
            [1, 144, 149],
            [2, 150, 152],
            [1, 153, 158],
            [2, 159, 161],
            [0, 162, 165],
            [2, 166, 199],
            [1, 200, 202]
        ]);
    });
});