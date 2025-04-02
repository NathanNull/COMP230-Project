import { gstyles } from "../helpers/globalStyles";
import Modal from "../helpers/Modal";
import { getEndpoint } from "../helpers/database";

export default function TutorInfoModal({ tutor, close }) {
    if (tutor === null) {
        return <></>
    }

    return <Modal visible={tutor !== null}>
        <h3>{`Book a session with ${tutor?.firstname} ${tutor?.lastname}`}</h3>
        <div style={{display: 'flex', gap: 20}}>
            <button style={{ ...gstyles.button }} onClick={close}>Close</button>
        </div>
    </Modal>
}