export default function Modal({ visible, children }) {
    return (<div style={{
        display: visible ? 'flex' : 'none',
        position: 'fixed',
        zIndex: 20,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        color: 'black',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    }}>
        {children}
    </div>)
}