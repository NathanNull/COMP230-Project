import dotenv from "dotenv";
dotenv.config();
import express from "express";
import oracledb from "oracledb";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // TODO: May take this out later if I don't need it, not too sure

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
};

app.get("/users", async (req, res) => {
    //const cmd = "select * from all_tables";
    const cmd = "select USER,SYS_CONTEXT ('USERENV', 'SESSION_USER') from dual";
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        //const result = await connection.execute("select table_name from all_tables");
        const result = await connection.execute(cmd);
        const cols = result.metaData.map(v=>v.name);
        console.log(cols);
        res.json(result.rows.map(row=>{
            let r = [];
            for (let i = 0; i < cols.length; i++) {
                r.push(`(${cols[i]}, ${row[i]})\t`);
            }
            return r;
        }));
    } catch (err) {
        console.log(cmd);
        console.log(err.message);
        res.status(500).send(err.message);
    } finally {
        if (connection) await connection.close();
    }
})

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));