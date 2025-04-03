import { useState } from 'react';
import logo from '../logo.svg';
import LoginModal from './LoginModal';
import { gstyles } from '../helpers/globalStyles';
import { useAuthContext } from '../helpers/auth';
import { NavLink } from 'react-router';
export default function Navbar() {
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const { user, logout } = useAuthContext();
    return (<div style={styles.navbar}>
        <NavLink to="/" style={styles.title}>EduConnect</NavLink>
        <div style={styles.rightSide}>
            {user === null
                ? <button style={gstyles.button} onClick={() => setLoginModalVisible(true)}>LOGIN</button>
                : <>
                    <span style={{color: 'white', paddingRight: 10}}>
                        {user.firstname} {user.lastname}
                    </span> <button style={gstyles.button} onClick={logout}>LOG OUT</button>
                </>
            }
            <NavLink to="/" style={{ height: '100%' }}><img src={logo} style={styles.logo} alt="logo" /></NavLink>
        </div>
        <LoginModal visible={loginModalVisible} setVisible={setLoginModalVisible} />
    </div>)
}

/**
 * @type {{[key: string]: React.CSSProperties}}
 */
const styles = {
    navbar: {
        boxSizing: 'border-box',
        width: '100%',
        position: 'sticky',
        top: 0,
        height: '10vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //background: 'linear-gradient(180deg, rgba(40,44,52,1) 0%, rgba(40,44,52,1) 80%, rgba(40,44,52,0) 100%)',
        backgroundColor: '#282c34',
        paddingLeft: '1%',
        //paddingBottom: '1%',
        zIndex: 10,
    },
    title: {
        fontSize: 50,
        fontWeight: 800,
        color: 'white',
        textDecoration: 'none',
    },
    rightSide: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        aspectRatio: 1,
        height: '100%',
    }
};