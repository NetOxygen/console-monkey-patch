"use strict";
/* global Symbol:true */
/* global describe:true */
/* global it:true */

var assert  = require("assert");
var console = require("console");

var console_monkey_patch = require('../');


var targets = [
    'log', 'info', 'error', 'warn', 'dir', 'time', 'timeEnd', 'trace', 'assert'
];

describe("console-monkey-patch", function () {
    it('should noop when null is given', function () {
        assert.doesNotThrow(function () {
            assert.strictEqual(null, console_monkey_patch(null));
        });
    });

    it('should noop when undefined is given', function () {
        assert.doesNotThrow(function () {
            assert.strictEqual(undefined, console_monkey_patch(undefined));
        });
    });

    targets.forEach(function (t) {
        it('should patch console.' + t, function () {
            var newcons;
            // effectively create a new console with the same behaviour as the
            // default.
            newcons = new console.Console(process.stdout, process.stderr);
            assert.strictEqual(newcons, console_monkey_patch(newcons));
            assert.strictEqual(console[t], newcons[t]);
        });
    });

    it('should allow partial patching', function () {
        // create a new console with only the "warn" function.
        var newcons = {
            warn: function () { return 42; }
        };
        // build the set of function that should not change.
        var oldcons = {};
        targets.forEach(function (t) {
            oldcons[t] = console[t];
        });
        assert.strictEqual(newcons, console_monkey_patch(newcons));
        assert.strictEqual(newcons.warn, console.warn);
        for (var f in oldcons) {
            if (f !== 'warn')
                assert.strictEqual(oldcons[f], console[f]);
        }
    });

    it('should only patch functions', function () {
        // create a new console with only the "warn" function.
        var newcons = {
            log: false,         // Boolean
            info: null,         // Null
            error: undefined,   // Undefined
            warn: 42,           // Number
            dir: "42",          // String
            time: Symbol('42'), // Symbol
            timeEnd: {},        // Object
        };
        assert.strictEqual(newcons, console_monkey_patch(newcons));
        for (var f in newcons)
            assert.notStrictEqual(newcons[f], console[f]);
    });
});
