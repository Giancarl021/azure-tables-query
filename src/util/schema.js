module.exports = function (entities) {
    const set = new Set();
    const o = {};
    for (const entity of entities) {
        Object.keys(entity).forEach(key => set.add(key));
    }


    for (const item of set) {
        const entity = entities.find(i => Boolean(i[item])) || {};
        o[item] = entity[item];
    }

    return generate(o);
}

function generate(entity) {
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