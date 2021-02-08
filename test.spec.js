require('dotenv').config();
const createTableSQL = require('./index');

async function main() {
    const tables = createTableSQL(process.env.STORAGE_ACCOUNT, process.env.STORAGE_KEY);

    await tables.fetch('db.sqlite');

    const { select } = tables.connect('db.sqlite');

    console.log(
        select('count(1) from FinancialDashboardSkusTable')
    );
}

main().catch(console.error);