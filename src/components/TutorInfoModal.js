import { gstyles } from "../helpers/globalStyles";
import Modal from "../helpers/Modal";
import { getEndpoint } from "../helpers/database";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toDate, toTimestamp } from "../helpers/date";
import { useAuthContext } from "../helpers/auth";

export default function TutorInfoModal({ tutor, close }) {
    const [chosenDate, setChosenDate] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [subject, setSubject] = useState(null);
    const [tutorSessions, setTutorSessions] = useState([]);
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(null);

    const { user } = useAuthContext();

    useEffect(() => {
        if (tutor === null) return;
        getEndpoint(`tutorsessions/${tutor.tutorid}`).then(s => {
            s.forEach(session => {
                session.starttime = toTimestamp(session.starttime);
                session.endtime = toTimestamp(session.endtime);
                session.sessiondate = toDate(session.sessiondate);
            });
            setTutorSessions(s)
        }).catch(console.error);
        getEndpoint(`taughtsubjects/${tutor.tutorid}`).then((s) => setSubject(s[0])).catch(console.error);
    }, [tutor])

    const cancel = (p = 0) => {
        console.log(p);
        setChosenDate(null);
        setEndTime(null);
        setNotes("");
        setPaymentMethod(null);
        close();
    }
    const pad = (num, n) => ("" + num).padStart(n, "0");
    const schedule = async () => {
        if (chosenDate === null || endTime === null || notes === "" || subject === null || paymentMethod === null) {
            return;
        }

        let date = `${pad(chosenDate.getDate(), 2)}-${pad(chosenDate.getMonth() + 1, 2)}-${chosenDate.getFullYear()}`;
        let starttime = `${pad(chosenDate.getHours(), 2)}:${pad(chosenDate.getMinutes(), 2)}:00`;
        let endtime = `${pad(endTime.getHours(), 2)}:${pad(endTime.getMinutes(), 2)}:00`;
        let sessionid = `SES${Math.floor(Math.random() * 100000)}`;
        let amount = Math.floor((parseTime(endtime) - parseTime(starttime)) / 60 * tutor.hourlywage);
        // really should have made this a json object, but no time now
        getEndpoint(
            `schedulesession/${sessionid}/${tutor.tutorid}/${user.edcuserid}
/${subject.subjectid}/${tutor.tutoringmode}/${date}/${starttime}/${endtime}/${notes}/${paymentMethod}/${amount}`
        ).then(cancel).catch(console.error);
    }

    const parseTime = (hh_mm) => {
        let [hh, mm] = hh_mm.split(":").map(n => parseInt(n, 10));
        return hh * 60 + mm;
    }
    const isAvailable = (time) => {
        let d = new Date(time);
        if (d < new Date()) {
            return false;
        }
        let hh_mm = `${d.getHours()}:${d.getMinutes()}`;
        let day = d.toDateString();
        return tutorSessions.every(session =>
            session.sessiondate !== day ||
            (parseTime(session.starttime) > parseTime(hh_mm) || parseTime(session.endtime) <= parseTime(hh_mm))
        );
    }
    const validEndTime = (time) => {
        let date = new Date(time);
        date.setFullYear(chosenDate.getFullYear(), chosenDate.getMonth(), chosenDate.getDate());
        if (date <= chosenDate) {
            return false;
        }
        let starttime = chosenDate.getHours() * 60 + chosenDate.getMinutes();
        let endtime = date.getHours() * 60 + date.getMinutes();
        return tutorSessions.every(session =>
            session.sessiondate !== date.toDateString()
            || parseTime(session.starttime) >= endtime
            || parseTime(session.endtime) <= starttime
        );
    }
    return <Modal visible={tutor !== null}>
        <h3>{`Book a session with ${tutor?.firstname} ${tutor?.lastname} (${tutor?.tutoringmode}, ${subject?.subjectid??tutor?.subjecttaught})`}</h3>
        <DatePicker selected={chosenDate} onChange={(date) => {
            setChosenDate(date);
            setEndTime(new Date(date.getTime() + (30 * 60 * 1000)));
        }} filterDate={(date) => {
            let diff = date - new Date();
            return diff > 0 && diff < 31 * 24 * 60 * 60 * 1000;
            // Can't choose dates before now, and can't choose dates more than a month from now (arbitrarily).
        }} placeholderText="Date and Start Time" filterTime={isAvailable} showTimeSelect />
        {chosenDate === null ? <></> : <div>
            Date: {chosenDate.toDateString()} <br />
            Start Time: {pad(chosenDate.getHours(), 2)}:{pad(chosenDate.getMinutes(), 2)} <br />
            <DatePicker selected={endTime} onChange={setEndTime} filterTime={validEndTime}
                placeholderText="End Time" timeCaption="End Time" showTimeSelect showTimeSelectOnly />
            {endTime === null ? <></> : <div>End Time: {pad(endTime.getHours(), 2)}:{pad(endTime.getMinutes(), 2)}</div>}
        </div>}
        <input type="text" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value={null}>Choose a Payment Method</option>
            <option value="Card">Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
        </select>
        <div style={{ display: 'flex', gap: 20 }}>
            <button style={{ ...gstyles.button }} onClick={cancel}>Close</button>
            <button style={{
                ...gstyles.button,
                backgroundColor: !(chosenDate === null || endTime === null || notes === "" || subject === null || paymentMethod === null)
                    ? '#33aa33' : 'grey',
                color: 'white'
            }} onClick={schedule}>
                Schedule
            </button>
        </div>
    </Modal>
}