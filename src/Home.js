import logo from './logo.svg';
import { useEffect } from 'react';
import { useAuthContext } from './helpers/auth';
import { useNavigate } from 'react-router';

export default function Home() {
  document.styleSheets[0].insertRule(`@keyframes spin {
      0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }`)

  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user != null) {
      if (user.usertype = "Student") {
        navigate("/studenthome");
      } else {
        console.log("Unhandled user type "+user.usertype);
      }
    }
  }, [user])

  return (
    <div className="App">
      <header style={styles.container}>
        <img src={logo} style={styles.logo} alt="logo" />
        <span>Homepage (TODO: replace)</span>
      </header>
    </div>
  );
}

/**
 * @type {{[key: string]: React.CSSProperties}}
 */
const styles = {
  container: {
    position: '',
    backgroundColor: '#eeeeee',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: '40vmin',
    pointerEvents: 'none',
    animation: 'spin infinite 20s linear',
  }
}