import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "serveshare",
  port: 3307
});

console.log("MySQL Connected");

export default db;
