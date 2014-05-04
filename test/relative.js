var test = require('tap').test;
var mdeps = require('module-deps');
var bpack = require('browser-pack');
var insert = require('../');
var concat = require('concat-stream');
var vm = require('vm');

test('use relative path for process', function (t) {
    t.plan(1);
    var files = [ __dirname + '/relative/main.js' ];

    var path = require('path');
    var expectedPath = path.join('..', 'node_modules', 'process', 'browser.js');
    var result = insert.vars.process();

    var s = mdeps(files, { transform: [ inserter ] })
         .pipe(bpack({ raw: true }));

    s.pipe(concat(function (src) {
        var c = { t: t, expectedPath: expectedPath, result: result };
        vm.runInNewContext(src, c);
    }));
});

function inserter (file) {
    return insert(file, {
        basedir: __dirname + '/return'
    });
}
