require('dotenv').config();
const cp = require('child_process');
const fs = require('fs');
const createTableSQL = require('./index');

async function main() {
    const appName = 'azure-tables';
    const databasePath = 'data/db.sqlite';

    const tables = createTableSQL(process.env.STORAGE_ACCOUNT, process.env.STORAGE_KEY, databasePath);

    // console.log('Fetching data from Azure Tables...');
    // await tables.fetch();

    console.log('Getting SQL client');

    const sql = await tables.getClient();

    console.log(
        sql.select('count(1) from FinancialDashboardUserTable')
    );

    // const fork = cp.fork('node_modules/csvql/bin', ['--from', '../../../' + databasePath], {
    //     env: {
    //         CSVQL_APP_NAME: appName
    //     }
    // });

    // fork.on('close', () => {
    //     fs.unlinkSync(databasePath);
    // });
}

main().catch(console.error);