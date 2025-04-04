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

async function db_run(query) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        let result;
        if (typeof query === typeof []) {
            await Promise.all(
                query.map(
                    async q => result = await connection.execute(q, [])
                )
            );
        } else {
            result = await connection.execute(query, []);
        }

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
    `select ts.*, u.firstname, u.lastname, p.*
    from tutoringsession ts join tutor t on t.tutorid=ts.tutorid join edcuser u on t.tutorid=u.edcuserid join payment p on p.sessionid=ts.sessionid
    where ts.studentid='${studentid}' order by ts.sessionstatus desc, ts.sessiondate asc, ts.starttime asc`);
query_endpoint("/cancelsession/:studentid/:sessionid", ({ studentid, sessionid }) =>
    `update tutoringsession set sessionstatus='Cancelled' where sessionid='${sessionid}' and studentid=${studentid}`);
query_endpoint("/completesession/:studentid/:sessionid", ({ studentid, sessionid }) =>
    `update tutoringsession set sessionstatus='Completed' where sessionid='${sessionid}' and studentid=${studentid}`);
query_endpoint("/studentinfo/:studentid", ({ studentid }) => `select * from student where studentid=${studentid}`);
query_endpoint("/tutorsessions/:tutorid", ({ tutorid }) => `select ts.*, u.firstname, u.lastname, p.*
    from tutoringsession ts join student s on s.studentid=ts.studentid join edcuser u on s.studentid=u.edcuserid join payment p on p.sessionid=ts.sessionid
    where ts.tutorid='${tutorid}' order by ts.sessionstatus desc, ts.sessiondate asc, ts.starttime asc`);
query_endpoint("/taughtsubjects/:tutorid", ({ tutorid }) =>
    `select * from subject where exists(select * from tutor where tutorid=${tutorid} and subjecttaught=subjectname)`);
query_endpoint("/schedulesession/:sessionid/:tutorid/:studentid/:subjectid/:mode/:date/:starttime/:endtime/:notes/:paymentmethod/:amount",
    ({ sessionid, tutorid, studentid, subjectid, mode, date, starttime, endtime, notes, paymentmethod, amount }) =>
        [`insert into tutoringsession values
    ('${sessionid}', ${tutorid}, ${studentid}, '${subjectid}', '${mode}',
    TO_DATE('${date}', 'DD-MM-YYYY'), TO_DATE('${starttime}', 'HH24:MI:SS'),
    TO_DATE('${endtime}', 'HH24:MI:SS'), 'Scheduled', '${notes}')`,
        `insert into payment values (null, ${studentid}, ${tutorid}, '${sessionid}', ${amount}, '${paymentmethod}', 'Pending', SYSDATE)`
        ]);
query_endpoint("/paysession/:paymentid/:status", ({ paymentid, status }) =>
    `update payment set paymentstatus='${status}' where paymentid=${paymentid}`);
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
// http://localhost:5000/schedulesession/SES28587/2008/1003%20%20%20%20%20%20%20%20%20%20%20%20/BIO104/In%20person/2-3-2025/22:0:00/22:30:00/amogus