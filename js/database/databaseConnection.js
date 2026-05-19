function conn(){
    const mysql = require('mysql');
    const dbConfig = require('../database/database.json');
    const connection = mysql.createConnection(dbConfig.database);
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            return;
        }
        console.log('Connected to database');
    });
}