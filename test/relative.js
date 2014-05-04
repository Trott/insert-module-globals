var test = require('tap').test;
var mdeps = require('module-deps');
var bpack = require('browser-pack');
var insert = require('../');
var concat = require('concat-stream');
var vm = require('vm');

test('use relative path for process', function (t) {
    t.plan(1);
    var files = [ __dirname + '/relative/main.js' ];

    var s = mdeps(files, { transform: [ inserter ] })
         .pipe(bpack({ raw: true }));

    s.pipe(concat(function (src) {
        var c = {
            t: t,
            expected: '../node_modules/process/browser.js',
            result: insert.vars.process()
        };
        vm.runInNewContext(src, c);
    }));
});

function inserter (file) {
    return insert(file, {
        basedir: __dirname + '/relative'
    });
}
