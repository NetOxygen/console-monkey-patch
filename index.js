"use strict";

var console = require("console");

/*
 * patch all the console stuff documented at https://nodejs.org/api/console.html
 */
function console_monkey_patch(newcons) {
    if (newcons) {
        [
            'log', 'info', 'error', 'warn', 'dir', 'time', 'timeEnd', 'trace',
            'assert'
        ].forEach(function (n) {
            if (newcons[n] instanceof Function)
                console[n] = newcons[n];
        });
    }

    return newcons;
}

module.exports = console_monkey_patch;
