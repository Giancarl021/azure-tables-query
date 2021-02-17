require('dotenv').config();
const createTableSQL = require('./index');

async function main() {
    const databasePath = 'data/databases/db.sqlite';

    const tables = createTableSQL(process.env.STORAGE_ACCOUNT, process.env.STORAGE_KEY, databasePath);

    console.log('Fetching data from Azure Tables...');
    await tables.fetch();

    console.log('Getting SQL client');

    const sql = await tables.getClient();

    console.log(
        sql.select('count(1) from FinancialDashboardUserTable')
    );
}

main().catch(console.error);