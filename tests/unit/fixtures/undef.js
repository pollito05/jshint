undef(); // this line will generate a warning
if (typeof undef) {} // this line won't because typeof accepts a reference
                     // even when the base object of that reference is null

if (typeof undef['attr' + 0]) {
    delete undef['attr' + 0];
}
if (typeof undef.attr) {
    delete undef.attr;
}

var fn = function () {
    localUndef();

    if (typeof localUndef)
        return;

    if (typeof localUndef['attr' + 0]) {
        delete localUndef['attr' + 0];
    }
    if (typeof localUndef.attr) {
        delete localUndef.attr;
    }
};

// Ensure the lookup mechanism for identifiers does not inherit from the Object
// prototype. Only identifiers declared in the source should produce a hit, and
// the following line should produce an error:
toString();
