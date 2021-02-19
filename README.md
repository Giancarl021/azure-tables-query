# azure-tables-query

Queries SQL into Azure Tables

## Installation

### CLI

npm:

```bash
npm install --global azure-tables-query
```

yarn:

```bash
yarn add global azure-tables-query
```

### API

npm:

```bash
npm install azure-tables-query
```

yarn:

```bash
yarn add azure-tables-query
```

## Usage

This module can be used in two formats: CLI and API.

### CLI

#### Account
To connect with an storage account you need first to inform the credentials with the ``account`` command:

```bash
aztb account
```

##### ``set <storage account name> <storage account key>``

Saves a new Storage Account name and key for future connections

##### ``list``

Lists all saved Storage Account names

##### ``delete <storage account name>``

Removes a credential for a Storage Account

#### Connect
Connect to a local mirror of the Azure Tables of a storage Account to make SQL queries. Creates a [CSVQL](https://www.npmjs.com/package/csvql) CLI session:

```bash
aztb connect <storage account name> [--fetch]
```

The flag ``--fetch`` is for update the local data before making a session, its recommended to use if you haven't updated the local copy soon.

#### Commands
The session have 4 commands:

##### Help
Prints all the available commands.

```
aztb> help
select <sql query>: Queries into imported schemas.
schema <operation>: Manage the schemas of the current session.
  list: List all tables and columns available.
  import <path [as <tableName>[, ...]]>: Import a new schema from CSV file(s).
  drop <tableName>: Delete a table of the current session.
  rename <tableName> <newTableName>: Rename a table of the current session.
help: List all available commands.
exit: Close the current session.
```

##### Exit
Close the application, equivalent of ``^C``.

##### Schema
Manages the schemes on the current session

**Operations**

*list*

List all the tables on current session, with the types.

*import*

Import CSV files, follows the syntax:
```
aztb> schema import path/to/file.csv [as table] [, ...]
```

*rename*

Rename a table on current session.

*drop*

Delete a table on current session.

##### Select
SQL SELECT Query, from [sqlite](https://www.sqlite.org/index.html).

### API

#### Initialization

```javascript
// Importing
const createTableSQL = require('azure-tables-query');

// Initialize
const tables = createTableSQL(
    storageAccountName,
    storageAccountKey,
    databasePath
);
```

#### ``storageAccountName`` and ``storageAccountKey``

The credentials of your storage account.

#### ``databasePath``

The path to where the SQLite database will be stored.

```javascript
const databasePath = 'path/to/file';
```

### Methods

##### fetch

Sync local database with Azure Tables. **Required** on first run:

```javascript
await tables.fetch();
```

##### getClient

Get the [CSVQL](https://www.npmjs.com/package/csvql) client to perform SQL operations:

```javascript
const client = await tables.getClient();
```

#### Client Functions

##### schema

**list**

List all tables on current session

```javascript
const result = await client.schema('list');
```

Return:

```javascript
[
	{
		name: 'tableName',
		columns: [
			partitionKey: 'foo',
            rowKey: 'bar',
            timestamp: 'baz'
            ...
		]
	},
	...etc
]
```

**rename**

Rename a table on current session

```javascript
await client.schema('rename', 'oldName', 'newName');
```

**import**

```javascript
await client.schema('import', 'path/to/file');
```

**drop**

Delete a table on current session

```javascript
await client.schema('drop', 'tableName');
```

##### select

Run SQL-like ``SELECT``'s, as example:

```javascript
const result = await client.select('* from tableName');
```

The result will be the same as the [better-sqlite3]() module, with the format:

```javascript
[
	{
		column: 'value'
	}
]
```
