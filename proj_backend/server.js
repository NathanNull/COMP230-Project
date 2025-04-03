import dotenv from "dotenv";
dotenv.config();
import express from "express";
import oracledb from "oracledb";
oracledb.fetchAsString = [oracledb.CLOB];
oracledb.autoCommit = true;
import cors from "cors";

const app = express();
app.use(cors());

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
};

/**
 * 
 * @param {oracledb.Lob} clob 
 * @return {string}
 */
async function CLOBToString(clob) {
    return new Promise((resolve, reject) => {
        let clobData = "";
        clob.setEncoding("utf8")
            .on("data", (chunk) => { clobData += chunk; })
            .on("end", () => { resolve(clobData); })
            .on("error", (err) => { console.log("Failed to parse clob"); reject(err); });
    });
}

async function db_run(query) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(query, []);

        // Map row arrays to objects w/ keys=column names
        let res = result.rows === undefined ? result.rowsAffected : result.rows.map(r => {
            let obj = {};
            r.forEach((val, i) => {
                obj[result.metaData[i].name.toLowerCase()] = val;
            });
            return obj;
        });
        return res;
    } catch (err) {
        console.log(query);
        console.log(err.message);
        throw new Error(err.message);
    } finally {
        if (connection) await connection.close();
    }
}

/**
 * 
 * @param {string} endpoint 
 * @param {(args: {[key: string]: string})=>string} cmd 
 * @param {(res: {[key: string]: any}[])=>any} parse 
 */
function query_endpoint(endpoint, cmd, parse = r => r) {
    app.get(endpoint, async (req, res) => {
        //const cmd = "select * from user_tables";
        try {
            let result = await db_run(cmd(req.params));
            res.json(parse(result));
        } catch (err) {
            console.log(cmd);
            console.log(err);
            res.status(500).send(err);
        }
    });
}

query_endpoint("/auth/:email/:pw_hash", ({ email, pw_hash }) =>
    `select e.* from edcuser e where e.email = '${email}' and e.password = '${pw_hash}'`,
    (res) => {
        if (res.length == 0) {
            return { auth_ok: false };
        } else {
            return { auth_ok: true, ...res[0] }
        }
    });
query_endpoint("/tutors", () => "select * from tutor t join edcuser u on t.tutorid=u.edcuserid order by t.subjecttaught, t.languagespoken");
query_endpoint("/bookedsessions/:studentid", ({ studentid }) =>
    `select ts.*, u.firstname, u.lastname
    from tutoringsession ts join tutor t on t.tutorid=ts.tutorid join edcuser u on t.tutorid=u.edcuserid
    where studentid='${studentid}' order by ts.sessionstatus desc, ts.sessiondate asc, ts.starttime asc`);
query_endpoint("/cancelsession/:studentid/:sessionid", ({ studentid, sessionid }) =>
    `update tutoringsession set sessionstatus='Cancelled' where sessionid='${sessionid}' and studentid=${studentid}`, r=> {
        console.log("Altered "+r+" rows");
        return r;
    });
query_endpoint("/studentinfo/:studentid", ({ studentid }) => `select * from student where studentid=${studentid}`);
query_endpoint("/tutorsessions/:tutorid", ({ tutorid }) => `select * from tutoringsession where tutorid=${tutorid}`);
query_endpoint("/taughtsubjects/:tutorid", ({ tutorid }) =>
    `select * from subject where exists(select * from tutor where tutorid=${tutorid} and subjecttaught=subjectname)`);
query_endpoint("/schedulesession/:sessionid/:tutorid/:studentid/:subjectid/:mode/:date/:starttime/:endtime/:notes",
    ({ sessionid, tutorid, studentid, subjectid, mode, date, starttime, endtime, notes }) =>
        `insert into tutoringsession values ('${sessionid}', ${tutorid}, ${studentid}, '${subjectid}', '${mode}', TO_DATE('${date}', 'DD-MM-YYYY'), TO_DATE('${starttime}', 'HH24:MI:SS'), TO_DATE('${endtime}', 'HH24:MI:SS'), 'Scheduled', '${notes}')`)
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
// http://localhost:5000/schedulesession/SES28587/2008/1003%20%20%20%20%20%20%20%20%20%20%20%20/BIO104/In%20person/2-3-2025/22:0:00/22:30:00/amogus