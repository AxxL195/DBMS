import pkg from "pg";
import { DB_PASS } from "../config/env.js";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    password:DB_PASS,
    host: "localhost",
    port: 5432,
    database: "LifeLinkDB",
});

pool.connect()
    .then(()=> console.log("connected to postgresql"))
    .catch((err)=> console.log("database connection failed",err));

export default pool;