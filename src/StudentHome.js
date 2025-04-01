import { useEffect, useState } from "react";
import { getEndpoint } from "./helpers/database";
import { useNavigate } from "react-router";
import { useAuthContext } from "./helpers/auth";

const toTimestamp = (time) => {
    // 10:00:00 *date stuff*
    //      ^ split here
    let colon_split = new Date(time).toTimeString().split(':');
    colon_split.pop();
    return colon_split.join(":")
}

export default function StudentHome() {
    let [tutors, setTutors] = useState([]);
    let [sessions, setSessions] = useState([]);
    let navigate = useNavigate();
    let { user } = useAuthContext();
    useEffect(() => {
        if (user == null) {
            navigate("/");
        } else {
            getEndpoint("tutors").then(setTutors).catch(console.error);
            getEndpoint(`bookedsessions/${user.edcuserid}`).then(setSessions).catch(console.error);
        }
    }, [user]);
    return <div>
        Tutors Available <br/>
        TODO: turn this into a carousel or something like that + click to book sessions
        <ol>
            {tutors.map((t, i) => <li key={i}>
                {`${t.firstname} ${t.lastname}, ${t.subjecttaught} tutor (uid ${t.tutorid})`}
            </li>)}
        </ol>
        Sessions Booked <br/>
        TODO: cancellations + payment
        <ol>
            {sessions.map((t, i) => <li key={i}>
                {`Session #${t.sessionid}, with tutor ${t.firstname} ${t.lastname} (status: ${t.sessionstatus},
                time: ${toTimestamp(t.starttime)}-${toTimestamp(t.endtime)}, notes: ${t.notes})`}
            </li>)}
        </ol>
    </div>;
}