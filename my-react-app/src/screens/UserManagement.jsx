import React, { useEffect, useState } from 'react';
import { FaUser, FaHome, FaSignOutAlt,FaInfoCircle,FaTools   } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";


const container = {
  position: 'fixed',          // Ensure it fills the screen
  top: 0,
  left: 0,
  width: '100vw',             // Full viewport width
  height: '100vh',            // Full viewport height
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45c003edd2be")',
  backgroundSize: 'cover',    // Scale to cover full screen
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat', // Avoid tiling
  overflow: 'auto',
  zIndex: -1                  // Keep it behind all content
};
const header= {
    background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
    padding: '1.2rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };
const logoImage= {
    width: '40px',
    height: '40px',
    marginRight: '10px'
  };
const logoHighlight= {
    color: '#4fd1c5',
  };
const tableStyle = {
  width: '100%',
  maxWidth: '1250px',
  margin: '10px auto',
  backgroundColor: '#f7f7f9',
  borderCollapse: 'collapse',
  borderRadius: '12px',
  overflow: 'auto',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
};

const thStyle = {
  backgroundColor: '#375a8c', // darker, elegant blue
  color: 'white',
  padding: '16px',
  textAlign: 'center',
  fontSize: '1rem',
  fontWeight: 'bold',
  borderBottom: '2px solid #e0e0e0'
};

const tdStyle = {
  fontSize: '1.05rem',
  padding: '14px 12px',
  textAlign: 'center',
  backgroundColor: '#f4f7fb', // very light background
  color: '#333',
  borderBottom: '1px solid #e0e0e0',
  fontWeight: 'bold'
};

const buttonStyle = {
  backgroundColor: '#c0392b',
  color: 'white',
  padding: '6px 14px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
};
const menuItem= {
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
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
  };
  const activeMenuItem= {
  backgroundColor: 'white',
    color: '#2b5876',
    fontWeight: '600',
    borderRadius: '30px',
    padding: '0.6rem 1.4rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};
const rightTitle= {
  color: 'white',
  fontSize: '2.1rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};
const logo2= {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({ total: 0, admins: 0, workers: 0, customers: 0 });
  const [ratingsModalOpen, setRatingsModalOpen] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [workerRatings, setWorkerRatings] = useState({ avg: 0, count: 0, list: [] });
  useEffect(() => {
    const fetchStats = async () => {
      const user = JSON.parse(localStorage.getItem('userData'));
      if (!user || !user.accessToken) {
        alert('Not authorized. Please log in again.');
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/api/users/userStats', {
          headers: {
            'x-access-token': user.accessToken,
            'Content-Type': 'application/json'
          }
        });
        const stats = await response.json();
        
        if (response.ok) {
          setUserStats(stats);
        } else {
          alert('Failed to fetch stats.');
        }
      } catch (err) {
        alert("Error fetching user stats"+ err);
      }
    };

    fetchStats();
  }, []);
  const fetchUsers = async () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (!user || !user.accessToken) {
      alert('Not authorized. Please log in again.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/users/getAllUsers', {
        headers: {
          'x-access-token': user.accessToken,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok) {
        setUsers(result);
      } else {
        alert('Failed to fetch users.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while fetching users.');
    }
  };

  const deleteUser = async (userId) => {
    const user = JSON.parse(localStorage.getItem('userData'));
    const shouldDelete = window.confirm('Are you sure you want to delete this user?');
    if (!shouldDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}/deleteUser`, {
        method: 'DELETE',
        headers: {
          'x-access-token': user.accessToken
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the user.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === 'MainPage') navigate('/AdminMain');
    else if (option === 'UsersList') navigate('/UserManagement');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  const fetchWorkerRatings = async (workerId) => {
  const user = JSON.parse(localStorage.getItem('userData'));
  try {
    // Get avg & count
    const avgRes  = await fetch(`http://localhost:8000/api/workRates/avg/${workerId}`, {
      headers: { 'x-access-token': user.accessToken }
    });
    const { average = 0, count = 0 } = await avgRes.json();

    // Get feedback list
    const listRes = await fetch(`http://localhost:8000/api/workRates/${workerId}`, {
      headers: { 'x-access-token': user.accessToken }
    });
    const list = await listRes.json();

    setWorkerRatings({ avg: average, count, list });
    setRatingsModalOpen(true);
  } catch (err) {
    alert('Failed to load ratings.');
    setWorkerRatings({ avg: 0, count: 0, list: [] });
    setRatingsModalOpen(true);
  }
};


  return (
    <div style={container}>
      <header style={{ ...header, justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <div style={logo2}>
          <img src={logo} alt="Logo" style={logoImage} />
          House<span style={logoHighlight}>Fix</span>
        </div>

        {/* Center: Menu Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              ...menuItem,
              ...(location.pathname === '/CustomerMain' ? activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MainPage')}
          >
            <FaHome /> MainPage
          </div>
          <div
            style={{
              ...menuItem,
              ...(location.pathname === '/UserManagement' ? activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('UsersList')}
          >
            <FaTools /> Users List
          </div>
          <div
            style={{
              ...menuItem,
              ...(location.pathname === '/ProfilePage' ? activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Profile')}
          >
            <FaUser /> Profile
          </div>
          <div
            style={{
              ...menuItem,
              ...(location.pathname === '/login' ? activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Logout')}
          >
            <FaSignOutAlt /> Logout
          </div>
        </div>

        {/* Right: Page Title (e.g. MainPage) */}
        <div style={rightTitle}>
          <FaHome />
          MainPage
        </div>
      </header>
      <main style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2rem',
        gap: '2rem',
        padding: '0 2rem',
      }}>

        {/* Table container on the right */}
        <div style={{ flex: 1 }}>
          <h1 style={{ textAlign: 'center' }}>Users List</h1>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            backgroundColor: '#f0f4fa',   // very light blue
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            color: '#375a8c',
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            width: '100%',
            maxWidth: '800px',
            margin: '30px auto'
          }}>
            <span>Total Users: {userStats.total}</span>
            <span>||&nbsp; &nbsp; Admins: {userStats.admins}</span>
            <span>||&nbsp; &nbsp; Workers: {userStats.workers}</span>
            <span>||&nbsp; &nbsp; Customers: {userStats.customers}</span>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Account Type</th>
                <th style={thStyle}>Gender</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{user.isWorker ? 'Worker' : user.isAdmin ? 'Admin' : 'Customer'}</td>
                  <td style={tdStyle}>{user.gender}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                      <button style={buttonStyle} onClick={() => deleteUser(user._id)}>Delete User</button>
                      {user.isWorker && (
                        <button
                          style={{
                            ...buttonStyle,
                            backgroundColor: '#375a8c',
                            marginTop: 0,      // remove if using gap in the flex
                          }}
                          onClick={() => {
                            setCurrentWorker(user);
                            fetchWorkerRatings(user._id);
                          }}
                        >
                          View Ratings
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {ratingsModalOpen && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 3000
          }}>
            <div style={{
              background: '#fff', borderRadius: 12, minWidth: 360, maxWidth: 450,
              padding: 28, position: 'relative', boxShadow: '0 12px 28px rgba(0,0,0,.18)'
            }}>
              <button
                onClick={() => setRatingsModalOpen(false)}
                style={{
                  position: 'absolute', top: 10, right: 16, border: 'none',
                  background: 'transparent', fontSize: 26, cursor: 'pointer', color: '#888'
                }}
              >&times;</button>
              <h2 style={{ color: '#4a6fa5', marginBottom: 6 }}>
                Ratings for <span style={{ color:'#375a8c' }}>{currentWorker?.name}</span>
              </h2>
              <div style={{ margin: '18px 0' }}>
                <b>Average Rating:</b> {workerRatings.avg?.toFixed(2) || 0} / 5<br />
                <b>Total Ratings:</b> {workerRatings.count}
              </div>
              <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                {workerRatings.list.length === 0 ? (
                  <i style={{ color:'#888' }}>No feedbacks yet.</i>
                ) : (
                  <ul>
                    {workerRatings.list.map((r, i) => (
                      <li key={r._id || i} style={{ marginBottom: 10 }}>
                        <b>{r.customerName || 'Customer'}:</b>
                        <span> {r.rate}★</span>
                        <div style={{ fontStyle: 'italic', color: '#333', marginLeft: 8 }}>{r.feedback}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersList;
