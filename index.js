"use strict";

var console = require("console");

// the methods we can patch
var methods = [
    'log', 'info', 'error', 'warn', 'dir', 'time', 'timeEnd', 'trace', 'assert'
];

/*
 * patch all the console stuff documented at https://nodejs.org/api/console.html
 */
function console_monkey_patch(newcons) {
    if (newcons) {
        methods.forEach(function (n) {
            if (newcons[n] instanceof Function)
                console[n] = newcons[n];
        });
    }

    return newcons;
}

module.exports = console_monkey_patch;
