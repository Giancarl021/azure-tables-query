const { TableServiceClient, TableClient, TablesSharedKeyCredential } = require('@azure/data-tables');
const generateSchema = require('./src/util/schema');
const createDatabase = require('./src/services/database');

module.exports = function (storageAccountName, storageAccountKey) {
    const credential = new TablesSharedKeyCredential(storageAccountName, storageAccountKey);
    const tableClient = new TableServiceClient(
      `https://${storageAccountName}.table.core.windows.net`,
      credential
    );

    async function fetch(pathToDatabase) {
        const database = createDatabase(pathToDatabase);
        const tables = tableClient.listTables();
        const promises = [];

        for await (const { tableName: table } of tables) {      
            promises.push(
                parseTable(table)
            );
        }

        await Promise.all(promises);

        async function parseTable(table) {
            const tb = _getTable(table);
            const _entities = tb.listEntities();

            const entities = []

            for await (const entity of _entities) entities.push(entity);

            const schema = generateSchema(entities[0]);
            await database.insertTable(table, schema, entities);
        }

        return {
            select: query => database.query(`select ${query}`)
        };
    }

    function connect(pathToDatabase) {
        const database = createDatabase(pathToDatabase);
        return {
            select: query => database.query(`select ${query}`)
        };
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
        connect
    }
}