const createDatabase = require('better-sqlite3');
const createRowFormatter = require('../util/format-row');

module.exports = function (pathToDataBase = ':memory:') {
    const database = createDatabase(pathToDataBase);

    database.pragma('journal_mode = WAL');

    async function insertTable(tableName, columns, rows) {
        database.exec(`CREATE TABLE IF NOT EXISTS "${tableName}" (${columns.map(col => `"${col.name}" ${col.type}`).join(',')})`);
        const insert = database.prepare(
            `INSERT INTO "${tableName}" (${columns.map(col => `"${col.name}"`).join(',')}) VALUES (${new Array(columns.length).fill('?').join(',')})`
        );

        const formatRow = createRowFormatter(columns.map(c => c.name));

        

        rows.forEach(row => {
            insert.run(
                formatRow(row)                
            );
        });
    }

    function query(statement) {
        const st = database.prepare(statement);
        return st.all();
    }

    function close() {
        database.close();
    }

    return {
        insertTable,
        query,
        close
    }
}