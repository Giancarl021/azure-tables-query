const data = require('../util/help.json');

module.exports = function (args) {
    const info = navigate(data, [...args]);

    if (info === data) {
        return `--{ tb }--\n` +
            'Description: A way to make sql queries into your Azure Tables.\n' +
            `Operations:\n${parseOperations(info)}`;
    }

    const shorthand = typeof info === 'string';

    return `--{ ${args.length ? 'tb ' + args.join(' ') + (!shorthand && info.args ? ' ' + info.args.join(' ') : '') : 'tb'} }--\n` +
        `Description: ${shorthand ? info : info.description || 'None'}\n` +
        (!shorthand ?
            (info.operations ? `Operations:\n${parseOperations(info.operations)}` : '') +
            (info.flags ? `Flags:\n${parseFlags(info.flags)}` : '') :
            ''
        );
}

function navigate(object, arr) {
    if (typeof object !== 'object' || !arr.length) return object;
    const index = arr.shift();
    if (!object[index] && (!object.operations || !object.operations[index])) {
        return object;
    }

    return navigate(object[index] || object.operations[index], arr);
}

function parseOperations(operations) {
    if (!operations) return '';
    const r = [];
    for (const key in operations) {
        const op = operations[key];
        r.push(`    ${key}: ${typeof op === 'string' ? op : op.description || 'No description'}`);
    }

    return r.join('\n');
}

function parseFlags(flags) {
    const r = [];
    if(typeof flags === 'string') {
        return `    * ${flags}`;
    }
    if (!flags) return '';
    for (const key in flags) {
        const flag = flags[key];
        r.push(`    ${parseKey(flag, key) + (flag.required ? ' [REQUIRED]' :'')}: ${flag.description || 'No description'}${flag.value ? '\n      * Value: ' + flag.value : ''}`);
    }

    return r.join('\n');

    function parseKey(o, key) {
        let r = dash(key);

        if (o.alias) {
            r += ' | ' + dash(o.alias);
        }

        return r;

        function dash(key) {
            return key.length === 1 ? '-' + key : '--' + key;
        }
    }
}