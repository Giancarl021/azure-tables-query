const cp = require('child_process');
const locate = require('../util/locate');
const createSQLTable = require('../../../index');

module.exports = async function (args, flags) {
    const [ account ] = args;
    const { fetch } = flags;

    if (!account) {
        throw new Error('Invalid account name');
    }

    const path = locate('data/' + account);

    const tables = createSQLTable(process.env.STORAGE_ACCOUNT, process.env.STORAGE_KEY, path);

    if (fetch) {
        console.log('Fetching tables...');
        await tables.fetch();
    }

    const bin = locate('node_modules/csvql/bin');

    const fork = cp.fork(bin, ['--from', path], {
        env: {
            CSVQL_APP_NAME: 'tb'
        }
    });

    await new Promise((resolve, reject) => {
        fork.on('error', reject);
        fork.on('exit', resolve);
    });

    return 'Connection closed';
}