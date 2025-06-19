import React, { useState, useEffect } from 'react';
import { FaTools, FaListAlt, FaBars, FaUser, FaSignOutAlt, FaInfoCircle, FaHome, FaCheckCircle } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45c003edd2be")',
    backgroundSize: 'cover',    // Scale to cover full screen
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
    padding: '1.4rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logoImage: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  logoHighlight: {
    color: '#4fd1c5',
  },
 
  content: {
    maxWidth: '850px',
    margin: '2rem auto',
    padding: '4rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxHeight: 'calc(100vh - 6rem)',
    overflow: 'auto',
  },
  sectionTitle: {
    color: '#4a6fa5',
    fontSize: '2.2rem',
    marginBottom: '1rem',
    marginTop: '0.5rem',
  },
  bulletItem: {
    display: 'flex',
    alignItems: 'start',
    gap: '0.6rem',
    marginBottom: '0.7rem',
    color: '#333',
    fontSize: '1.35rem',
    lineHeight: 1.6,
  },
  menuIcon: {
    fontSize: '1.6rem',
    cursor: 'pointer',
    marginLeft: '1.5rem',
  },
  dropdown: {
    position: 'absolute',
    top: '66px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxWidth: '200px',
    minWidth: '150px',
    padding: '2rem 1rem',
    overflow: 'hidden',
    zIndex: 2000,
  },
 menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: '30px',
    transition: 'all 0.3s ease',
    gap: '0.5rem',
    margin: '0 0.2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
},
  activeMenuItem: {
    backgroundColor: 'white',
    color: '#4a6fa5',
    fontWeight: 'bold',
    borderRadius: '999px',
    padding: '0.4rem 1.2rem',
    boxShadow: '0 2px 6px rgba(139, 0, 0, 0.1)'
  },
  rightTitle: {
    color: 'white',
    fontSize: '2.1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
};

export default function HelpPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ userType: '', _id: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('userData'));
        if (!storedUser || !storedUser.accessToken) {
          navigate('/login');
          return;
        }
        const response = await fetch(`http://localhost:8000/api/users/${storedUser.id}`, {
          headers: { 'x-access-token': storedUser.accessToken }
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData({
          userType: data.isAdmin ? 'Admin' : data.isWorker ? 'Worker' : 'Customer',
          _id: data._id || ''
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === 'MainPage') {
      if (userData.userType === 'Worker') navigate('/WorkerMain');
      else if (userData.userType === 'Admin') navigate('/UserManagement');
      else if (userData.userType === 'Customer') navigate('/CustomerMain');
    } 
    else if (option === 'MyWorks') navigate('/MyWorks');
    else if (option === 'MyRequests') navigate('/WorkerRequests');
    else if (option === 'MyCalls') navigate('/CustomerCalls');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Help') navigate('/HelpPage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  return (
    <div style={styles.container}>
      <header style={{ ...styles.header, justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <div style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
          House<span style={styles.logoHighlight}>Fix</span>
        </div>

        {/* Center: Menu Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/CustomerMain' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MainPage')}
          >
            <FaHome /> MainPage
          </div>
          {userData.userType === 'Worker' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/MyWorks' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('MyWorks')}
            >
              <FaTools /> MyWorks
            </div>
          )}
          {userData.userType === 'Worker' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/WorkerRequests' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('MyRequests')}
            >
              <FaListAlt /> MyRequests
            </div>
          )}
          {userData.userType === 'Customer' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/CustomerCalls' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('MyCalls')}
            >
              <FaTools /> MyCalls
            </div>
          )}
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/ProfilePage' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Profile')}
          >
            <FaUser /> Profile
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/HelpPage' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Help')}
          >
            <FaInfoCircle /> Help
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/login' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Logout')}
          >
            <FaSignOutAlt /> Logout
          </div>
        </div>

        {/* Right: Page Title (e.g. MainPage) */}
        <div style={styles.rightTitle}>
          <FaHome />
          MainPage
        </div>
      </header>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Welcome to HouseFix!</h2>
        <p style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
               <span>HouseFix helps you connect with local service providers or find work as one. Whether you’re a customer or a worker, here’s how to make the most of the platform:</span></p>

        <h2 style={styles.sectionTitle}>For Customers</h2>
        <div>
          <div style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
              <span>Open a new call about what you want to fix in your house by clicking the "Open Call" button in the "MainPage".</span></div>
          <div style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
              <span>View call history and track status via the "MyCalls" page.</span></div>
          <div style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
             <span>Review worker requests and pick based on their location or details.</span></div>
          <div style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
             <span>Manage your profile and password through the "Profile" page.</span></div>
        </div>

        <h2 style={styles.sectionTitle}>For Workers</h2>
        <div>
          <div style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
              <span>Browse open calls in the "MainPage" and accept jobs matching your work type.</span></div>
          <div style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
               <span>Track accepted or completed jobs in "MyWork".</span></div>
          <div style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
              <span>Update your profile or password in the "Profile" page.</span></div>
          <div style={styles.bulletItem}><FaCheckCircle color="#4a6fa5" size={18} style={{ flexShrink: 0, marginTop: '4px' }} />
             <span>Add a personal description so customers know who they're working with.</span></div>
        </div>
      </div>
    </div>
  );
}