const cp = require('child_process');
const fs = require('fs');
const locate = require('../util/locate');
const createSQLTable = require('../../../index');
const createCredentialsManager = require('../services/credentials');

const credentials = createCredentialsManager();

module.exports = async function (args, flags) {
    const [ storageAccountName ] = args;
    const { fetch } = flags;

    if (!storageAccountName) {
        throw new Error('Invalid Storage Account name');
    }

    const storageAccountKey = await credentials.get(storageAccountName);

    if (!storageAccountKey) {
        throw new Error('This Storage Account does not exists on your local environment');
    }

    const path = locate('data/databases/' + storageAccountName);
    const notFetchedYet = !fs.existsSync(path);

    if (notFetchedYet) {
        console.log('Tables copy does not exists in local environment');
    }

    const tables = createSQLTable(storageAccountName, storageAccountKey, path);

    if (fetch || notFetchedYet) {
        console.log('Fetching tables...');
        await tables.fetch();
    }

    const bin = locate('node_modules/csvql/bin');

    const fork = cp.fork(bin, ['--from', path], {
        env: {
            CSVQL_APP_NAME: 'aztb'
        }
    });

    await new Promise((resolve, reject) => {
        fork.on('error', reject);
        fork.on('exit', resolve);
    });

    return 'Connection closed';
}