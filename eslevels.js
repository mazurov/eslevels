/*
  Copyright (C) 2013 Alexander (Sasha) Mazurov <alexander.mazurov@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*global escope: true, define:true, require:true, exports:true */
(function(root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.
    if (typeof exports === 'object') {
        module.exports = factory(require('escope'));
    } else if (typeof define === 'function' && define.amd) {
        define(['escope'], factory);
    } else {
        root.eslevels = factory(escope);
    }
}(this, function(escope) {
    'use strict';
    var exports = {};

    // Cache names levels
    escope.Scope.prototype._cache = null;

    // Store scope level
    escope.Scope.prototype._level = null;

    // **Get scope level**
    //
    // Returns the Integer
    escope.Scope.prototype.level = function() {
        // Don't count functionExpressionScope
        if (this.functionExpressionScope) {
            return this.upper.level();
        }
        if (this._level === null) { // level not caclulated yer
            this._level = 0;
            if (this.upper !== null) {
                // ```upper``` points to parent scope
                this._level = 1 + this.upper.level();
            }
        }
        return this._level;
    };
    
    // **Find variable of function by name**
    //
    // Search in current or upper scopes
    //
    // Returns a level - the Integer
    escope.Scope.prototype.find = function(name) {
        //
        var vars;
        if (this._cache === null) {
            this._cache = {};
        }
        if (this._cache[name] === undefined) {
            vars = this.variables;
            for (var i = 0; i < vars.length; ++i) {
                if (vars[i].name === name) {
                    this._cache[name] = this.level();
                }
            }

            if (this._cache[name] === undefined) {
                if (this.upper === null) {
                    this._cache[name] = 0;
                } else {
                    this._cache[name] = this.upper.find(name);
                }
            }
        }
        return this._cache[name];
    };

    var Region = function(level, first, last) {
        this.level = level;
        this.first = first;
        this.last = last;
    };

    Region.prototype.list = function() {
        return [this.level, this.first, this.last];
    };

    var RegionNode = function(region) {
        this.region = region;
        this.next = null;
    };

    var RegionList = function() {
        this.root = null;
    };

    RegionList.prototype.addRegion = function(region) {
        var curr, prev, firstRegion, midRegion, lastRegion;
        if (this.root === null) {
            this.root = new RegionNode(region);
            return this.root;
        }
        curr = this.root;
        prev = null;
        while (true) {
            if (region.first === curr.region.first) {
                firstRegion = new RegionNode(region);
                lastRegion = new RegionNode(
                    new Region(
                        curr.region.level,
                        region.last + 1,
                        curr.region.last
                    )
                );
                break;
            }
            if (region.last === curr.region.last) {
                firstRegion = new RegionNode(
                    new Region(
                        curr.region.level,
                        curr.region.first,
                        region.first - 1
                    )
                );
                lastRegion = new RegionNode(region);
                break;
            }
            if ((region.first > curr.region.first) &&
                (region.last < curr.region.last)) {
                firstRegion = new RegionNode(
                    new Region(
                        curr.region.level,
                        curr.region.first,
                        region.first - 1
                    )
                );
                midRegion = new RegionNode(region);
                lastRegion = new RegionNode(
                    new Region(
                        curr.region.level,
                        region.last + 1,
                        curr.region.last
                    )
                );
                break;
            }
            prev = curr;
            curr = curr.next;
        }

        if (midRegion !== undefined) {
            firstRegion.next = midRegion;
            midRegion.next = lastRegion;
        } else {
            firstRegion.next = lastRegion;
        }
        lastRegion.next = curr.next;
        if (prev !== null) {
            prev.next = firstRegion;
        } else {
            this.root = firstRegion;
        }
        //console.log(this.root);
    };

    RegionList.prototype.list = function() {
        var result = [];
        var curr = this.root;
        while (curr !== null) {
            result.push(curr.region.list());
            curr = curr.next;
        }
        // console.log(result);
        return result;
    };


    function addMainScopes(result, scopes) {
        for (var i = 0; i < scopes.length; i++) {
            if (!scopes[i].functionExpressionScope) {
                result.addRegion(
                    new Region(
                        scopes[i].level(),
                        scopes[i].block.range[0],
                        scopes[i].block.range[1]
                    )
                );
            }
        }
    }

    function addScopeVariables(result, scope) {
        var refs = scope.references,
            vars = scope.variables;
        var level, identifier;
        for (var i = 0; i < vars.length; i++) {
            if ((vars[i].defs.length > 0) &&
                (vars[i].defs[0].type === 'FunctionName')) {
                result.addRegion(
                    new Region(
                        scope.level(),
                        vars[i].identifiers[0].range[0],
                        vars[i].identifiers[0].range[1] - 1
                    )
                );
            }
        }

        for (i = 0; i < refs.length; i++) {
            identifier = refs[i].identifier;
            level = scope.find(identifier.name);
            if (level !== scope.level()) {
                // console.log(identifier.range);
                result.addRegion(
                    new Region(
                        level,
                        identifier.range[0],
                        identifier.range[1] - 1
                    )
                );
            }
        }
    }

    var getScopes = function(ast) {
        if (typeof ast === 'object' && ast.type === 'Program') {
            if (typeof ast.range !== 'object' || ast.range.length !== 2) {
                throw new Error('eslevels: Context only accepts a syntax tree'+
                    'with range information');
            }
        }
        return escope.analyze(ast).scopes;
    };

    exports.levels = function(ast) {
        var result = new RegionList();
        var scopes = getScopes(ast);
        addMainScopes(result, scopes);
        for (var i = 0; i < scopes.length; i++) {
            addScopeVariables(result, scopes[i]);
        }
        return result.list();
    };

    return exports;
}));
