import {useRef, useState, useEffect } from 'react';
import { FaUser, FaHome, FaInfoCircle, FaSignOutAlt, FaTools, FaStar, FaRegStar, FaSearch, FaListAlt } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
  callsContainer: {
    flex: '1 1 60%',
    minWidth: '300px',
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  callsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  callsTitle: {
    fontSize: '1.8rem',
    color: '#2c3e50',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '30px',
    padding: '0.6rem 1.2rem',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    '&:focusWithin': {
      borderColor: '#4fd1c5',
      boxShadow: '0 0 0 3px rgba(79, 209, 197, 0.2)',
    },
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    marginLeft: '0.5rem',
    width: '200px',
    fontSize: '1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  callCard: {
    padding: '1.8rem',
    marginBottom: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #4fd1c5',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    },
  },
  callType: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2b5876',
    marginBottom: '0.8rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  callDetail: {
    display: 'flex',
    marginBottom: '0.6rem',
    fontSize: '1.1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  detailLabel: {
    fontWeight: '600',
    minWidth: '120px',
    color: '#4a5568',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  button: {
    padding: '0.8rem 1.8rem',
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
  acceptButton: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    boxShadow: '0 2px 10px rgba(72, 187, 120, 0.3)',
    cursor: "pointer",
    padding: '0.5rem 0.8rem',
    fontSize:'0.8rem',
    color:'white',
  },
  acceptedButton: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    boxShadow: '0 2px 10px rgba(72, 187, 120, 0.3)',
    cursor: 'default',
    padding: '0.5rem 0.8rem',
    fontSize:'0.8rem',
    color:'white',
    '&:hover': {
      transform: 'none',
      boxShadow: '0 2px 10px rgba(72, 187, 120, 0.3)',
    },
  },
  inProgressButton: {
    background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
    boxShadow: '0 2px 10px rgba(246, 173, 85, 0.3)',
    cursor: 'default',
    padding: '0.4rem 0.6rem',
    fontSize:'0.8rem',
    color:'white',
    '&:hover': {
      transform: 'none',
      boxShadow: '0 2px 10px rgba(246, 173, 85, 0.3)',
    },
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
  tabsContainer: {
    display: 'flex',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  tab: {
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#718096',
    borderBottom: '2px solid transparent',
    marginRight: '0.5rem',
    transition: 'all 0.2s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  activeTab: {
    color: '#2b5876',
    borderBottom: '2px solid #4fd1c5',
  },
  completeButton: {
    padding: '0.6rem 1.5rem',
    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    marginLeft: '0.8rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(66, 153, 225, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(66, 153, 225, 0.4)',
    },
  },
  searchOptionsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '30px',
    padding: '0.6rem 1.2rem',
    border: '1px solid #e2e8f0',
  },
  searchSelect: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '1rem',
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
};

export default function WorkerMain() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('Description');
  const storedUser      = JSON.parse(localStorage.getItem('userData')) || {};
  const currentWorkerId = storedUser.id; 
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'accepted', or 'inProgress'
  const [inProgressCalls, setInProgressCalls] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [mapCoords, setMapCoords] = useState(null); // {lat, lng, address}
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [workerPosition, setWorkerPosition] = useState(null); // {lat, lng}
  const [initialMapCenter, setInitialMapCenter] = useState(null); // [lat, lng]
  const [initialMapZoom, setInitialMapZoom] = useState(16); // default zoom
  const userMarkerSvg = encodeURIComponent(`
    <svg width="40" height="54" viewBox="0 0 40 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#shadow)">
        <path d="M20 53C30.4934 42.0882 39 31.8124 39 23C39 11.9543 30.0457 3 19 3C7.9543 3 0 11.9543 0 23C0 31.8124 9.50659 42.0882 20 53Z" fill="#4fd1c5"/>
        <circle cx="19.5" cy="20.5" r="7.5" fill="white"/>
        <ellipse cx="19.5" cy="33.5" rx="12" ry="7.5" fill="white"/>
        <text x="14" y="25" font-size="10" fill="#4fd1c5" font-family="Arial" font-weight="bold">&#128100;</text>
      </g>
      <defs>
        <filter id="shadow" x="0" y="0" width="40" height="54" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
    </svg>
  `);

  const userIcon = L.icon({
    iconUrl: 'data:image/svg+xml;utf8,' + userMarkerSvg,
    iconSize: [40, 54],       // width, height
    iconAnchor: [20, 54],     // pointy bottom
    popupAnchor: [0, -54]     // popup opens above
  });

  const workerMarkerSvg = encodeURIComponent(`
  <svg width="40" height="54" viewBox="0 0 40 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#shadow)">
      <path d="M20 53C30.4934 42.0882 39 31.8124 39 23C39 11.9543 30.0457 3 19 3C7.9543 3 0 11.9543 0 23C0 31.8124 9.50659 42.0882 20 53Z" fill="#3182ce"/>
      <circle cx="19.5" cy="20.5" r="7.5" fill="white"/>
      <ellipse cx="19.5" cy="33.5" rx="12" ry="7.5" fill="white"/>
      <text x="14" y="25" font-size="13" fill="#3182ce" font-family="Arial" font-weight="bold">&#128736;</text>
    </g>
    <defs>
      <filter id="shadow" x="0" y="0" width="40" height="54" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
      </filter>
    </defs>
  </svg>
`);
const workerIcon = L.icon({
  iconUrl: 'data:image/svg+xml;utf8,' + workerMarkerSvg,
  iconSize: [40, 54],
  iconAnchor: [20, 54],
  popupAnchor: [0, -54]
});


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

