const fs = require('fs');
const DatabaseConnection = require("./utils/SQLRequest");

const sqlFiles = [
    './servers.sql',
    './users.sql',
    './webhook.sql'
];


const connection = new DatabaseConnection();


const executeSqlFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, sql) => {
            if (err) {
                return reject(`Erreur lors de la lecture du fichier ${filePath}: ${err.message}`);
            }

            connection.requel(sql).then((error, results) => {
                if (error) {
                    return reject(`Erreur lors de l'execution du fichier ${filePath}: ${error.message}`);
                }
                console.log(`Fichier ${filePath} execute avec succes.`);

                resolve(results);
            })
        });
    });
};


const initializeDatabase = async () => {
    try {
        for (const file of sqlFiles) {
            await executeSqlFile(file);
        }

        console.log('Base de donnees initialisee avec succes.');
    } catch (error) {
        console.error(error);
    }
};


initializeDatabase();