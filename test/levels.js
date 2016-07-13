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
	var file02 = path.join(inputDir, 'file02.js');

	it('should return right list for "full" mode in ' + file01, function () {
		var source = fs.readFileSync(file01);

		var ast = esprima.parse(source, {
			range: true
		});
		var levels = eslevels.levels(ast, {
			mode: 'full'
		});
		expect(levels)
			.to.eql([	[0, 0, 14],
						[-1, 15, 16],
						[0, 17, 23],
						[1, 24, 32],
						[0, 33, 38],
						[1, 39, 108],
						[2, 109, 131],
						[1, 132, 135],
						[2, 136, 137],
						[1, 138, 141],
						[2, 142, 150],
						[1, 151, 162],
						[2, 163, 171],
						[1, 172, 177],
						[2, 178, 212],
						[1, 213, 218],
						[2, 219, 221],
						[1, 222, 227],
						[2, 228, 230],
						[0, 231, 234],
						[2, 235, 267],
						[1, 268, 270]
					]);
	});

	it('should return right list for "mini" mode in ' + file01, function () {

		var source = fs.readFileSync(file01);

		var ast = esprima.parse(source, {
			range: true
		});
		var levels = eslevels.levels(ast, {
			mode: 'mini'
		});
		expect(levels)
			.to.eql([	[0, 4, 7 ],
						[ -1, 15, 16 ],
						[ 1, 24, 31 ],
						[ 0, 33, 38 ],
						[ 1, 40, 45 ],
						[ 1, 76, 85 ],
						[ 2, 109, 113 ],
						[ 2, 115, 115 ],
						[ 1, 132, 135 ],
						[ 1, 138, 141 ],
						[ 2, 143, 143 ],
						[ 2, 163, 170 ],
						[ 1, 172, 177 ],
						[ 2, 179, 184 ],
						[ 2, 200, 209 ],
						[ 1, 213, 218 ],
						[ 1, 222, 227 ],
						[ 0, 231, 234 ],
						[ 2, 251, 260 ]
					]);
	});

	it('should parse file with import declarations' + file02, function () {
		var source = fs.readFileSync(file02);

		var ast = esprima.parse(source, {
			range: true,
			sourceType: 'module'
		});
		var levels = eslevels.levels(ast, {
			mode: 'mini',
			escopeOpts: {
				sourceType: 'module',
				ecmaVersion: 6
			}
		});
		expect(levels)
			.to.eql( [ [ 1, 7, 15 ] ] );
	});

});
