var JSHINT = require("../jshint.js").JSHINT;

describe("Blocks", function () {
    var ol = [
            "if (cond) return true;",
            "for (;;) console.log('test');",
            "while (true) console.log('test');"
        ],

        ml = [
            "if (cond) { return true; }",
            "for (;;) { console.log('test'); }",
            "while (true) { console.log('test'); }"
        ];
    
    it("must tolerate one-line blocks by default", function () {
        // By default, tolerate one-line blocks
        for (var i = 0, stmt; stmt = ol[i]; i++)
            expect(JSHINT(stmt)).toEqual(true);

        for (var i = 0, stmt; stmt = ml[i]; i++)
            expect(JSHINT(stmt)).toEqual(true);
    });

    it("must require curly braces if curly:true", function () {
        for (var i = 0, stmt; stmt = ol[i]; i++)
            expect(JSHINT(stmt, { curly: true })).toEqual(false);

        for (var i = 0, stmt; stmt = ml[i]; i++)
            expect(JSHINT(stmt, { curly: true })).toEqual(true);
    });
});

describe("Functions", function () {
    var ce = "function test() { return arguments.callee; }",
        cr = "function test() { return arguments.caller; }",

        ns = "new Klass();",
        na = "var obj = new Klass();";
    
    it("must tolerate arguments.callee and arguments.caller by default", function () {
        expect(JSHINT(ce)).toEqual(true);
        expect(JSHINT(cr)).toEqual(true);
    });

    it("must not tolerate arguments.callee and arguments.caller with noarg:true", function () {
        expect(JSHINT(ce, { noarg: true })).toEqual(false);
        expect(JSHINT(cr, { noarg: true })).toEqual(false);
    });

    it("must tolerate using constructors for side-effects", function () {
        expect(JSHINT(ns)).toEqual(true);
        expect(JSHINT(na)).toEqual(true);
    });

    it("must not tolerate using constructors for side-effects with nonew:true", function () {
        expect(JSHINT(ns, { nonew: true })).toEqual(false);
        expect(JSHINT(na, { nonew: true })).toEqual(true);
    });
});

describe("Control statements", function () {
    var cond  = "if (e = 1) { doSmth(); }",
        loopw = "while (obj = arr.next()) { hey(); }",
        loopf = "for (var b; b = arr.next();) { hey(); }",
        loopd = "do { smth(b); } while (b = arr.next());";

    it("should warn about using assignments by default", function () {
        expect(JSHINT(cond)).toEqual(false);
        expect(JSHINT(loopw)).toEqual(false);
        expect(JSHINT(loopf)).toEqual(false);
        expect(JSHINT(loopd)).toEqual(false);
    });

    it("should allow using assignments when boss:true", function () {
        expect(JSHINT(cond, { boss: true })).toEqual(true);
        expect(JSHINT(loopw, { boss: true })).toEqual(true);
        expect(JSHINT(loopf, { boss: true })).toEqual(true);
        expect(JSHINT(loopd, { boss: true })).toEqual(true);
    });
});