# console-monkey-patch
Hack the console object methods (like log, error, info etc.).

## Abstract
In Node.js it is sometime desirable to redirect `console.log` & Co. calls to a
given stream but not possible to actually replace `stdout` and/or `stderr`.
This module allow to override `console` methods in a simple way.

## Installation
    npm install console-monkey-patch

## Simple example
The most simple example is to create a new `console.Console` object (see
https://nodejs.org/api/console.html#console_class_console):
```javascript
var fs = require("fs");
var newstdout = fs.createWriteStream('/tmp/stdout.log', {flags: 'a'});
var newstderr = fs.createWriteStream('/tmp/stderr.log', {flags: 'a'});
var newcons   = new console.Console(newstdout, newstderr);

require("console-monkey-patch")(newcons);

console.log('this should go to /tmp/stdout.log');
console.error('this should go to /tmp/stderr.log');
```

## Limitations
The module only override the `console` methods documented at
https://nodejs.org/api/console.html and does not replace `process.stdout` and
`process.stderr`. As a result, code (including modules) using directly theses
streams won't be "affected".

# LICENSE
MIT, see MIT-LICENSE.
