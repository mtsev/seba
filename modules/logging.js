var util = require('util');

/* timestamp format */
function timestamp() { 
    return `[${new Date().toLocaleString('en-GB')}]`;
}

/* console.log with timestamp prepended */
var log = console.log;
console.log = function () {
    arguments[0] = (typeof arguments[0] === 'string' && arguments[0].startsWith('┌'))
            ? timestamp() + ' ───── TABLE ─────\n' + arguments[0]
            : util.format(timestamp(), arguments[0]);
    log.apply(console, arguments);
};

/* console.error with timestamp prepended */
var err = console.error;
console.error = function () {
    arguments[0] = (typeof arguments[0] === 'string' && arguments[0].startsWith('┌'))
            ? timestamp() + ' ───── TABLE ─────\n' + arguments[0]
            : util.format(timestamp(), arguments[0]);
    err.apply(console, arguments);
};
