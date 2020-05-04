/* console.log with datetime prepended */
var log = console.log;
console.log = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);
    var formatted = first_parameter ? `[${new Date().toLocaleString('en-GB')}] ` + first_parameter : '';
    if (typeof first_parameter === 'string' && first_parameter.startsWith('┌')) formatted = first_parameter;
    log.apply(console, [formatted].concat(other_parameters));
};

/* console.error with datetime prepended */
var err = console.error;
console.error = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);
    var formatted = first_parameter ? `[${new Date().toLocaleString('en-GB')}] ` + first_parameter : '';
    err.apply(console, [formatted].concat(other_parameters));
};
