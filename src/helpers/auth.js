import { createContext, useState, useContext, useEffect } from "react";
import { getEndpoint } from "./database";

// very good and normal hash function
const hash = (val) => "hashed_" + val;

const AuthContext = createContext({ login: async (email, password) => false, logout: ()=>{},  user: null });
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
    useEffect(() => {
        login("liam.d@email.com", "pw3").then(() => console.log("Logging in automagically (auth.js), remove this in the final ver pls"))
    }, []);
    return <AuthContext.Provider value={{ login, logout, user }}>
        {children}
    </AuthContext.Provider>
}
export function useAuthContext() {
    return useContext(AuthContext);
}