const fetchInProgressCalls = async () => {
  const storedUser = JSON.parse(localStorage.getItem('userData'));
  if (!storedUser || !storedUser.accessToken) return;

  try {
    const response = await fetch('http://localhost:8000/api/events/getApprovedCalls', {
      headers: {
        'x-access-token': storedUser.accessToken
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch in-progress calls');
    }
    
    const data = await response.json();
    setInProgressCalls(data.filter(c => c.status !== 'completed'));
  } catch (error) {
    console.error('Error fetching in-progress calls:', error);
  }
};

  const handleAccept = async (call, e) => {
  e.stopPropagation();

  // 1- tell the server we applied
  await fetch(
    `http://localhost:8000/api/events/applicants/${call._id}`,
    {
      method : 'POST',
      headers: { 'x-access-token': storedUser?.accessToken }
    }
  );

  // 2- locally add *this* worker to applicants so the UI toggles
  setCalls(list =>
    list.map(c =>
      c.callID === call.callID
        ? { ...c,
            applicants: [...(c.applicants || []), currentWorkerId] }
        : c
    )
  );
  const stored = JSON.parse(localStorage.getItem('acceptedCallsFull')) || [];
  localStorage.setItem('acceptedCallsFull', JSON.stringify([...stored, call]));

};

  const handleCompleteCall = async (callId) => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser?.accessToken) return;

    try {
      const response = await fetch(`http://localhost:8000/api/events/completeCall/${callId}`, {
        method: 'POST',
        headers: { 'x-access-token': storedUser.accessToken }
      });

      if (!response.ok) {
        throw new Error('Failed to mark call as completed');
      }

      // Refresh the in-progress calls list
      fetchInProgressCalls();
      fetchCallsByType();
    } catch (error) {
      console.error('Error completing call:', error);
      alert('Failed to mark call as completed');
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
  const storedUser = JSON.parse(localStorage.getItem('userData'));
  if (storedUser && storedUser.name) {
    setUserName(storedUser.name);
  }
  
  fetchRatings();
  fetchCallsByType();
  fetchInProgressCalls(); // Add this line
}, []);

  const handleMenuSelect = (option) => {
    if (option === 'MainPage')   navigate('/WorkerMain');
    else if (option === 'MyWorks')   navigate('/WorkerJob');
    else if (option === 'Profile')    navigate('/ProfilePage');
    else if (option === 'Help')       navigate('/HelpPage');
    else if (option === 'MyRequests') navigate('/WorkerRequests');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
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
  
  const fetchCallsByType = async () => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || !storedUser.accessToken || !storedUser.workType) {
      alert("Unauthorized or missing work type. Please log in again.");
      return;
    }

    let type;
    if (storedUser.workType === 'Plumber') type = 'Plumbing';
    else if (storedUser.workType === 'Electrician') type = 'Electricity';
    else if (storedUser.workType === 'Painter') type = 'Painting';
    else if (storedUser.workType === 'Handy Man') type = 'Other';

    try {
      const response = await fetch(`http://localhost:8000/api/events/getEventsByType/${type}`, {
        method: "GET",
        headers: {
          "x-access-token": storedUser.accessToken
        }
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setCalls(result);
      } else {
        alert("❌ Failed to fetch calls: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error fetching calls:", err);
      alert("An unexpected error occurred while fetching the calls.");
    }
  };

  const filteredCalls = calls.filter(call => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    switch(searchOption) {
      case 'Call Type':
        return call.callType.toLowerCase().includes(searchTermLower);
      case 'Description':
        return call.description.toLowerCase().includes(searchTermLower);
      case 'Address':
        return `${call.city} ${call.street} ${call.houseNumber}`.toLowerCase().includes(searchTermLower);
      case 'Date':
        return new Date(call.date).toLocaleDateString().includes(searchTerm);
      default:
        return true;
    }
  });

  const myRequestedCalls = calls.filter(
    c => c.status?.toLowerCase() === 'open' &&          // only if still open
      Array.isArray(c.applicants) &&
      c.applicants.includes(currentWorkerId)
  );
  // show only OPEN calls that this worker has NOT already requested
  const availableCalls = filteredCalls.filter(c =>
    c.status?.toLowerCase() === 'open' &&          // not “in progress”, “completed”, …
    !(Array.isArray(c.applicants) &&
      c.applicants.includes(currentWorkerId))      // haven’t requested yet
  );

