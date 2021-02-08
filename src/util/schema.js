module.exports = function (entity) {
    const r = [];
    for (const key in entity) {
        let type;

        if(typeof entity[key] === 'number') {
            type = Number.isInteger(entity[key]) ? 'int' : 'float';
        } else {
            type = 'text';
        }

        r.push({
            name: key,
            type
        });
    }

    return r;
}