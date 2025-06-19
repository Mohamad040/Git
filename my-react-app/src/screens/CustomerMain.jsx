import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaUser, FaHome, FaInfoCircle, FaSignOutAlt, FaTools, FaStar, FaRegStar, FaBolt, FaTint, FaPaintRoller, FaQuestion } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Select from 'react-select';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
    overflowY: 'auto',
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
    fontSize: '1.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  welcome: {
    fontSize: '2.2rem',
    marginBottom: '1.5rem',
    color: '#2c3e50',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  paragraph: {
    fontSize: '1.1rem',
    color: '#4a5568',
    marginBottom: '2rem',
    lineHeight: 1.7,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  mainContentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '2rem 5%',
    gap: '2rem',
    alignItems: 'stretch',
    width: '90%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  contentBox: {
    flex: '1 1 60%',
    minWidth: '300px',
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
  },
  ratingContainer: {
    flex: '1 1 35%',
    minWidth: '300px',
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  ratingTitle: {
    fontSize: '1.6rem',
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    gap: '0.5rem',
  },
  star: {
    cursor: 'pointer',
    fontSize: '2.2rem',
    color: '#e2e8f0',
    transition: 'all 0.2s ease',
  },
  activeStar: {
    color: '#f6ad55',
  },
  submitRatingBtn: {
    display: 'block',
    margin: '0 auto',
    padding: '0.8rem 2rem',
    background: 'linear-gradient(135deg, #4fd1c5 0%, #38b2ac 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(79, 209, 197, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(79, 209, 197, 0.4)',
    },
  },
  averageRating: {
    textAlign: 'center',
    margin: '1.5rem 0',
    fontSize: '1.2rem',
    color: '#4a5568',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  ratingList: {
    maxHeight: '300px',
    overflowY: 'auto',
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #edf2f7',
  },
  ratingItem: {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  ratingUser: {
    fontWeight: '600',
    color: '#2b6cb0',
  },
  ratingDate: {
    fontSize: '0.9rem',
    color: '#718096',
    marginTop: '0.3rem',
  },
  openCallButton: {
    padding: '14px 40px',
    fontSize: '1.2rem',
    background: 'linear-gradient(135deg, #4fd1c5 0%, #38b2ac 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(79, 209, 197, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(79, 209, 197, 0.4)',
    },
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    overflowY: 'auto',
  },
  modal: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    position: 'relative',
  },
  modalTitle: {
    marginBottom: '1.5rem',
    color: '#2c3e50',
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: '#4fd1c5',
      boxShadow: '0 0 0 3px rgba(79, 209, 197, 0.2)',
      outline: 'none',
    },
  },
  submitBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #4fd1c5 0%, #38b2ac 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(79, 209, 197, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(79, 209, 197, 0.4)',
    },
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.6rem',
    fontWeight: '600',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sectionTitle: {
    fontSize: '1.4rem',
    color: '#2c3e50',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e2e8f0',
    marginTop: '1.5rem',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  mapModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
  },
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
    },
  },
  mapContainer: {
    width: '90%',
    height: '80%',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  callTypesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    margin: '30px 0',
  },
  callTypeCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px 20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.23s cubic-bezier(.4,2,.7,1), box-shadow 0.22s',
    textAlign: 'center',
    border: '2px solid transparent',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    },
  },
  callTypeIcon: {
    fontSize: '2.8rem',
    marginBottom: '15px',
  },
  callTypeTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#2c3e50',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  callTypeSubtitle: {
    fontSize: '1rem',
    color: '#718096',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  callTypeElectricity: {
    background: 'linear-gradient(135deg, rgba(246, 173, 85, 0.1) 0%, rgba(251, 211, 141, 0.1) 100%)',
    borderColor: '#f6ad55',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(246, 173, 85, 0.15)',
    },
  },
  callTypePlumbing: {
    background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)',
    borderColor: '#4299e1',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(66, 153, 225, 0.15)',
    },
  },
  callTypePainting: {
    background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(252, 165, 165, 0.1) 100%)',
    borderColor: '#f56565',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(245, 101, 101, 0.15)',
    },
  },
  callTypeOther: {
    background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(134, 239, 172, 0.1) 100%)',
    borderColor: '#48bb78',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(72, 187, 120, 0.15)',
    },
  },

  addressButtonsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    margin: '20px 0',
  },
  mapBtn: {
    padding: '10px 16px',
    backgroundColor: '#edf2f7',
    color: '#2d3748',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:hover': {
      backgroundColor: '#e2e8f0',
    },
  },
};
export default function CustomerMain() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState('');
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({ callType: '', city: '', street: '', houseNumber: '', date:Date.now ,description: '' });
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [streets, setStreets] = useState([]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCallType, setHoveredCallType] = useState('');

  const [userData, setUserData] = useState({
    username: '',
    age: '',
    email: '',
    gender: '',
    userType: '',
    city: '',
    street: '',
    houseNumber: '',
    description: '',
    _id: ''
  });

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

        setUserData({
          username: data.name || '',
          age: data.age || '',
          email: data.email || '',
          gender: data.gender || '',
          userType: data.isAdmin ? 'Admin' : data.isWorker ? 'Worker' : 'Customer',
          city: data.city || '',
          street: data.street || '',
          houseNumber: data.houseNumber || '',
          description: data.description || '',
          _id: data._id || ''
        });

        if (data.name) {
          setUserName(data.name);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

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

  const handleDeleteRating = async (id) => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser?.accessToken) return;

    try {
      const res = await fetch(`http://localhost:8000/api/ratings/deleteRating/${id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': storedUser.accessToken }
      });
      if (!res.ok) throw new Error((await res.json()).message);

      const updated = ratings.filter((r) => r._id !== id);
      setRatings(updated);
      const avg = updated.reduce((s, r) => s + Number(r.rating), 0) / (updated.length || 1);
      setAverageRating(avg || 0);
      alert('Rating deleted ✅');
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

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

          await updateLocationFields(e.latlng.lat, e.latlng.lng);
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
                await updateLocationFields(pos.lat, pos.lng);
              });
            } else {
              markerRef.current.setLatLng(latlng);
            }

            await updateLocationFields(latlng.lat, latlng.lng);
          })
          .addTo(map);
      }, 0);
    }
  }, [showMap]);

  useEffect(() => {
    if (userData.city) {
      const cityOnly = userData.city.split('|')[0].split(',')[0].trim();
      fetchStreetsByCity(cityOnly).then(setStreets);
    }
  }, [userData.city]);

  const updateLocationFields = async (lat, lng) => {
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

      setFormData(prev => ({ ...prev, city: fullCity }));
      const streets = await fetchStreetsByCity(he.city);
      setStreets(streets);

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

  const handleMenuSelect = (option) => {
    if (option === 'MainPage') navigate('/CustomerMain');
    else if (option === 'MyCalls') navigate('/CustomerCalls');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Help') navigate('/HelpPage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  const handleOpenCall = async () => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || !storedUser.accessToken) {
      alert("Unauthorized. Please log in again.");
      return;
    }

    if (!selectedCallType || !formData.city || !formData.street || !formData.houseNumber || !formData.description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/events/addEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": storedUser.accessToken
        },
        body: JSON.stringify({
          callType: selectedCallType,
          city: formData.city,
          street: formData.street,
          houseNumber: formData.houseNumber,
          date:Date.now,
          description: formData.description,
          costumerdetails: [
            `Name: ${storedUser.name}`,
            `Age: ${storedUser.age}`,
            `Gender: ${storedUser.gender}`
          ],
          status: 'Open'
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Your call has been submitted successfully!");
        setShowModal(false);
        setFormData({ callType: '', city: '', street: '', houseNumber: '', description: '' });
        setSelectedCallType('');
      } else {
        alert("❌ Failed to submit call: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error submitting call:", err);
      alert("An unexpected error occurred while submitting the call.");
    }
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert("Please select at least one star.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || !storedUser.accessToken) {
      alert("No token found. Please log in.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/ratings/addRating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": storedUser.accessToken,
        },
        body: JSON.stringify({
          username: storedUser.name,
          usertype: storedUser.isWorker ? 'worker' : 'customer',
          rating: rating,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Thanks for your rating!");
        setRating(0);

        try {
          const refreshed = await fetch("http://localhost:8000/api/ratings/getAllRatings", {
            headers: {
              "x-access-token": storedUser.accessToken
            }
          }).then(res => res.json());

          setRatings(refreshed);
          const avg = refreshed.reduce((sum, r) => sum + Number(r.rating), 0) / refreshed.length;
          setAverageRating(avg || 0);
        } catch (fetchErr) {
          console.error("Error refreshing ratings:", fetchErr);
        }
      } else {
        alert("Failed to submit rating: " + result.message);
      }
    } catch (err) {
      alert("Error submitting rating");
      console.error(err);
    }
  };

  const cancelbtn = async () => {
    setShowModal(false);
    setFormData({ callType: '', city: '', street: '', houseNumber: '', description: '' });
    setSelectedCallType('');
  };

  const openCallModal = (callType) => {
    setSelectedCallType(callType);
    setShowModal(true);
    setFormData({
      callType: callType,
      city: userData.city,
      street: userData.street,
      houseNumber: userData.houseNumber,
      description: ''
    });
  };

  const handleUseCurrentLocation = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      if (!storedUser || !storedUser.accessToken) {
        alert("Not logged in");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const lat = coords.latitude;
          const lng = coords.longitude;

          const res = await fetch(
            "http://localhost:8000/api/events/getLocationDetails",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": storedUser.accessToken,
              },
              body: JSON.stringify({ lat, lng }),
            }
          );

          const data = await res.json();
          console.log("📍 posting coords", { lat, lng });

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch location");
          }

          setFormData((prev) => ({
            ...prev,
            city: data.city,
            street: data.street,
            houseNumber: data.houseNumber,
          }));

          if (!data.street) {
            alert(
              "Street not found automatically – please pick it from the list."
            );
          } else if (!data.houseNumber) {
            alert(
              `We found the street (“${data.street}”) but no house-number.\n` +
                "Please type the number manually."
            );
          }

          const streets = await fetchStreetsByCity(
            data.city.split(",")[0].trim()
          );
          setStreets(streets);
        },

        (error) => {
          console.error("❌ Error getting location from browser:", error);
          alert("Failed to get your location. Please allow location access.");
        },

        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10_000,
        }
      );
    } catch (err) {
      console.error("❌ Error using current location:", err);
      alert("Failed to load location: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* ──────────────── HEADER ──────────────── */}
      <header style={{ ...styles.header, justifyContent: 'space-between' }}>
        {/* Left – Logo */}
        <div style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
          House<span style={styles.logoHighlight}>Fix</span>
        </div>

        {/* Center – Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              ...styles.menuItem,
              ...(window.location.pathname === '/CustomerMain' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MainPage')}
          >
            <FaHome /> MainPage
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(window.location.pathname === '/CustomerCalls' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MyCalls')}
          >
            <FaTools /> MyCalls
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(window.location.pathname === '/ProfilePage' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Profile')}
          >
            <FaUser /> Profile
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(window.location.pathname === '/HelpPage' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Help')}
          >
            <FaInfoCircle /> Help
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(window.location.pathname === '/login' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Logout')}
          >
            <FaSignOutAlt /> Logout
          </div>
        </div>

        {/* Right – Page title */}
        <div style={styles.rightTitle}>
          <FaHome />
          MainPage
        </div>
      </header>

      {/* ──────────────── MAIN CONTENT ──────────────── */}
      <div style={styles.mainContentRow}>
        {/* Left Content Box */}
        <div style={styles.contentBox}>
          <h2 style={styles.welcome}>Welcome {userName}!</h2>
          <p style={styles.paragraph}>
            HouseFix helps you quickly find trusted professionals for your home repairs.
            Post a call and get offers from local workers all around the country in the fastest time.
          </p>
          
          <h3 style={{ color: '#4a6fa5', marginBottom: '20px' }}>Select Service Type:</h3>
          
              <div style={styles.callTypesContainer}>
                {/* Electricity Card */}
                <div
                  style={{
                    ...styles.callTypeCard,
                    ...styles.callTypeElectricity,
                    ...(selectedCallType === 'Electricity' && { borderColor: '#ffde59' }),
                    ...(hoveredCallType === 'Electricity' && {
                      transform: 'scale(1.08)',
                      boxShadow: '0 12px 36px rgba(255,222,89,0.15)',
                      zIndex: 2
                    })
                  }}
                  onClick={() => openCallModal('Electricity')}
                  onMouseEnter={() => setHoveredCallType('Electricity')}
                  onMouseLeave={() => setHoveredCallType('')}
                >
                  <FaBolt style={{ ...styles.callTypeIcon, color: '#ffde59' }} />
                  <div style={styles.callTypeTitle}>Electricity</div>
                  <div style={styles.callTypeSubtitle}>חשמל</div>
                </div>

                {/* Plumbing Card */}
                <div
                  style={{
                    ...styles.callTypeCard,
                    ...styles.callTypePlumbing,
                    ...(selectedCallType === 'Plumbing' && { borderColor: '#58baff' }),
                    ...(hoveredCallType === 'Plumbing' && {
                      transform: 'scale(1.08)',
                      boxShadow: '0 12px 36px rgba(88,186,255,0.15)',
                      zIndex: 2
                    })
                  }}
                  onClick={() => openCallModal('Plumbing')}
                  onMouseEnter={() => setHoveredCallType('Plumbing')}
                  onMouseLeave={() => setHoveredCallType('')}
                >
                  <FaTint style={{ ...styles.callTypeIcon, color: '#58baff' }} />
                  <div style={styles.callTypeTitle}>Plumbing</div>
                  <div style={styles.callTypeSubtitle}>מים</div>
                </div>

                {/* Painting Card */}
                <div
                  style={{
                    ...styles.callTypeCard,
                    ...styles.callTypePainting,
                    ...(selectedCallType === 'Painting' && { borderColor: '#ff5858' }),
                    ...(hoveredCallType === 'Painting' && {
                      transform: 'scale(1.08)',
                      boxShadow: '0 12px 36px rgba(255,88,88,0.15)',
                      zIndex: 2
                    })
                  }}
                  onClick={() => openCallModal('Painting')}
                  onMouseEnter={() => setHoveredCallType('Painting')}
                  onMouseLeave={() => setHoveredCallType('')}
                >
                  <FaPaintRoller style={{ ...styles.callTypeIcon, color: '#ff5858' }} />
                  <div style={styles.callTypeTitle}>Painting</div>
                  <div style={styles.callTypeSubtitle}>צבעות</div>
                </div>

                {/* Other Card */}
                <div
                  style={{
                    ...styles.callTypeCard,
                    ...styles.callTypeOther,
                    ...(selectedCallType === 'Other' && { borderColor: '#8ac926' }),
                    ...(hoveredCallType === 'Other' && {
                      transform: 'scale(1.08)',
                      boxShadow: '0 12px 36px rgba(138,201,38,0.15)',
                      zIndex: 2
                    })
                  }}
                  onClick={() => openCallModal('Other')}
                  onMouseEnter={() => setHoveredCallType('Other')}
                  onMouseLeave={() => setHoveredCallType('')}
                >
                  <FaQuestion style={{ ...styles.callTypeIcon, color: '#8ac926' }} />
                  <div style={styles.callTypeTitle}>Other</div>
                  <div style={styles.callTypeSubtitle}>תלייה והרכבה</div>
                </div>
              </div>

          <p style={styles.paragraph}>
            <br />If you want to see an explanation about the website <a href="#" onClick={() => navigate('/HelpPage')}>Click Here</a>
          </p>
        </div>

        {/* Right Rating Box */}
        <div style={styles.ratingContainer}>
          <h3 style={styles.ratingTitle}>Rate Your Experience</h3>

          {/* Stars picker */}
          <div style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) =>
              star <= rating ? (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ ...styles.star, ...styles.activeStar }}
                />
              ) : (
                <FaRegStar
                  key={star}
                  onClick={() => setRating(star)}
                  style={styles.star}
                />
              )
            )}
          </div>

          <button style={styles.submitRatingBtn} onClick={handleRatingSubmit}>
            Submit Rating
          </button>

          {ratings.length > 0 && (
            <>
              {/* Average */}
              <div style={styles.averageRating}>
                Overall Rating: {averageRating.toFixed(1)} / 5 ★
              </div>

              {/* List */}
              <div style={styles.ratingList}>
                <h4>Recent Ratings</h4>
                {ratings.map((entry) => {
                  const date = new Date(entry.date).toLocaleDateString('en-GB');
                  const user = JSON.parse(localStorage.getItem('userData'));
                  const isOwner =
                    user?.name?.toLowerCase() ===
                    entry.username?.toLowerCase();

                  return (
                    <div key={entry._id} style={styles.ratingItem}>
                      <div style={styles.ratingUser}>
                        {entry.username} ({entry.usertype}) –{' '}
                        {'★'.repeat(entry.rating)}
                      </div>

                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span style={styles.ratingDate}>{date}</span>

                        {isOwner && (
                          <button
                            onClick={() => handleDeleteRating(entry._id)}
                            style={{
                              background: '#dc3545',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 4,
                              padding: '4px 8px',
                              fontSize: 12,
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
       {showMap && (
        <div style={styles.mapModal}>
          <button style={styles.closeBtn} onClick={() => setShowMap(false)}>
            ×
          </button>
          <div id="leafletMap" style={styles.mapContainer} />
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* Close button */}
            <button
              onClick={cancelbtn}
              style={{
                position: 'absolute',
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

            <h2 style={styles.modalTitle}>New {selectedCallType} Call</h2>

            {/* Description */}
            <label style={styles.formLabel}>Description</label>
            <textarea
              style={{ ...styles.input, height: '60px', resize: 'vertical' }}
              placeholder="Describe your issue…"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

            {/* Address Section */}
            <h3 style={styles.sectionTitle}>Address Information</h3>

            <div style={styles.addressButtonsContainer}>
              {/* Signup-address button */}
              <button
                style={styles.mapBtn}
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    city: userData.city,
                    street: userData.street,
                    houseNumber: userData.houseNumber
                  }))
                }
              >
                Select your SignUp Address
              </button>

              {/* Current-location button */}
              <button style={styles.mapBtn} onClick={handleUseCurrentLocation}>
                Use Current Location
              </button>

              {/* Open-map button */}
              <label style={styles.formLabel}>OR select city from the map :</label>
              <button style={styles.mapBtn} onClick={() => setShowMap(true)}>
                Open Map
              </button>
            </div>

            {/* City / Street / House fields */}
            <label style={styles.formLabel}>City</label>
            <input style={styles.input} readOnly value={formData.city} />

            <label style={styles.formLabel}>Street</label>
            <Select
              options={streets.map(s => ({ label: s, value: s }))}
              value={streets.map(s => ({ label: s, value: s })).find(o => o.value === formData.street)}
              onChange={opt => setFormData({ ...formData, street: opt.value })}
              placeholder="Select your street"
            />

            <label style={styles.formLabel}>House Number</label>
            <input
              style={styles.input}
              type="number"
              placeholder="e.g. 123"
              value={formData.houseNumber}
              onChange={e => setFormData({ ...formData, houseNumber: e.target.value })}
            />

            {/* Cancel / Submit */}
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
              <button onClick={handleOpenCall} style={styles.submitBtn}>
                Submit Call
              </button>
            </div>
          </div>
        </div>
      )}     
    </div>
  );
}