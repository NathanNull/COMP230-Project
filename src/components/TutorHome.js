import { useEffect, useState } from "react";
import { useAuthContext } from "../helpers/auth";
import { useNavigate } from "react-router";
import { getEndpoint } from "../helpers/database";
import * as date from "../helpers/date";
import { gstyles } from "../helpers/globalStyles";
import SessionTutorInfoModal from "./SessionTutorInfoModal";

export default function TutorHome() {
    const { user } = useAuthContext();
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [tutorInfo, setTutorInfo] = useState(null);
    const navigate = useNavigate();

    const updateSessions = () => {
        getEndpoint(`tutorsessions/${user.edcuserid}`).then(setSessions).catch(console.error);
    }

    useEffect(() => {
        if (user?.usertype !== "Tutor") {
            navigate("/");
        } else {
            updateSessions();
            getEndpoint(`tutors`).then(res => setTutorInfo(res.filter(t => t.tutorid === user.edcuserid)[0])).catch(console.error);
        }
    }, [user, navigate]);
    return <div style={gstyles.container}>
        <div>
            <div>
                <h1>Your Information</h1>
                {user?.firstname} {user?.lastname}, {tutorInfo?.subjecttaught} tutor, {tutorInfo?.qualification} <br />
                {tutorInfo?.tutoringmode}, ${tutorInfo?.hourlywage}/hr, speaks {tutorInfo?.languagespoken}
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
                                    (${t.sessionstatus}${(t.sessionstatus === "Completed" && t.paymentstatus !== "Completed") ? ', Payment ' + t.paymentstatus : ""})`}
                            <div style={{ flex: 1 }} /><button style={{ ...gstyles.button, fontSize: 'inherit', backgroundColor: 'lightblue' }}
                                onClick={() => setSelectedSession(t)}>
                                View
                            </button>
                        </div>
                    })}
                </div>
                <SessionTutorInfoModal session={selectedSession} close={() => { setSelectedSession(null); updateSessions() }} />
            </div>
        </div>
    </div>
}

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
}