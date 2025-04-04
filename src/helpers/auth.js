import { createContext, useState, useContext } from "react";
import { getEndpoint } from "./database";

// very good and normal hash function
const hash = (val) => "hashed_" + val;

const AuthContext = createContext({ login: async (email, password) => false, logout: () => { }, createStudent: async (...args) => { }, createTutor: async (...args) => { }, user: null });
export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const login = async (email, password) => {
        console.log("Logging in as " + email + " with password " + password);
        let pw_hash = hash(password);
        let res = await getEndpoint(`auth/${email}/${pw_hash}`);
        console.log(res);
        if (res.auth_ok) {
            setUser({ email, ...res });
        }
        return res.auth_ok;
    }
    const logout = () => {
        setUser(null);
    }
    const createUser = async (firstName, lastName, email, password, phone, type) => {
        let uid = Math.floor(Math.random() * 10000);
        try {
            await getEndpoint(`createuser/${uid}/${firstName}/${lastName}/${email}/${hash(password)}/${phone}/${type}`);
            return uid;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    const createStudent = async (edcuserdata, gradeLevel, objective) => {
        let uid = await createUser(...edcuserdata)
        if (uid !== null) {
            try {
                await getEndpoint(`createstudent/${uid}/Grade ${gradeLevel}/${objective}`);
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        } else {
            return false;
        }
    }
    const createTutor = async (edcuserdata, subject, qualification, experience, mode, wage, language) => {
        let uid = await createUser(...edcuserdata)
        if (uid !== null) {
            try {
                await getEndpoint(`createtutor/${uid}/${subject}/${qualification}/${experience}/${mode}/${wage}/${language}`);
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        } else {
            return false;
        }
    }
    // useEffect(() => {
    //     login("james.c@email.com", "pw6").then(() => console.log("Logging in automagically (auth.js), remove this in the final ver pls"))
    // }, []);
    return <AuthContext.Provider value={{ login, logout, createStudent, createTutor, user }}>
        {children}
    </AuthContext.Provider>
}
export function useAuthContext() {
    return useContext(AuthContext);
}