import React, { useState, useEffect } from 'react';
import {FaInfoCircle , FaUser, FaHome,FaTools , FaSignOutAlt, FaSearch } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
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
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
  },
  activeMenuItem: {
    backgroundColor: 'white',
    color: '#2b5876',
    fontWeight: '600',
    borderRadius: '30px',
    padding: '0.6rem 1.4rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  rightTitle: {
    color: 'white',
    fontSize: '2.1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  welcome: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#4a6fa5',
    marginTop:'-1rem'
  },
  paragraph: {
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '1rem',
    lineHeight: 1.8,
  },
  
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    overflowY:'auto'
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    position: 'relative', 
  },
  modalTitle: {
    marginBottom: '1.5rem',
    color: '#4a6fa5',
    marginLeft:'165px',
    marginTop:'-0.8rem'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '0.3rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  mainContentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    padding: '4rem 9%',
    gap: '2rem',
    alignItems: 'stretch',
    overflowY:'auto'
  },
  contentBox: {
    flex: '1 1 45%',
    minWidth: '300px',
    padding: '5rem 6rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  ratingContainer: {
    flex: '1 1 35%',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginTop:'2.5rem',
    border: '3px solid #ccc',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#4a6fa5',
    marginBottom: '0.1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #eee',
    marginTop:'15px'
  },
  ratingTitle: {
    fontSize: '2rem',
    color: '#4a6fa5',
    marginBottom: '1rem'
  },
  stars: {
    display: 'flex',
    justifyContent: 'center',
    color: '#375a8c',
    marginBottom: '1rem',
    gap: '10px'
  },
  submitRatingBtn: {
    marginTop: '1.2rem',
    padding: '10px 20px',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    opacity: 1
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: '#4a6fa5',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  formLabel2: {
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.3rem',
    color: '#4a6fa5',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #eee',
    marginTop:'-15px'
  },
  searchContainer: {
    margin: '1rem 0',
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    marginInline: 'auto'
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px 12px 40px',
    borderRadius: '25px',
    border: '2px solid #4a6fa5',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#4a6fa5'
  }
};

