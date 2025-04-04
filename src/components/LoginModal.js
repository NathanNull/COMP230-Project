import { useState } from "react";
import { gstyles } from "../helpers/globalStyles";
import { useAuthContext } from "../helpers/auth";
import Modal from "../helpers/Modal";

export default function LoginModal({ visible, setVisible }) {
    const { login, user, createStudent, createTutor } = useAuthContext();
    const empty_form = {
        email: "", password: "", userType: "", firstName: "", lastName: "",
        phoneNumber: "", gradeLevel: "", objective: "", subjectTaught: "",
        qualification: "", experience: "", tutoringMode: "", hourlyWage: "",
        languageSpoken: ""
    };
    const [formData, setFormData] = useState(empty_form);
    const [failReason, setFailReason] = useState("");
    const [isNewAccount, setIsNewAccount] = useState(false);
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
            close();
        } else {
            console.log("Failed login");
            setFailReason("Incorrect email or password.")
        }
    }

    const createAccount = async (e) => {
        e.preventDefault();
        let edcuserdata = [formData.firstName, formData.lastName, formData.email, formData.password, formData.phoneNumber, formData.userType];
        if (formData.userType === "Student" && await createStudent(edcuserdata, formData.gradeLevel, formData.objective)
            && await login(formData.email, formData.password)) {

            console.log("Logged in");
            console.log(user);
            close();
        } else if (formData.userType === "Tutor" && await createTutor(edcuserdata, formData.subjectTaught, formData.qualification,
            formData.experience, formData.tutoringMode, formData.hourlyWage, formData.languageSpoken)
            && await login(formData.email, formData.password)) {

            console.log("Logged in");
            console.log(user);
            close();
        } else {
            console.log("Failed login");
            setFailReason("Missing/invalid data.")
        }
    }

    const close = () => {
        setVisible(false);
        setFormData(empty_form);
        setFailReason("");
        setIsNewAccount(false);
    }

    const handleFormChange = (e) => {
        console.log(e.target.name, e.target.value);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (<Modal visible={visible}>
        <form onSubmit={e => isNewAccount ? createAccount(e) : submitLoginInfo(e)} style={styles.form}>
            <h2 style={{ margin: 0 }}>{isNewAccount ? "Create an Account" : "Log In"}</h2>
            <label>
                Email: <input required name="email" type="email" placeholder="user@email.net" style={styles.input} value={formData.email} onChange={handleFormChange} />
            </label>
            <label>
                Password: <input required name="password" type="password" placeholder="Password" style={styles.input} value={formData.password} onChange={handleFormChange} />
            </label>
            {
                isNewAccount ? [
                    <label key='2'>
                        First Name: <input name="firstName" required={isNewAccount} type="text" value={formData.firstName}
                            onChange={handleFormChange} style={styles.input} placeholder="John" />
                    </label>,
                    <label key='3'>
                        Last Name: <input name="lastName" required={isNewAccount} type="text" value={formData.lastName}
                            onChange={handleFormChange} style={styles.input} placeholder="Smith" />
                    </label>,
                    <label key='4'>
                        Phone Number: <input name="phoneNumber" required={isNewAccount} type="tel" value={formData.phoneNumber}
                            onChange={handleFormChange} style={styles.input} placeholder="000-000-0000" />
                    </label>,
                    <label key='1'>
                        User Type: <select required={isNewAccount} name="userType" value={formData.userType} onChange={handleFormChange} style={styles.input}>
                            <option value="">Choose a User Type</option>
                            <option value="Student">Student</option>
                            <option value="Tutor">Tutor</option>
                        </select>
                    </label>,
                ]
                    : <></>
            }
            {
                isNewAccount && formData.userType === "Student" ? [
                    <label key='1'>
                        Grade Level: <input name="gradeLevel" required={isNewAccount && formData.userType === "Student"}
                            onChange={handleFormChange} type="number" style={styles.input} placeholder="13" value={formData.gradeLevel} />
                    </label>,
                    <label key='2'>
                        Learning Objective: <input name="objective" required={isNewAccount && formData.userType === "Student"}
                            onChange={handleFormChange} type="text" style={styles.input} placeholder="Exam Prep" value={formData.objective} />
                    </label>,
                ] : <></>
            }
            {
                isNewAccount && formData.userType === "Tutor" ? [
                    <label key='1'>
                        Subject Taught: <input name="subjectTaught" required={isNewAccount && formData.userType === "Tutor"}
                            onChange={handleFormChange} type="text" style={styles.input} placeholder="Biology" value={formData.subjectTaught} />
                    </label>,
                    <label key='2'>
                        Qualification: <input name="qualification" required={isNewAccount && formData.userType === "Tutor"}
                            onChange={handleFormChange} type="text" style={styles.input} placeholder="Ph.D. Mathematics" value={formData.qualification} />
                    </label>,
                    <label key='3'>
                        Years of Experience: <input name="experience" required={isNewAccount && formData.userType === "Tutor"}
                            onChange={handleFormChange} type="number" style={styles.input} placeholder="3" value={formData.experience} />
                    </label>,
                    <label key='4'>
                        Tutoring Mode: <select required={isNewAccount && formData.userType === "Tutor"} name="tutoringMode"
                            value={formData.tutoringMode} onChange={handleFormChange} style={styles.input}>
                            <option value="">Choose a Tutoring Mode</option>
                            <option value="Online">Online</option>
                            <option value="In person">In Person</option>
                        </select>
                    </label>,
                    <label key='5'>
                        Hourly Wage: $<input name="hourlyWage" required={isNewAccount && formData.userType === "Tutor"}
                            onChange={handleFormChange} type="number" style={styles.input} placeholder="40" value={formData.hourlyWage} />/hr
                    </label>,
                    <label key='6'>
                        Languages Spoken: <input name="languageSpoken" required={isNewAccount && formData.userType === "Tutor"}
                            onChange={handleFormChange} type="text" style={styles.input} placeholder="English" value={formData.languageSpoken} />
                    </label>,
                ] : <></>
            }
            <button type="button" onClick={() => setIsNewAccount(!isNewAccount)}>{isNewAccount ? "Log into an existing account" : "Create an account"}</button>
            <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ backgroundColor: '#33aa33', color: 'white', ...gstyles.button }} type="submit">{isNewAccount ? "Create" : "Login"}</button>
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