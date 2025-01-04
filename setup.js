require('colors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const { success, info, warn, error, debug } = require("./utils/Console");

const DatabaseConnection = require("./utils/SQLRequest");

/**
 * Get all .sql files from the models directory.
 * @param {string} directoryPath - The path to the directory.
 * @returns {string[]} - An array of file paths.
 */
const getSqlFiles = (directoryPath) => {
    try {
        return fs.readdirSync(directoryPath)
            .filter(file => path.extname(file).toLowerCase() === '.sql')
            .map(file => path.join(directoryPath, file));
    } catch (err) {
        throw new Error(`Error reading SQL files from directory: ${err.message}`);
    }
};

// Directory containing the SQL files
const modelsDir = path.resolve(__dirname, 'models');
const sqlFiles = getSqlFiles(modelsDir);

const cleanSqlFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    return content
        .replace(/--.*$/gm, '') // Remove comments
        .replace(/\/\*![0-9]+.*?\*\//gs, '') // Remove version-specific comments
        .replace(/\bSTART TRANSACTION\b;/gi, '') // Remove START TRANSACTION
        .replace(/\bCOMMIT\b;/gi, '') // Remove COMMIT
        .replace(/^\s*$/gm, '') // Remove empty lines
        .trim();
};

const connection = new DatabaseConnection();

/**
 * Check if a table exists in the database.
 * @param {string} tableName - The name of the table to check.
 * @returns {Promise<boolean>} - True if the table exists, otherwise false.
 */
const tableExists = async (tableName) => {
    const query = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = '${tableName}'`;
    const result = await connection.request(query);
    return result[0].count > 0;
};

/**
 * Compare the current table structure with the expected one.
 * @param {string} tableName - The name of the table to check.
 * @param {string} sql - The SQL statement used to define the table.
 * @returns {Promise<boolean>} - True if the table needs an update, otherwise false.
 */
const needsUpdate = async (tableName, sql) => {
    // Retrieve current table structure
    const query = `SHOW CREATE TABLE \`${tableName}\``;
    const result = await connection.request(query);

    if (result.length > 0) {
        const currentStructure = result[0]['Create Table'];
        return !currentStructure.includes(sql.trim());
    }
    return true;
};

/**
 * Execute a SQL file, checking for table existence and updates.
 * @param {string} filePath - The path to the SQL file.
 */
const executeSqlFile = async (filePath) => {
    const sql = cleanSqlFile(filePath);
    const statements = sql.split(';').filter((stmt) => stmt.trim() !== '');

    for (const statement of statements) {
        const tableNameMatch = statement.match(/CREATE TABLE\s+`?(\w+)`?/i);
        if (!tableNameMatch) {
            continue; // Skip if not a CREATE TABLE statement
        }

        const tableName = tableNameMatch[1];

        try {
            if (await tableExists(tableName)) {
                info(`Table ${tableName} already exists.`);
                if (await needsUpdate(tableName, statement)) {
                    warn(`Table ${tableName} needs an update.`);
                    await connection.request(`DROP TABLE IF EXISTS \`${tableName}\``);
                    await connection.request(statement.trim());
                    success(`Table ${tableName} updated.`);
                } else {
                    info(`Table ${tableName} is up to date.`);
                }
            } else {
                info(`Table ${tableName} does not exist. Creating...`);
                await connection.request(statement.trim());
                success(`Table ${tableName} created.`);
            }
        } catch (error) {
            throw new Error(`Error with table ${tableName}:\n${error.message}`);
        }
    }

    success(`File executed: ${filePath} - ` + `Done!`.green);
};

const initializeDatabase = async () => {
    try {
        for (const file of sqlFiles) {
            await executeSqlFile(file);
        }
        console.log('\n\n\n✅ Database initialized successfully.');
    } catch (error) {
        console.error(error.message);
    }
};

initializeDatabase(); // Remove that if you use this function from other file

module.exports = { initializeDatabase } // For the future: when the bot starts up, ...