useEffect(() => {
  const refresh = () => fetchCallsByType();

  window.addEventListener('workerCallDone',     refresh);
  window.addEventListener('workerCallUnapplied', refresh);
   const doneListenerSameTab = (e) => {
   const { callID } = e.detail || {};
   if (callID) removeInProgressCall(callID);
 };
 window.addEventListener('workerCallDone', doneListenerSameTab);

 const storageListener = e => {
   if (
     e.key === 'workerLastDone'   ||   // when a job is marked “Done”
     e.key === 'workerLastUnapply'     // when a request is withdrawn
   ) {
       try {                   // keep the list in this tab fresh
       const { callID } = JSON.parse(e.newValue);
       if (callID) removeInProgressCall(callID);
     } catch {/* ignore */}
     refresh();
   }
  };
  window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener('workerCallDone', refresh);
      window.removeEventListener('workerCallUnapplied', refresh);
      window.removeEventListener('workerCallDone', doneListenerSameTab);
      window.removeEventListener('storage',        storageListener);
    };
  }, []);

  const handleShowOnMap = async (call) => {
  const address = getAddressForMap(call);
  const query = encodeURIComponent(address);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
  );
  const data = await res.json();
  if (data && data.length > 0) {
    const { lat, lon } = data[0];
    setMapCoords({
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      address,
      call,
    });

    setInitialMapCenter([parseFloat(lat), parseFloat(lon)]);
    setInitialMapZoom(16);

    // Get worker's current position (async)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setWorkerPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setWorkerPosition(null)
      );
    } else {
      setWorkerPosition(null);
    }

    setShowMap(true);
  } else {
    alert("Could not find this address on the map.");
  }
};

