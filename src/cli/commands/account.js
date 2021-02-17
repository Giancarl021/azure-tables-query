const input = require('../services/input');
const createCredentialsManager = require('../services/credentials');

const SERVICE_NAME = 'azure-tables-query';
const credentials = createCredentialsManager();

const operations = {
    async list() {
        const accounts = await credentials.list();
        return accounts
            .map(acc => '* ' + acc.account)
            .join('\n');
    },

    async set(args) {
        let [ storageAccountName, storageAccountKey ] = args;

        if (!storageAccountName) {
            storageAccountName = await input('Storage Account Name: ', true);
        }

        if (!storageAccountKey) {
            storageAccountKey = await input('Storage Account Key: ', true);
        }

        await credentials.set(storageAccountName, storageAccountKey);

        return 'Storage Account saved';
    },

    async delete(args) {
        let [ storageAccountName ] = args;

        if (!storageAccountName) {
            storageAccountName = await input('Storage Account Name: ', true);
        }

        const isDeleted = await credentials.remove(storageAccountName);
        
        return isDeleted ? 'Storage Account deleted' : 'This Storage Account does not exists';
    }
};

module.exports = async function (args, flags) {
    const index = args.shift();
    const operation = operations[index];
    if (!operation) {
        return `Operation "${index || ''}" does not exists`;
    }
    return await operation(args, flags);
}