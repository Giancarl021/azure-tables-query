const keytar = require('keytar');
const SERVICE_NAME = 'azure-tables-query';

module.exports = function() {
    async function set(account, password) {
        await keytar.setPassword(SERVICE_NAME, account, password);
    }

    async function get(account) {
        return await keytar.getPassword(SERVICE_NAME, account);
    }

    async function remove(account) {
        return await keytar.deletePassword(SERVICE_NAME, account);
    }

    async function list() {
        return await keytar.findCredentials(SERVICE_NAME);
    }

    return {
        set,
        get,
        list,
        remove
    }
}