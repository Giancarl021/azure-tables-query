const { TableServiceClient, TableClient, TablesSharedKeyCredential } = require('@azure/data-tables');
const generateSchema = require('./src/util/schema');
const createDatabase = require('./src/services/database');
const createCsvql = require('csvql');
const chunk = require('callback-chunk');
const fs = require('fs');

module.exports = function (storageAccountName, storageAccountKey, pathToDatabase) {

    if (!pathToDatabase) {
        throw new Error('Invalid path to database');
    }

    const credential = new TablesSharedKeyCredential(storageAccountName, storageAccountKey);
    const tableClient = new TableServiceClient(
      `https://${storageAccountName}.table.core.windows.net`,
      credential
    );

    async function fetch() {
        if (fs.existsSync(pathToDatabase) && fs.lstatSync(pathToDatabase).isFile()) {
            fs.unlinkSync(pathToDatabase);
        }

        const database = createDatabase(pathToDatabase);
        const tables = tableClient.listTables();
        const promises = [];

        for await (const { tableName: table } of tables) {      
            promises.push(
                () => parseTable(table)
            );
        }

        await chunk(promises, 5);

        async function parseTable(table) {
            const tb = _getTable(table);
            const _entities = tb.listEntities();

            const entities = []

            for await (const entity of _entities) entities.push(entity);

            const schema = generateSchema(entities);
            await database.insertTable(table, schema, entities);
        }

        database.close();
    }

    async function getClient() {
        if (!fs.existsSync(pathToDatabase) || !fs.lstatSync(pathToDatabase).isFile()) {
            throw new Error('Invalid database path');
        }

        const csvql = await createCsvql([], {
            from: pathToDatabase
        });

        return csvql;
    }

    function _getTable(tableName) {
        return new TableClient(
            `https://${storageAccountName}.table.core.windows.net`,
            tableName,
            credential
        );
    }

    return {
        fetch,
        getClient
    }
}