/*jshint expr:true, boss:true, evil:true */

// Python program (see src/env/jsc.py) will execute this script,
// with JSHint prepended, with the following signature:
//
//   jsc jsc.js -- <source> <options>
//
// Options are passed as a JSON string/

!function (args) {
    var src = args[0];
    var opts = eval(args[1]);
    var errors, result = [];

    if (!JSHINT(src, opts))
        print(JSON.stringify(JSHINT.errors));

    quit();
}(arguments);