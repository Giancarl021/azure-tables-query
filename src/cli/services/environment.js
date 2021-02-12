const fs = require('fs');
const locate = require('../util/locate');
const dotenv = require('dotenv');

module.exports = function () {
    const dirs = [
        'data/databases',
        'data/accounts'
    ];


    function build() {
        dotenv.config();
        dirs.forEach(dir => {
            const path = locate(dir);
            if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
        });
    }

    function destroy() {

    }

    return {
        build,
        destroy
    };
};