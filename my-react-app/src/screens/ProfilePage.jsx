import React, { useState, useRef, useEffect } from 'react';
import {FaUsers,FaTools, FaUser, FaEdit,FaListAlt, FaLock, FaHome, FaEnvelope, FaVenusMars, FaCalendarAlt, FaMapMarkerAlt, FaSignOutAlt,FaInfoCircle,FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Select from 'react-select';
import logo from '../assets/images/logo.png';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [editMode, setEditMode] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [setShowStreetFields] = useState(false);
  const [streets, setStreets] = useState([]);
  const mapRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [originalUserData, setOriginalUserData] = useState(null);
  const markerRef = useRef(null);
  
  const streetOptions = streets.map(street => ({
    value: street,
    label: street
  }));
  const [userData, setUserData] = useState({
    username: '',
    age: '',
    email: '',
    gender: '',
    userType: '',
    workType:'',
    city: '',
    street: '',
    houseNumber: '',
    description: '', 
    _id: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('userData'));
        if (!storedUser || !storedUser.accessToken) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:8000/api/users/${storedUser.id}`, {
          headers: {
            'x-access-token': storedUser.accessToken
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setOriginalUserData(data);

        setUserData({
          username: data.name || '',
          age: data.age || '',
          email: data.email || '',
          gender: data.gender || '',
          userType: data.isAdmin ? 'Admin' : data.isWorker ? 'Worker' : 'Customer',
          workType:data.workType||'',
          city: data.city || '',
          street: data.street || '',
          houseNumber: data.houseNumber || '',
          description: data.description || '',
          _id: data._id || ''
        });
        setOriginalUserData({
          username: data.name || '',
          age: data.age || '',
          email: data.email || '',
          gender: data.gender || '',
          userType: data.isAdmin ? 'Admin' : data.isWorker ? 'Worker' : 'Customer',
          workType:data.workType||'',
          city: data.city || '',
          street: data.street || '',
          houseNumber: data.houseNumber || '',
          description: data.description || '',
          _id: data._id || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (showMap) {
        setTimeout(() => {
        if (mapRef.current) {
            mapRef.current.off();
            mapRef.current.remove();
            mapRef.current = null;
            markerRef.current = null;
        }

        const map = L.map('leafletMap', { zoomControl: false }).setView([31.0461, 34.8516], 8);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        map.on('click', async (e) => {
            if (!markerRef.current) {
            const marker = L.marker(e.latlng, { draggable: true }).addTo(map);
            markerRef.current = marker;

            marker.on('dragend', async () => {
                const pos = marker.getLatLng();
                await updateLocationFields(pos.lat, pos.lng);
            });
            } else {
            markerRef.current.setLatLng(e.latlng);
            }

            await updateLocationFields(e.latlng.lat, e.latlng.lng, setUserData);
        });

        L.Control.geocoder({ defaultMarkGeocode: false })
            .on('markgeocode', async (e) => {
            const latlng = e.geocode.center;
            map.setView(latlng, 14);

            if (!markerRef.current) {
                const marker = L.marker(latlng, { draggable: true }).addTo(map);
                markerRef.current = marker;

                marker.on('dragend', async () => {
                const pos = marker.getLatLng();
                await updateLocationFields(pos.lat, pos.lng, setUserData);
            });
            } else {
                markerRef.current.setLatLng(latlng);
            }

            await updateLocationFields(latlng.lat, latlng.lng,setUserData);
            })
            .addTo(map);
        }, 0);
    }
    }, [showMap]);
      

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      if (!storedUser || !storedUser.accessToken) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/${userData._id}/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storedUser.accessToken
        },
        body: JSON.stringify({
          name: userData.username,
          age: userData.age,
          email: userData.email,
          gender: userData.gender,
          workType: userData.workType,
          city: userData.city,
          street: userData.street,
          houseNumber: userData.houseNumber,
          description: userData.description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // ✅ Update state
      setUserData(prev => ({
        ...prev,
        username: updatedUser.name || prev.username,
        age: updatedUser.age || prev.age,
        email: updatedUser.email || prev.email,
        gender: updatedUser.gender || prev.gender,
        workType: updatedUser.workType || prev.workType,
        city: updatedUser.city || prev.city,
        street: updatedUser.street || prev.street,
        houseNumber: updatedUser.houseNumber || prev.houseNumber,
        description: updatedUser.description || prev.description
      }));

      // ✅ Update localStorage
      localStorage.setItem('userData', JSON.stringify({
        ...storedUser,
        workType: updatedUser.workType || userData.workType
      }));

      setActiveTab('general'); 
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      alert('Error updating profile: ' + err.message);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("New passwords don't match");
        return;
      }
  
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      if (!storedUser || !storedUser.accessToken) {
        navigate('/login');
        return;
      }
  
      // Note: Changed endpoint from updateUser to updatePassword
      const response = await fetch(`http://localhost:8000/api/users/${userData._id}/updatePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storedUser.accessToken
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        // Use server error message if available
        throw new Error(result.message || 'Failed to update password');
      }
  
      // Clear password fields on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setActiveTab('general');         // 🔥 go back to General
      alert(result.message || 'Password updated successfully!');
    } catch (err) {
      console.error('Password update error:', err);
      alert(`Error updating password: ${err.message || 'Unknown error occurred'}`);
    }
  };

  const updateLocationFields = async (lat, lng, setUserData) => {
    try {
      const [heData, enData] = await Promise.all([
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=he`).then(res => res.json()),
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`).then(res => res.json())
      ]);
  
      const extract = (data) => {
        const a = data.address;
        const city = a.city || a.town || a.village || a.hamlet || a.state_district || a.state || "";
        const country = a.country || "";
        return { city, country };
      };
  
      const he = extract(heData);
      const en = extract(enData);
      const fullCity = `${he.city}, ${he.country} | ${en.city}, ${en.country}`;
  
      setUserData(prev => ({ ...prev, city: fullCity }));
      const streets = await fetchStreetsByCity(he.city);
      setStreets(streets); // ✅ new way to update streets
   
    } catch (err) {
      console.error('Error fetching city from coordinates:', err);
    }
  };

  const fetchStreetsByCity = async (cityName) => {
    try {
      const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&accept-language=he&limit=1&extratags=1`;
      const nomRes = await fetch(nominatimURL);
      const nomData = await nomRes.json();
  
      if (!nomData.length) {
        console.warn("City not found in Nominatim:", cityName);
        return [];
      }
  
      const { osm_id, osm_type } = nomData[0];
      let areaId;
  
      if (osm_type === "relation") {
        areaId = 3600000000 + parseInt(osm_id);
      } else if (osm_type === "way") {
        areaId = 2400000000 + parseInt(osm_id);
      } else if (osm_type === "node") {
        areaId = 1600000000 + parseInt(osm_id);
      } else {
        console.error("Unknown OSM type:", osm_type);
        return [];
      }
  
      const query = `
        [out:json][timeout:25];
        area(${areaId})->.searchArea;
        (
          way["highway"]["name"](area.searchArea);
        );
        out tags;
      `;
  
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
  
      const data = await response.json();
      const streetSet = new Set();
  
      data.elements.forEach(el => {
        if (el.tags?.name) {
          streetSet.add(el.tags.name);
        }
      });
  
      return [...streetSet].sort();
  
    } catch (err) {
      console.error("❌ Failed to load streets:", err);
      return [];
    }
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  useEffect(() => {
    // Only run after userData is loaded AND city exists
    if (userData.city) {
      const cityOnly = userData.city.split('|')[0].split(',')[0].trim(); // extract Hebrew city name
      fetchStreetsByCity(cityOnly).then(setStreets);
    }
  }, [userData.city]);
  
  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === 'MainPage'){
      if (userData.userType=='Worker')
       navigate('/WorkerMain');
      else if(userData.userType=='Admin')
        navigate('/AdminMain');
      else if(userData.userType=='Customer')
        navigate('/CustomerMain');
    }
    else if (option === 'MyWorks') navigate('/MyWorks');
    else if (option === 'MyRequests') navigate('/WorkerRequests');
    else if (option === 'MyCalls') navigate('/CustomerCalls');
    else if (option === 'UsersList') navigate('/UserManagement');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Help') navigate('/HelpPage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  // All styles defined as a JavaScript object
const styles = {
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: 'all 0.2s ease',
    marginBottom: '1rem',
    '&:focus': {
      borderColor: '#4fd1c5',
      boxShadow: '0 0 0 3px rgba(79, 209, 197, 0.2)',
      outline: 'none',
    }
  },
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    overflow: 'hidden'
  },
  header: {
    position: 'fixed',
    width: '97%',
    background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '1.2rem 2rem',
    display: 'flex',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'white',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logoImage: {
    width: '40px',
    height: '40px',
    marginRight: '10px'
  },
  logoHighlight: {
    color: '#4fd1c5'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '0.6rem 1.2rem',
    borderRadius: '30px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
    }
  },
  navActive: {
    backgroundColor: 'white',
    color: '#2b5876',
    fontWeight: '600',
    borderRadius: '30px',
    padding: '0.6rem 1.4rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  main: {
    marginTop: '80px',
    display: 'flex',
    flex: 1,
    maxWidth: '1400px',
    margin: '6rem auto',
    width: '90%',
    gap: '2rem',
    padding: '0 1rem'
  },
  sidebar: {
    width: '300px',
    flexShrink: 0
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '2rem',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  userAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#2b5876',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    fontSize: '2.5rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  userName: {
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  userRole: {
    backgroundColor: 'rgba(43, 88, 118, 0.1)',
    color: '#2b5876',
    padding: '0.4rem 1rem',
    borderRadius: '30px',
    fontSize: '0.9rem',
    fontWeight: 600,
    display: 'inline-block',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  profileTabs: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '0.5rem 0'
  },
  tabBtn: {
    width: '100%',
    padding: '1rem 1.5rem',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    fontSize: '1rem',
    color: '#4a5568',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:hover': {
      backgroundColor: 'rgba(79, 209, 197, 0.1)',
    }
  },
  activeTab: {
    backgroundColor: 'rgba(79, 209, 197, 0.15)',
    color: '#2b5876',
    borderLeft: '4px solid #4fd1c5',
    fontWeight: '600'
  },
  tabIcon: {
    fontSize: '1.2rem',
    width: '24px',
    color: '#4a5568'
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '2.5rem'
  },
  section: {
    marginBottom: '2rem',
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
    paddingBottom: '0.8rem',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  formRow: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.8rem',
    fontWeight: '600',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  inputIcon: {
    color: '#4fd1c5',
    fontSize: '1rem'
  },
  formInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:focus': {
      borderColor: '#4fd1c5',
      boxShadow: '0 0 0 3px rgba(79, 209, 197, 0.2)',
      outline: 'none',
    }
  },
  formInputDisabled: {
    backgroundColor: '#f8fafc',
    color: '#718096',
    cursor: 'not-allowed'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1.5rem',
    marginTop: '2.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0'
  },
  saveBtn: {
    backgroundColor: '#4fd1c5',
    background: 'linear-gradient(135deg, #4fd1c5 0%, #38b2ac 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '0.8rem 1.8rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 2px 10px rgba(79, 209, 197, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(79, 209, 197, 0.4)',
    }
  },
  cancelBtn: {
    backgroundColor: '#f8fafc',
    color: '#718096',
    border: '1px solid #e2e8f0',
    borderRadius: '30px',
    padding: '0.8rem 1.8rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:hover': {
      backgroundColor: '#edf2f7',
    }
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#4a5568',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  error: {
    color: '#e53e3e',
    textAlign: 'center',
    padding: '1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontWeight: '600'
  },
  mapModal: (showMap) => ({
    display: showMap ? 'flex' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    overflowY: 'auto',
  }),
  closeBtn: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 1001,
    padding: '8px 16px',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#c53030',
    }
  },
  mapContainer: {
    width: '90%',
    height: '80%',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    borderRadius: '16px',
    overflow: 'hidden'
  },
  mapButton: {
    marginTop: '1rem',
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    }
  },
  menuIcon: {
    fontSize: '1.8rem',
    color: 'white',
    cursor: 'pointer',
    marginLeft: '1.5rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#4fd1c5'
    }
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
    }
  },
  activeMenuItem: {
    backgroundColor: 'white',
    color: '#2b5876',
    fontWeight: '600',
    borderRadius: '30px',
    padding: '0.6rem 1.4rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  rightTitle: {
    color: 'white',
    fontSize: '1.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }
};

  if (loading) {
    return <div style={styles.loading}>Loading profile data...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
     <header style={{ ...styles.header, justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <div style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
          House<span style={styles.logoHighlight}>Fix</span>
        </div>

        {/* Center: Menu Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {userData.userType === 'Customer' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/CustomerMain' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('MainPage')}
            >
              <FaHome /> MainPage
            </div>
          )}
          {userData.userType === 'Worker' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/WorkerMain' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('MainPage')}
            >
              <FaHome /> MainPage
            </div>
          )}
          {userData.userType === 'Admin' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/AdminMain' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('MainPage')}
            >
              <FaHome /> MainPage
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
          {userData.userType === 'Admin' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/UserManagement' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('UsersList')}
            >
              <FaUsers /> Users List
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
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/ProfilePage' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Profile')}
          >
            <FaUser /> Profile
          </div>
          {userData.userType !== 'Admin' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/HelpPage' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('Help')}
            >
              <FaInfoCircle /> Help
            </div>
          )}
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
  
      {/* Main Content */}
      <main style={styles.main}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              <FaUser style={styles.avatarIcon} />
            </div>
            <h3 style={styles.userName}>{userData.username}</h3>
            <p style={styles.userRole}>{userData.userType}</p>
          </div>
  
          <nav style={styles.profileTabs}>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'general' ? styles.activeTab : {})
              }}
              onClick={() => {
                setActiveTab('general');
                setEditMode(false);
              }}
            >
              <FaUser style={styles.tabIcon} /> General
            </button>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'edit' ? styles.activeTab : {})
              }}
              onClick={() => {
                setActiveTab('edit');
                setEditMode(true);
              }}
            >
              <FaEdit style={styles.tabIcon} /> Change Details
            </button>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'password' ? styles.activeTab : {})
              }}
              onClick={() => {
                setActiveTab('password');
                setEditMode(false);
              }}
            >
              <FaLock style={styles.tabIcon} /> Change Password
            </button>
          </nav>
        </div>
  
        {/* Profile Content */}
        <div style={styles.content}>
          {(activeTab === 'general' || activeTab === 'edit') && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Personal Information</h2>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaUser style={styles.inputIcon} /> Username:
                </label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                />
              </div>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaCalendarAlt style={styles.inputIcon} /> Age:
                </label>
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                />
              </div>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaEnvelope style={styles.inputIcon} /> Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                />
              </div>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaVenusMars style={styles.inputIcon} /> Gender:
                </label>
                <select
                  name="gender"
                  value={["male", "female", "other"].includes(userData.gender.toLowerCase()) ? capitalizeFirstLetter(userData.gender) : "Other"}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>User Type:</label>
                <input
                  type="text"
                  value={userData.userType}
                  style={{
                    ...styles.formInput,
                    ...styles.formInputDisabled
                  }}
                  disabled
                />
              </div>
              {userData.userType === 'Worker' && (
                <div className={styles.formGroup}>
                  <label style={styles.formLabel}>
                   Work Type:
                  </label>
                  <select
                  name="workType"
                  value={userData.workType}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                >
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Painter">Painter</option>
                  <option value="Handy Man">Handy Man</option>
                </select>
                </div>
              )}
              {userData.userType === 'Worker' && (
                <div className={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <FaHome style={styles.inputIcon} /> Description:
                  </label>
                  <textarea
                    name="description"
                    value={userData.description}
                    onChange={handleInputChange}
                    style={{
                      ...styles.formInput,
                      ...(activeTab !== 'edit' ? styles.formInputDisabled : {}),
                      height: '90px', // make it taller
                      resize: 'vertical'
                    }}
                    disabled={activeTab !== 'edit'}
                    placeholder="Enter a brief description about your services"
                  />
                </div>
              )}

  
              <h2 style={styles.sectionTitle}>Address Information</h2>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel2}>
                  <FaMapMarkerAlt style={styles.inputIcon} /> City:
                </label>
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...styles.formInputDisabled
                  }}
                  disabled
                />
                {activeTab === 'edit' && (
                  <div>
                    <button style={styles.mapButton} onClick={() => setShowMap(true)}>
                      Choose from Map
                    </button>
                  </div>
                )}
  
                {showMap && (
                <div style={styles.mapModal(showMap)}>
                    <button style={styles.closeBtn} onClick={() => setShowMap(false)}>Close</button>
                    <div id="leafletMap" style={styles.mapContainer}></div>
                </div>
                )}
              </div>
  
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Street:</label>
                  <input
                    type="text"
                    value={userData.street}
                    disabled
                    style={{
                      ...styles.formInput,
                      backgroundColor: '#edf0f2',
                      cursor: 'not-allowed',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <Select
                    options={streetOptions}
                    value={streetOptions.find(option => option.value === userData.street)}
                    onChange={selected => setUserData(prev => ({ ...prev, street: selected.value }))}
                    isDisabled={activeTab !== 'edit'}
                    placeholder="Select or search for a street"
                  />
                </div>
  
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>House Number:</label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={userData.houseNumber}
                    onChange={handleInputChange}
                    style={{
                      ...styles.formInput,
                      ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                    }}
                    disabled={activeTab !== 'edit'}
                  />
                </div>
              </div>
  
              {activeTab === 'edit' && (
                <div style={styles.formActions}>
                  <button style={styles.saveBtn} onClick={handleSave}>
                    Save Changes
                  </button>
                  <button 
                    style={styles.cancelBtn} 
                    onClick={() => {
                      setEditMode(false);
                      setActiveTab('general');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
  
          {activeTab === 'password' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Change Password</h2>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={styles.formInput}
                  placeholder="Enter current password"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={styles.formInput}
                  placeholder="Enter new password"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Confirm New Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={styles.formInput}
                  placeholder="Confirm new password"
                />
              </div>
              <button style={styles.saveBtn} onClick={handlePasswordUpdate}>
                Update Password
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;