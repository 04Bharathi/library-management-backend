const connection = require("../config/db");

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  } 
  const sql = `CREATE DATABASE IF NOT EXISTS library_db;`;

  connection.query(sql, (err) => {
    if (err) {
        console.log(err)
        return;
    }
    console.log("Database craeted successfully")
    connection.end()
  }) 
});
