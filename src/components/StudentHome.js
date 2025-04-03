import { useEffect, useState } from "react";
import { getEndpoint } from "../helpers/database";
import { useNavigate } from "react-router";
import { useAuthContext } from "../helpers/auth";
import { gstyles } from "../helpers/globalStyles";
import SessionInfoModal from "./SessionInfoModal";
import * as date from "../helpers/date";
import TutorInfoModal from "./TutorInfoModal";

export default function StudentHome() {
    let [tutors, setTutors] = useState([]);
    let [sessions, setSessions] = useState([]);
    let [studentInfo, setStudentInfo] = useState(null);
    let [selectedSession, setSelectedSession] = useState(null);
    let [selectedTutor, setSelectedTutor] = useState(null);
    let navigate = useNavigate();
    let { user } = useAuthContext();
    const updateSessions = () => {
        getEndpoint(`bookedsessions/${user.edcuserid}`).then(setSessions).catch(console.error);
    }
    useEffect(() => {
        if (user === null) {
            navigate("/");
        } else {
            getEndpoint("tutors").then(setTutors).catch(console.error);
            updateSessions();
            getEndpoint(`studentinfo/${user.edcuserid}`).then(r => setStudentInfo(r[0])).catch(console.error);
        }
    }, [user, navigate]);
    return <div style={gstyles.container}>
        <div style={{ maxWidth: '100%' }}>
            <div>
                <h1>Your Information</h1>
                {user?.firstname} {user?.lastname}, {studentInfo?.gradelevel} <br />
                Objective: {studentInfo?.objective} <br />
            </div>
            <div>
                <h1>Your Sessions</h1>
                <div style={styles.sessionList}>
                    {sessions.map((t, i) => {
                        let sessiontime = date.mergeDateAndTime(date.toDate(t.sessiondate), date.toTimestamp(t.starttime));
                        let time_relation = date.parseDuration(Math.abs(sessiontime - new Date(Date.now())));
                        return <div key={i} style={{ ...styles.session, borderBottomWidth: i !== sessions.length - 1 ? 1 : 0 }}>
                            {`${sessiontime > Date.now() ? `In ${time_relation}` : `${time_relation} ago`}:
                            ${t.notes} with ${t.firstname} ${t.lastname}
                            (${t.sessionstatus}${(t.sessionstatus === "Completed" && t.paymentstatus !== "Completed") ? ", Payment Required" : ""})`}
                            <div style={{ flex: 1 }} /><button style={{ ...gstyles.button, fontSize: 'inherit', backgroundColor: 'lightblue' }}
                                onClick={() => setSelectedSession(t)}>
                                View
                            </button>
                        </div>
                    })}
                </div>
                <SessionInfoModal session={selectedSession} close={() => { setSelectedSession(null); updateSessions() }} />
            </div>
            <div>
                <h1>Tutors Available</h1>
                <div style={styles.tutorList}>
                    <div style={styles.listHeader}>Name</div>
                    <div style={{ ...styles.listHeader, borderRightWidth: 1, borderLeftWidth: 1 }}>Subject</div>
                    <div style={{ ...styles.listHeader, borderRightWidth: 1 }}>Languages</div>
                    <div style={styles.listHeader}>Book a Session</div>

                    {tutors.map((t, i) => {
                        let borderw = i === tutors.length - 1 ? 0 : 1;
                        return [<div key={4 * i} style={{ ...styles.listEntry, borderBottomWidth: borderw }}>{`${t.firstname} ${t.lastname}`}</div>,
                        <div key={4 * i + 1} style={{ ...styles.listEntry, borderBottomWidth: borderw, borderRightWidth: 1, borderLeftWidth: 1 }}>
                            {`${t.subjecttaught}`}
                        </div>,
                        <div key={4 * i + 2} style={{ ...styles.listEntry, borderBottomWidth: borderw, borderRightWidth: 1 }}>{`${t.languagespoken}`}</div>,
                        <div key={4 * i + 3} style={{ ...styles.listEntry, borderBottomWidth: borderw, padding: 5 }}>
                            <button style={{ ...gstyles.button, fontSize: 'inherit', backgroundColor: 'lightblue' }}
                                onClick={() => setSelectedTutor(t)}>
                                See Availability
                            </button>
                        </div>
                        ]
                    })}

                </div>
                <TutorInfoModal tutor={selectedTutor} close={() => {setSelectedTutor(null); updateSessions()}} />
            </div>
        </div>

    </div>;
}

/**
 * @type {{[key: string]: React.CSSProperties}}
 */
const styles = {
    sessionList: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "grey",
        borderStyle: "solid",
    },
    session: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0,
        borderColor: "grey",
        borderStyle: "solid",
        padding: 10,
    },
    tutorList: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto auto',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "grey",
        borderStyle: "solid",
        width: '100%',
        borderCollapse: 'separate',
    },
    listEntry: {
        textAlign: 'center',
        borderColor: "grey",
        borderStyle: "solid",
        padding: 10,
        borderWidth: 0,
    },
    listHeader: {
        textAlign: 'center',
        fontWeight: 600,
        borderColor: "grey",
        borderStyle: "solid",
        padding: 10,
        borderWidth: 0,
        borderBottomWidth: 1,
    }
}