import { useState } from "react";
import { gstyles } from "../helpers/globalStyles";
import { useAuthContext } from "../helpers/auth";
import Modal from "../helpers/Modal";

export default function LoginModal({ visible, setVisible }) {
    const { login, user } = useAuthContext();
    const empty_form = { email: "", password: "" };
    const [formData, setFormData] = useState(empty_form);
    const [failReason, setFailReason] = useState("");
    /**
     * 
     * @param {React.FormEvent<HTMLFormElement>} e 
     * @returns 
     */
    const submitLoginInfo = async (e) => {
        e.preventDefault();
        const forminfo = new FormData(e.target);
        let [email, pass] = [forminfo.get("email"), forminfo.get("password")];
        if (email === "" || pass === "") {
            if (visible) {
                setFailReason("Missing email or password.");
            }
            return;
        }
        console.log(`Submitted login info ${[email, pass]}`);
        if (await login(email, pass)) {
            console.log("Logged in");
            console.log(user);
            setFailReason("");
            setVisible(false);
            setFormData(empty_form);
        } else {
            console.log("Failed login");
            setFailReason("Incorrect email or password.")
        }
    }

    const close = async () => {
        setVisible(false);
        setFormData(empty_form);
        setFailReason("");
    }

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (<Modal visible={visible}>
        <form onSubmit={submitLoginInfo} style={styles.form}>
            <label>
                Email: <input name="email" type="email" placeholder="Email" style={styles.input} value={formData.email} onChange={handleFormChange} />
            </label>
            <label>
                Password: <input name="password" type="password" placeholder="Password" style={styles.input} value={formData.password} onChange={handleFormChange} />
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ backgroundColor: '#33aa33', color: 'white', ...gstyles.button }} type="submit">Login</button>
                <button style={{ backgroundColor: '#aa3333', color: 'white', ...gstyles.button }} onClick={close}>Cancel</button>
            </div>
            <div style={{ display: failReason === "" ? 'none' : 'flex', color: 'red' }}>{failReason}</div>
        </form>
    </Modal>)
}

const styles = {
    input: { borderColor: 'lightgrey', borderRadius: 3 },
    form: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        gap: 10
    }
}