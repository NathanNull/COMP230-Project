import { gstyles } from "../helpers/globalStyles";
import Modal from "../helpers/Modal";
import * as date from "../helpers/date";
import { getEndpoint } from "../helpers/database";

export default function SessionTutorInfoModal({ session, close }) {
    if (session === null) {
        return <></> // stops me having to deal with ?. everywhere
    }

    const completeSession = async () => {
        try {
            let res = await getEndpoint(`completesession/${session.studentid}/${session.sessionid}`);
            console.log(res);
        } catch (err) {
            console.log(err);
        } finally {
            close();
        }
    }

    let sessiontime = date.mergeDateAndTime(date.toDate(session.sessiondate), date.toTimestamp(session.starttime));
    let time_relation = date.parseDuration(Math.abs(sessiontime - new Date(Date.now())));

    return <Modal visible={session !== null}>
        <h3>{`${session.notes} with ${session.firstname} ${session.lastname}
        (${session.sessionstatus}${session.sessionstatus === "Completed" ? ', Payment ' + session.paymentstatus : ''})`}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {`${date.toDate(session.sessiondate)} ${date.toTimestamp(session.starttime)}-${date.toTimestamp(session.endtime)}`}
            <span>{`(${sessiontime > Date.now() ? `In ${time_relation}` : `${time_relation} ago`})`}</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
            <button style={{ ...gstyles.button }} onClick={close}>Close</button>
            {session.sessionstatus === "Scheduled"
                ? <button style={{ ...gstyles.button, backgroundColor: '#3333aa', color: 'white' }} onClick={completeSession}>
                    Mark as Completed
                </button>
                : <></>}
        </div>
    </Modal>
}