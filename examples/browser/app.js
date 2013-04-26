function getLevels() {
    var code = document.getElementById("code").value
    var output = document.getElementById("output");
    var ast = esprima.parse(code, {range: true});
    var levels = eslevels.levels(ast);
    var curr = 0;
    var result = '';
    for (var pos = 0; pos < code.length; ++pos) {
            if ((curr < levels.length) && (pos === levels[curr][1])) {
                result += '<span class="cm-level' + levels[curr][0] + '">';
            }
            result += escape(code[pos]);

            if ((curr < levels.length) && (pos === levels[curr][2])) {
                result += '</span>';
                curr += 1;
            }
    }        
    output.innerHTML = result;
}    

var htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#x27;',
            '/': '&#x2F;'
        };
var htmlEscaper = /[&<>"'\/]/g;
// Escape a string for HTML interpolation.
var escape = function(string) {
    return ('' + string).replace(htmlEscaper, function(match) {
        return htmlEscapes[match];
    });
};

getLevels();