export default function CustomerMain() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [calls, setCalls] = useState([]);
  const [allCalls, setAllCalls] = useState([]); // Store all calls for filtering
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ callType: '', city:'',street:'',houseNumber:'', description: '', status:''});
  const [editingCallId, setEditingCallId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllCalls = async () => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));

    try {
      const response = await fetch(`http://localhost:8000/api/events/getEvents`, {
        method: "GET",
        headers: {
          "x-access-token": storedUser.accessToken
        }
      });

      const result = await response.json();

      if (response.ok) {
        setCalls(result);
        setAllCalls(result); // Store all calls for filtering
        calls.map((call) => (setFormData({ callType: call.callType,city:call.city, street:call.street,
          houseNumber:call.houseNumber,  description: call.description, status:call.status})
        ));
      } else {
        alert("❌ Failed to fetch calls: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error fetching calls:", err);
      alert("An unexpected error occurred while fetching the calls.");
    }
  };

  const fetchRatings = async () => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (!storedUser || !storedUser.accessToken) {
      alert("Unauthorized: No token found");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/ratings/getAllRatings", {
        headers: {
          "x-access-token": storedUser.accessToken,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch ratings");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected an array of ratings");
      }

      setRatings(data);
      const avg = data.reduce((sum, r) => sum + Number(r.rating), 0) / data.length;
      setAverageRating(avg || 0);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
    }
    
    fetchRatings();
    fetchAllCalls();
  }, []);

  // Filter calls based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setCalls(allCalls);
    } else {
      const filtered = allCalls.filter(call => {
        const searchLower = searchTerm.toLowerCase();
        return (
          call.callID.toString().includes(searchLower) ||
          call.callType.toLowerCase().includes(searchLower) ||
          call.description.toLowerCase().includes(searchLower) ||
          `${call.city}, ${call.street} ${call.houseNumber}`.toLowerCase().includes(searchLower) ||
          new Date(call.date).toLocaleDateString().toLowerCase().includes(searchLower) ||
          call.costumerdetails.join(', ').toLowerCase().includes(searchLower)
        );
      });
      setCalls(filtered);
    }
  }, [searchTerm, allCalls]);

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
  
  const handleEditCall = async (callID, updatedData) => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || !storedUser.accessToken) {
      alert("Unauthorized. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/api/events/updateEvent/${callID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": storedUser.accessToken
        },
        body: JSON.stringify(updatedData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Call updated successfully.");
        fetchAllCalls();
        setShowModal(false);
      } else {
        alert("❌ Failed to update call: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error updating call:", err);
      alert("An unexpected error occurred while updating the call.");
    }
  };
  
  const handleDeleteCall = async (callID) => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    const shouldDelete = window.confirm('Are you sure you want to delete this call?');
    if (!shouldDelete) return;

    if (!storedUser || !storedUser.accessToken) {
        alert("Unauthorized. Please log in again.");
        return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/events/deleteEvent/${callID}`, {
        method: "DELETE",
        headers: {
          "x-access-token": storedUser.accessToken
        }
      });
      const result = await response.json();

      if (response.ok) {
        alert("Call deleted succesfully ...! ");
        fetchAllCalls();
      } else {
        alert("❌ Failed to delete call: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error with deleting call:", err);
      alert("An unexpected error occurred while deleting the call.");
    }
  };

  const cancelbtn = async () => {
    setShowModal(false);
    calls.map((call) => (setFormData({ callType: call.callType,city:call.city, street:call.street,
      houseNumber:call.houseNumber,  description: call.description, status:call.status})
    ))
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
              ...(location.pathname === '/AdminMain' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MainPage')}
          >
            <FaHome /> MainPage
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/UserManagement' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('UsersList')}
          >
            <FaTools /> Users List
          </div>
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
      <div style={styles.mainContentRow}>
        <div style={styles.contentBox}>
            <h2 style={styles.welcome}>Welcome {userName}!</h2>
            
            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by Call ID, Type, Description, Address, Date, or Customer..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <p style={styles.paragraph}>
                <strong> All Website's Calls : </strong>            
            </p>
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginTop: '1rem',
              padding: '2rem',
              border: '3px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              {calls.length === 0 ? (
                <p>No calls available for at the website.</p>
              ) : (
                calls.map((call) => (
                  <div key={call.callID} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1.6rem 1.5rem',
                    marginBottom: '1rem',
                    backgroundColor: '#ffffff',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    position: 'relative'
                  }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ marginBottom: '0.7rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#4a6fa5' }}>Call ID:</strong> {call.callID}
                      </div>
                      <div style={{ marginBottom: '0.7rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#4a6fa5' }}>Call Type:</strong> {call.callType}
                      </div>
                      <div style={{ marginBottom: '0.7rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#4a6fa5' }}>Description:</strong> {call.description}
                      </div>
                      <div style={{ marginBottom: '0.7rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#4a6fa5' }}>Customer:</strong> {call.costumerdetails.join(', ')}
                      </div>
                      <div style={{ marginBottom: '0.7rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#4a6fa5' }}>Address:</strong> {call.city}, {call.street} {call.houseNumber}
                      </div>
                      <div style={{ marginBottom: '0.7rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#4a6fa5' }}>Open date:</strong> {new Date(call.date).toLocaleDateString()}
                      </div>
                      <div style={{ marginBottom: '0.7rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#4a6fa5' }}>Call status:</strong> {call.status}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.2rem',
                      marginLeft: '2rem',
                      marginTop: '7rem'
                    }}>
                      <button
                        style={{
                          backgroundColor: '#4a6fa5',
                          color: 'white',
                          border: 'none',
                          padding: '12.5px 60px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          minWidth: '110px'
                        }}
                        onClick={() => {
                          setEditingCallId(call.callID);
                          setFormData({
                            callType: call.callType,
                            city:call.city,
                            street:call.street,
                            houseNumber:call.houseNumber,
                            description: call.description,
                            status: call.status
                          });
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '12.5px 60px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          minWidth: '110px'
                        }}
                        onClick={() => handleDeleteCall(call.callID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Edit Modal (placed once, outside .map) */}
              {showModal && (
                <div style={styles.modalOverlay}>
                  <div style={styles.modal}>
                    <button
                      onClick={cancelbtn}
                      style={{
                        position: 'fixed',
                        top: '10px',
                        right: '14px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        color: 'black'
                      }}
                    >
                      ×
                    </button>

                    <h1 style={styles.modalTitle}>Edit Call</h1>

                    <label style={styles.formLabel}>Call Type:</label>
                    <select
                      style={styles.input}
                      value={formData.callType}
                      onChange={(e) => setFormData({ ...formData, callType: e.target.value })}
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Painting">Painting</option>
                      <option value="Other">Other</option>
                    </select>

                    <label style={styles.formLabel}>Description:</label>
                    <textarea
                      style={{
                        ...styles.input,
                        height: '120px',
                        resize: 'vertical',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap'
                      }}
                      placeholder="Edit the problem's description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <label style={styles.formLabel}>Status:</label>
                    <select
                      style={styles.input}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Open">Open</option>
                      <option value="in progress">in progress</option>
                      <option value="completed">completed</option>
                    </select>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                      <button
                        onClick={cancelbtn}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#f0f0f0',
                          color: '#555',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        style={styles.submitBtn}
                        onClick={() => handleEditCall(editingCallId, formData)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

              {/* Rating Section */}
              <div style={styles.ratingContainer}>
                  <h3 style={styles.ratingTitle}>Website Ratings</h3>
                  
                  {/* Average Rating */}
                  {ratings.length > 0 && (
                  <div style={{ marginTop: '1rem', color: '#4a6fa5', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      Overall Rating: {averageRating.toFixed(1)} / 5 ★
                  </div>
                  )}

                  {/* Rating List Scrollbox */}
                  {ratings.length > 0 && (
                  <div style={{
                      marginTop: '1rem',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: '#f9f9f9',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      maxWidth: '90%',       
                      width: '700px',          
                      marginInline: 'auto' 
                  }}>
                      {ratings.map((entry, idx) => {
                        const date = new Date(entry.date);
                        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

                        return (
                          <div key={idx} style={{ marginBottom: '0.8rem' }}>
                            <strong>{entry.username} ( {entry.usertype} )</strong> :: {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
                            <div style={{ fontSize: '0.85rem', color: '#555', marginLeft: '1rem' }}>
                              {formattedDate}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}