useEffect(() => {
  if (showMap && mapCoords && workerPosition) {
    // Style for the distance label tooltip
    if (!document.getElementById('distance-label-style')) {
      const style = document.createElement('style');
      style.id = 'distance-label-style';
      style.innerHTML = `
        .leaflet-tooltip.distance-label {
          font-size: 1rem;
          box-shadow: 0 2px 12px rgba(79,209,197,0.2);
          border: none;
          padding: 0 !important;
          background: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    setTimeout(() => {
      // Cleanup previous map if any
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }

      const defaultView = [31.0461, 34.8516];
      const hasCoords = mapCoords && mapCoords.lat && mapCoords.lng;
      const map = L.map('callAddressMap', { zoomControl: false }).setView(
        hasCoords ? [mapCoords.lat, mapCoords.lng] : defaultView,
        hasCoords ? 16 : 8
      );
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // 1. Customer marker
      let customerMarker = null;
      if (hasCoords && mapCoords.call) {
        const c = mapCoords.call;

        customerMarker = L.marker([mapCoords.lat, mapCoords.lng], { 
          draggable: false, 
          icon: userIcon 
        }).addTo(map);

        markerRef.current = customerMarker;

        const popupHtml = `
          <div style="min-width:220px; font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;">
            <b>🧑‍💼 Customer:</b> ${c.costumerdetails.join(', ')}<br/>
            <b>🏠 Address:</b> ${c.city}, ${c.street} ${c.houseNumber}<br/>
            <b>🛠️ Call Type:</b> ${c.callType}<br/>
            <b>📝 Description:</b> ${c.description || 'No details'}<br/>
            <b>📅 Date:</b> ${new Date(c.date).toLocaleDateString()}
          </div>
        `;

        customerMarker.bindPopup(popupHtml);
        customerMarker.on('click', function () {
          customerMarker.openPopup();
        });
      }

      // 1.5 Worker marker
      let workerMarker = null;
      if (workerPosition) {
        workerMarker = L.marker([workerPosition.lat, workerPosition.lng], {
          draggable: false,
          icon: workerIcon
        }).addTo(map);

        const popupHtml = `
          <div style="min-width:140px; font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;">
            <b>🛠️ You (Worker)</b><br/>
          </div>
        `;
        workerMarker.bindPopup(popupHtml);

      }

      if (workerPosition && mapCoords) {
        const latlngs = [
          [workerPosition.lat, workerPosition.lng],
          [mapCoords.lat, mapCoords.lng]
        ];
        L.polyline(latlngs, { color: '#2b5876', weight: 5, opacity: 0.7, dashArray: '8 8' }).addTo(map);

        // Calculate the distance (in meters)
        const distance = map.distance(
          L.latLng(workerPosition.lat, workerPosition.lng),
          L.latLng(mapCoords.lat, mapCoords.lng)
        );

        // Offset the label so it's not directly on top of the customer marker
        const labelOffset = 0.0005; // ~50m offset, adjust as needed
        const labelLat = mapCoords.lat + labelOffset;
        const labelLng = mapCoords.lng + labelOffset;

        const tooltipText = distance < 1000
          ? `${distance.toFixed(0)} m`
          : `${(distance/1000).toFixed(2)} km`;

        // Show label right beside the customer marker
        L.tooltip({
          permanent: true,
          direction: "right",
          className: "distance-label"
        })
        .setLatLng([labelLat, labelLng])
        .setContent(`<span style="background:white;padding:2px 8px;border-radius:6px;color:#2b5876;font-weight:700">${tooltipText} away</span>`)
        .addTo(map);
      }
    }, 0);
  }
}, [showMap, mapCoords, workerPosition]);


function getEnglishPart(str) {
  if (!str) return '';
  if (str.includes('|')) {
    // Right side is English... UNLESS it's identical to the left or contains only Hebrew chars!
    const [he, en] = str.split('|').map(s => s.trim());
    // If 'en' is identical to 'he', or if it does NOT contain A-Z, treat as "not available"
    if (!/[A-Za-z]/.test(en) || en === he) {
      return ''; // no english!
    }
    return en;
  }
  // fallback: check if string contains English letters at all
  if (/[A-Za-z]/.test(str)) return str;
  return '';
};

function getAddressForMap(call) {
  // Try English part first
  let city = getEnglishPart(call.city);
  // Fallback: if empty, use Hebrew part (left side of '|')
  if (!city) {
    city = call.city.includes('|')
      ? call.city.split('|')[0].trim()
      : call.city;
  }
  let address = `${city}`;
  if (!address.toLowerCase().includes('israel') && !address.includes('ישראל')) {
    address += ', Israel'; // Always add country in some language
  }
  console.log("Address sent to map (auto-fallback):", address);
  return address;
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
              ...(location.pathname === '/WorkerMain' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MainPage')}
          >
            <FaHome /> MainPage
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/WorkerJob' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MyWorks')}
          >
            <FaTools /> MyWorks
          </div>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/WorkerRequests' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MyRequests')}
          >
            <FaListAlt /> MyRequests
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

        {/* Right – Page title */}
        <div style={styles.rightTitle}>
          <FaHome />
          MainPage
        </div>
      </header>

      {/* ──────────────── MAIN ROW ──────────────── */}
      <div style={styles.mainContentRow}>
        {/* Calls section */}
        <div style={styles.callsContainer}>
          <div style={styles.callsHeader}>
            <h2 style={styles.callsTitle}>
              {activeTab === 'available' ? 'Available Calls' : 
               activeTab === 'accepted' ? 'Your Accepted Calls' : 
               'In Progress Calls'}
            </h2>
           
            <div style={styles.searchOptionsContainer}>
              <select 
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
                style={styles.searchSelect}
              >
                <option value="Description">Description</option>
                <option value="Address">Address</option>
                <option value="Date">Date</option>
              </select>
              <div style={styles.searchContainer}>
                <FaSearch />
                <input
                  type="text"
                  placeholder={`Search by ${searchOption}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabsContainer}>
            <div 
              style={{ ...styles.tab, ...(activeTab === 'available' ? styles.activeTab : {}) }}
              onClick={() => setActiveTab('available')}
            >
              Available Calls
            </div>
            <div
              style={{ ...styles.tab, ...(activeTab === 'accepted' ? styles.activeTab : {}) }}
              onClick={() => setActiveTab('accepted')}
            >
              Your Requested Calls ({myRequestedCalls.length})
            </div>
            <div 
              style={{ ...styles.tab, ...(activeTab === 'inProgress' ? styles.activeTab : {}) }}
              onClick={() => setActiveTab('inProgress')}
            >
              In Progress ({inProgressCalls.length})
            </div>
          </div>

          {activeTab === 'available' ? (
            availableCalls.length === 0 ? (
              <p>No calls available for your work type.</p>
            ) : (
              availableCalls.map((call) => (
                <div 
                  key={call.callID} 
                  style={styles.callCard}
                >
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Call Type:</span>
                    <span>{call.callType}</span>
                  </div>
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Description:</span>
                    <span>{call.description}</span>
                  </div>
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Customer:</span>
                    <span>{call.costumerdetails.join(', ')}</span>
                  </div>
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Address:</span>
                    <span>
                      {call.city}, {call.street} {call.houseNumber}
                      <button
                        style={{ marginLeft: 10, padding: '4px 12px', borderRadius: 20, border: "none", background: "#2b5876", color: "white", cursor: "pointer" }}
                        onClick={() => handleShowOnMap(call)}
                      >
                        Show on Map
                      </button>
                    </span>
                  </div>
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Date:</span>
                    <span>{new Date(call.date).toLocaleDateString()}</span>
                  </div>
                  {(() => {
                    const alreadyApplied =
                      Array.isArray(call.applicants) &&
                      call.applicants.includes(currentWorkerId);
                    return (
                      <button
                        style={alreadyApplied
                                  ? styles.acceptedButton
                                  : styles.acceptButton}
                        onClick={e => handleAccept(call, e)}
                        disabled={alreadyApplied}
                      >
                        <strong>{alreadyApplied ? 'Requested' : 'Accept Call'}</strong>
                      </button>
                    );
                  })()}
                </div>
              ))
            )
            ) : activeTab === 'accepted' ? (
              myRequestedCalls.length === 0 ? (
                <p>You haven't requested any calls yet.</p>
              ) : (
                myRequestedCalls.map(call => (
                  <div key={call.callID} style={styles.callCard}>
                    {/* same fields as before … */}
                    <div style={styles.callDetail}>
                      <span style={styles.detailLabel}>Call Type:</span>
                      <span>{call.callType}</span>
                    </div>
                    <div style={styles.callDetail}>
                      <span style={styles.detailLabel}>Description:</span>
                      <span>{call.description}</span>
                    </div>
                    <div style={styles.callDetail}>
                      <span style={styles.detailLabel}>Customer:</span>
                      <span>{call.costumerdetails.join(', ')}</span>
                    </div>
                    <div style={styles.callDetail}>
                      <span style={styles.detailLabel}>Address:</span>
                      <span>
                        {call.city}, {call.street} {call.houseNumber}
                      </span>
                    </div>
                    <div style={styles.callDetail}>
                      <span style={styles.detailLabel}>Date:</span>
                      <span>{new Date(call.date).toLocaleDateString()}</span>
                    </div>
                    {/* … other details … */}
                    <button style={styles.acceptedButton} disabled>
                      <strong>Requested</strong>
                    </button>
                  </div>
                ))
              )
            ) : (

            inProgressCalls.length === 0 ? (
              <p>No calls in progress.</p>
            ) : (
              inProgressCalls.map((call) => (
                <div 
                  key={call._id} 
                  style={styles.callCard}
                >
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Call Type:</span>
                    <span>{call.callType}</span>
                  </div>
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Description:</span>
                    <span>{call.description}</span>
                  </div>
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Customer:</span>
                    <span>{call.costumerdetails.join(', ')}</span>
                  </div>
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Address:</span>
                    <span>
                      {call.city}, {call.street} {call.houseNumber}
                    </span>
                  </div>
                  <div style={styles.callDetail}>
                    <span style={styles.detailLabel}>Date:</span>
                    <span>{new Date(call.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <button
                      style={styles.inProgressButton}
                      disabled
                    >
                      In Progress
                    </button>
                    <button
                      style={styles.completeButton}
                      onClick={() => handleCompleteCall(call._id)}
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Rating section */}
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
      {showMap && mapCoords && (
        <div style={styles.mapModal}>
          <button
            style={styles.closeBtn}
            onClick={() => setShowMap(false)}
          >
            ×
          </button>
          <button
            style={{
              position: 'absolute',
              top: 16,
              right: 56,
              zIndex: 1002,
              padding: '8px 14px',
              backgroundColor: '#4fd1c5',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(79,209,197,0.2)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title="Reset view to call address"
            onClick={() => {
              if (mapRef.current && initialMapCenter) {
                mapRef.current.setView(initialMapCenter, initialMapZoom || 16, { animate: true });
              }
            }}
          >
            ⬆️ Reset View
          </button>
          <div id="callAddressMap" style={styles.mapContainer}></div>
        </div>
      )}
    </div>
  );
}