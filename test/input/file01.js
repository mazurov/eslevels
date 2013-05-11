var glob = 10;
gl = 12;
function Level1(param1) {
    'use strict';
    var fromLevel1 = 1;
    try {

    } catch(e) {
        var try1, try2=e;
    }
    return function Level2(param2) {
       var fromLevel2 = param1 + param1 + glob;
       return fromLevel2;
    };
}