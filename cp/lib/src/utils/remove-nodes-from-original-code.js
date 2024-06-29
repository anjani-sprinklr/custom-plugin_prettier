"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNodesFromOriginalCode = void 0;
/** Escapes a string literal to be passed to new RegExp. See: https://stackoverflow.com/a/6969486/480608.
 * @param s the string to escape
 */

// it is used to escape any special character( so that its treated as a literal and doesnt give any syntax error while using regex), by putting \ to the entire match found
var escapeRegExp = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };


//The @param tag is used in documentation comments (often JSDoc in JavaScript) to describe the parameters of a function
/**
 * Removes imports from original file
 * @param code the whole file as text
 * @param nodes to be removed
 */


// basically to remove all comments and imprt Statemnets fromoriginal code, by using the regex, and start and end positions

var removeNodesFromOriginalCode = function (code, nodes) {
    var text = code;
   // console.log(code, nodes.length);
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        var start = Number(node.start);
        var end = Number(node.end);
        //console.log(start, end);
        //console.log(code.substring(start, end),'^\\s*' + escapeRegExp(code.substring(start, end)));
        if (Number.isSafeInteger(start) && Number.isSafeInteger(end)) {
            text = text.replace(
            // only replace imports at the beginning of the line (ignoring whitespace)
                // otherwise matching commented imports will be replaced
                
                // ^\\s+ matches any amountvof whitespace characters in the begining
                
            new RegExp('^\\s*' + escapeRegExp(code.substring(start, end)), 'm'), '');
        }
        //console.log(code.substring(start, end));
    }
    return text;
};
exports.removeNodesFromOriginalCode = removeNodesFromOriginalCode;


// null
// describe
// as
// test or it
// without name
// render or setup, or local name

// @/, @sprinklr, ../  :not a library
