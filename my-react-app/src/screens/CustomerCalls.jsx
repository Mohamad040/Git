import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaRegStar ,FaStarHalfAlt } from 'react-icons/fa';
import { FaHome, FaTools, FaUser, FaInfoCircle, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import Modal from 'react-modal';
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

Modal.setAppElement('#root'); // or whatever your root element is

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
  mainContent: {
    flex: 1,
    padding: '2rem 5%',
    width: '90%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  callsContainer: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  },
callCard: {
  backgroundColor: 'white',
  borderRadius: '18px',
  padding: '2rem',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  transform: 'scale(1)',
  transformOrigin: 'top center', // 
  '&:hover': {
    transform: 'scale(1.07)', // <-- تكبير واضح أكثر
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.15)',
    zIndex: 10,
  }
},
  callHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.8rem',
    borderBottom: '1px solid #edf2f7'
  },
  callType: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2b5876',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  callDate: {
    color: '#718096',
    fontSize: '0.9rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  callDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  callDetail: {
    marginBottom: '0.8rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  detailLabel: {
    fontWeight: '600',
    color: '#4a5568',
    marginRight: '0.8rem',
    minWidth: '90px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  detailValue: {
    flex: 1,
    color: '#2d3748',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  deleteBtnContainer: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap',
    marginTop: 'auto',
    paddingTop: '1rem',
  },
  deleteBtn: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '0.6rem 1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:hover': {
      backgroundColor: '#c53030',
      transform: 'translateY(-2px)'
    }
  },
  statusBadge: {
    display: 'inline-block',
    padding: '0.4rem 0.8rem',
    borderRadius: '30px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  viewBtn: {
    backgroundColor: '#2b6cb0',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:hover': {
      backgroundColor: '#2c5282',
      transform: 'translateY(-2px)'
    }
  },
  viewBtn1: {
    backgroundColor: '#2b6cb0',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '0.2rem 0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.7rem',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    '&:hover': {
      backgroundColor: '#2c5282',
      transform: 'translateY(-2px)'
    }
  },
  noCallsMessage: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#2b5876',
    fontWeight: '600',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  labelStyle: {
    display: 'block',
    marginBottom: '0.6rem',
    color: '#2b5876',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  inputStyle: {
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
    padding: '2rem'
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    padding: '2.5rem',
    position: 'relative',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
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
    }
  },
  workerRateBtn: {
  backgroundColor: '#FFA500',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  padding: '0.4rem 0.8rem',
  fontSize: '0.99rem',
  fontWeight: '600',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  cursor: 'pointer',
  width: 'fit-content',
  alignSelf: 'flex-start',
  marginTop: '10px',
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
    zIndex: 999999,
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
    zIndex: 1000001
  },
  mapContainer: {
    width: '90%',
    height: '80%',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    borderRadius: '16px',
    overflow: 'hidden',
    zIndex: 1000000
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
    }
  },
  cardStyle: {
    padding: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: 'white'
  }
};

export default function CustomerCalls() {
  const navigate = useNavigate()

  // ① Data & loading state
  const [calls,   setCalls]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('');
  const [showMap, setShowMap] = useState(false);
  const [streets, setStreets] = useState([]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [searchType,  setSearchType]  = useState('callType')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCallId, setEditingCallId] = useState(null);
  const [modalOpen, setModalOpen]         = useState(false)
  const [currentCallId, setCurrentCallId] = useState(null)
  const [applicants, setApplicants]       = useState([]);
  const [approvedWorkers,  setApprovedWorkers]  = useState([]);
  const token = JSON.parse(localStorage.getItem('userData'))?.accessToken
  const [editOpen,  setEditOpen]  = useState(false);
  const [formData,  setFormData]  = useState({_id:'', callType:'', city:'', street:'', houseNumber:'', description:''});
  const [rateOpen,  setRateOpen]  = useState(false);
  const [rateCall,  setRateCall]  = useState(null);   // the call we’re rating
  const [stars,     setStars]     = useState(0);      // 1‒5
  const [feedback,  setFeedback]  = useState('');     // free-text
  const [workerRatings, setWorkerRatings] = useState({}); 
  const [hoveredCallId, setHoveredCallId] = useState(null);
  const [showWorkerMap, setShowWorkerMap] = useState(false);
  const [workerMapCoords, setWorkerMapCoords] = useState(null); // { worker, customer, workerProfile, call }
  const [mapCoords, setMapCoords] = useState(null); // {lat, lng, address}
  const [workerPosition, setWorkerPosition] = useState(null); // {lat, lng}
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
  const workerMapDivRef = useRef(null);
  const leafletMapDivRef = useRef(null);
  const [workerMapCenter, setWorkerMapCenter] = useState(null);

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
const [initialMapCenter, setInitialMapCenter] = useState(null);
const [initialMapZoom, setInitialMapZoom] = useState(16);

  function openRate(call) {
  setRateCall(call);
  setStars(0);
  setFeedback('');
  setRateOpen(true);
}
  const streetOptions = React.useMemo(
    () => Array.from(new Set(calls.map(c => c.street).filter(Boolean))),
    [calls]
    
  );
  const setCallCompleted = (callID) => {
  setCalls(list =>
    list.map(c =>
      c._id === callID ? { ...c, status: 'completed' } : c
    )
  );

  // open the rating popup (once per call)
  const completed = calls.find(c => c._id === callID);
  if (completed) {
    setRateCall(completed);
    setStars(0);
    setFeedback('');
    setRateOpen(true);
  }
};

  /* open the modal with current values */
  const openEdit = (call) => {
    setFormData({ ...call });          // pre-fill the form
    setEditingCallId(call._id);        // save the id
    setEditOpen(true);                 // show the modal
  };
  // ④ Filtered list (runs on every render)
  const filteredCalls = calls.filter(call => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true

    switch (searchType) {
      case 'callType':
        return call.callType.toLowerCase().includes(q)
      case 'description':
        return call.description?.toLowerCase().includes(q)
      case 'address': {
        const addr = `${call.street} ${call.houseNumber} ${call.city}`.toLowerCase()
        return addr.includes(q)
      }
      case 'date': {
        const dateStr = new Date(call.date)
          .toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})
          .toLowerCase()
        return dateStr.includes(q)
      }
      default:
        return true
    }
  })

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
          const myId  = storedUser.id        || storedUser._id;
          const token = storedUser.accessToken;

  
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
  
         
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }, [navigate]);

  useEffect(() => {
    const fetchCalls = async () => {
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      if (!storedUser?.accessToken) return navigate('/login');

      try {
        const res = await fetch('http://localhost:8000/api/events/getEvents', {
          method: 'GET',
          headers: { 'x-access-token': storedUser.accessToken }
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to load calls');
        }

        const data = await res.json();
        setCalls(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [navigate]);

  const fetchCalls = async () => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser?.accessToken) return navigate('/login');

    try {
      const res = await fetch('http://localhost:8000/api/events/getEvents', {
        method: 'GET',
        headers: { 'x-access-token': storedUser.accessToken }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to load calls');
      }

      const data = await res.json();
      setCalls(data);

    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
     const mine = data.filter(ev => ev.customerId === myId);   // or ev.owner === myId
       setCalls(mine); 
  };
  

  const handleEditCall = async (callID, updatedData) => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || !storedUser.accessToken) {
      alert("Unauthorized. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/api/events/update/${callID}`, {
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
        fetchCalls();
        setEditOpen(false);
      } else {
        alert("❌ Failed to update call: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error updating call:", err);
      alert("An unexpected error occurred while updating the call.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this call?')) return;
    
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser?.accessToken) return;

    try {
      const res = await fetch(`http://localhost:8000/api/events/deleteEvent/${id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': storedUser.accessToken }
      });

      if (!res.ok) throw new Error('Failed to delete call');

      setCalls(prev => prev.filter(call => call._id !== id));
    } catch (e) {
      console.error(e);
      alert('Error deleting call: ' + e.message);
    }
  };
const openModal = async (callId) => {
  // ─── auth token ──────────────────────────────────────────────────────
  const { accessToken } = JSON.parse(localStorage.getItem('userData')) || {};
  if (!accessToken) { alert('Please log-in again'); return; }

  try {
    // ─── 1) base request: who applied / was approved ───────────────────
    const res = await fetch(
      `http://localhost:8000/api/events/applicants/${callId}`,
      { headers: { 'x-access-token': accessToken } }
    );
    const { applicants = [], approvedWorkers = [] } = await res.json();

    // ─── 2) add profile details that are NOT returned by that route ────
    const enrich = async (w) => {
      // already has the fields? skip extra request
      if (w.city || w.gender || w.description) return w;

      try {
        const uRes = await fetch(
          `http://localhost:8000/api/users/${w._id}`,
          { headers: { 'x-access-token': accessToken } }
        );
        if (!uRes.ok) return w;               // ignore 4xx/5xx
        const profile = await uRes.json();     // { city, street, … }
        return { ...w, ...profile };          // merge & return
      } catch {
        return w;                             // ignore network error
      }
    };

    const fullApproved   = await Promise.all(approvedWorkers.map(enrich));
    const fullApplicants = await Promise.all(applicants.map(enrich));

    setApprovedWorkers(fullApproved);
    setApplicants(fullApplicants);
    setCurrentCallId(callId);

    // ─── 3) pull ratings for every worker we now have ──────────────────
    const allWorkers = [...fullApproved, ...fullApplicants];
    const ratingsObj = {};

    await Promise.all(
      allWorkers.map(async (w) => {
        try {
          const [avgRes, listRes] = await Promise.all([
            fetch(`http://localhost:8000/api/workRates/avg/${w._id}`,
                  { headers: { 'x-access-token': accessToken } }),
            fetch(`http://localhost:8000/api/workRates/${w._id}`,
                  { headers: { 'x-access-token': accessToken } })
          ]);

          const { average = 0, count = 0 } = await avgRes.json();
          const list = await listRes.json();       // detailed feedbacks

          ratingsObj[w._id] = { avg: average, count, list };
        } catch {/* ignore errors for this one worker */}
      })
    );

    setWorkerRatings(ratingsObj);
    setModalOpen(true);           // finally open the dialog
  } catch (err) {
    console.error('Failed to load applicants:', err);
    alert('Failed to load applicants');
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return { background: '#d4edda', color: '#155724' };
      case 'in progress': return { background: '#fff3cd', color: '#856404' };
      case 'completed': return { background: '#d1ecf1', color: '#0c5460' };
      case 'cancelled': return { background: '#f8d7da', color: '#721c24' };
      default: return { background: '#e2e3e5', color: '#383d41' };
    }
  };


  const cancelbtn = async () => {
    setEditOpen(false);
    setShowMap(false);
  };

useEffect(() => {
  if (showMap) {
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }

      // 🟢 Use the ref, not the string id!
      if (!leafletMapDivRef.current) return;

      const map = L.map(leafletMapDivRef.current, { zoomControl: false }).setView([31.0461, 34.8516], 8);
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

    useEffect(() => {
      if (!formData.city) return;

      const cityOnly = formData.city.split('|')[0].split(',')[0].trim();
      fetchStreetsByCity(cityOnly).then(setStreets);
    }, [formData.city]);

  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
  /* Fired in the *same* tab -------------------------------------------- */
  const doneListener = (e) => {
    const { callID } = e.detail || {};
    if (callID) setCallCompleted(callID);
    const justCompleted = calls.find(c => c._id === callID);
     if (justCompleted) openRate(justCompleted);
  };
  window.addEventListener('workerCallDone', doneListener);

  /* Fired in *other* tabs (storage event works cross-tab) --------------- */
  const storageListener = (e) => {
    if (e.key !== 'workerLastDone') return;
    try {
      const { callID } = JSON.parse(e.newValue);
      if (callID) setCallCompleted(callID);
      const justCompleted = calls.find(c => c._id === callID);
       if (justCompleted) openRate(justCompleted);
    } catch {/* ignore */}
  };
  window.addEventListener('storage', storageListener);

  /* cleanup ------------------------------------------------------------- */
  return () => {
    window.removeEventListener('workerCallDone', doneListener);
    window.removeEventListener('storage',        storageListener);
  };
}, []);

const submitRating = async () => {
  if (stars === 0) { alert('Pick at least one star 🙂'); return; }

  const { accessToken, name } = JSON.parse(localStorage.getItem('userData')) || {};
  if (!accessToken) { alert('Please log-in again'); return; }

  const workerId =
       rateCall.assignedWorker          // ← the name you expect
    || rateCall.workerId                // ← fallback #1
    || rateCall.approvedWorker          // ← fallback #2
    || rateCall.approvedWorkers?.[0]?._id; // ← array version

    if (!workerId) {
      alert('No worker assigned to this call – cannot save rating');
      return;
    }

  try {
    const res = await fetch('http://localhost:8000/api/workRates', {
      method : 'POST',
      headers: { 'Content-Type':'application/json', 'x-access-token': accessToken },
      body   : JSON.stringify({
        callId       : rateCall._id,
        workerId,
        rate         : Number(stars),
        feedback,
        customerName : name
      })
    });


    if (!res.ok) throw new Error((await res.json()).message);

    /* close modal & mark call as rated */
    setRateOpen(false);
    setCalls(list => list.map(c =>
      c._id === rateCall._id ? { ...c, rated: true } : c
    ));
    alert('Thanks for the feedback!');
  } catch (err) {
    alert(err.message || 'Could not save rating');
  }
};

/* helper – returns an array of five JSX stars */
function renderStars(avg) {
  const full  = Math.floor(avg);              // 4  for 4.55 → ★★★★
  const frac  = avg - full;                   // 0.55
  const half  = frac >= 0.25 && frac < 0.75;  // true  →   ½
  const empty = 5 - full - (half ? 1 : 0);    // 0 left

  const stars = [
    ...Array(full).fill('full'),
    ...(half ? ['half'] : []),
    ...Array(empty).fill('empty'),
  ];

  return stars.map((t, i) =>
    t === 'full' ? (
      <FaStar key={i} color="#ffc107" />          // gold
    ) : t === 'half' ? (
      <FaStarHalfAlt key={i} color="#ffc107" />   // half-gold
    ) : (
      <FaRegStar key={i} color="#ccc" />          // grey outline
    )
  );
};

const handleShowWorkerMap = async (worker, call) => {
  // Just use city for the worker
  const city = getEnglishPart(worker.city) || '';
  const address = city ? `${city}` : 'Israel';
  if (!city || city.toLowerCase() === 'israel' || city.trim() === '') {
    alert('Your city/address is missing or invalid. Please edit your call address.');
    return;
  }
  console.log("Looking up worker address:", address);

  // Customer location
  const customerAddress = getEnglishPart(call.city);
  const customerQuery = encodeURIComponent(customerAddress);
  console.log("Looking up customer address:", customerAddress);

  const customerLocRes = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${customerQuery}&limit=1`
  );
  const customerLocData = await customerLocRes.json();

  let customerLat = null, customerLng = null;
  if (customerLocData && customerLocData.length > 0) {
    customerLat = parseFloat(customerLocData[0].lat);
    customerLng = parseFloat(customerLocData[0].lon);
  } else {
    alert("Could not find your address on the map.");
    return;
  }

  // Worker location (city only)
  const workerQuery = encodeURIComponent(address);
  const workerLocRes = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${workerQuery}&limit=1`
  );
  const workerLocData = await workerLocRes.json();

  let workerLat = null, workerLng = null;
  if (workerLocData && workerLocData.length > 0) {
    workerLat = parseFloat(workerLocData[0].lat);
    workerLng = parseFloat(workerLocData[0].lon);
    setWorkerMapCenter([workerLat, workerLng]);
    setInitialMapCenter([workerLat, workerLng]);
    setInitialMapZoom(16);
  } else {
    // If worker location not found, center on customer
    setWorkerMapCenter(null);
    setInitialMapCenter([customerLat, customerLng]);
    setInitialMapZoom(16);
  }

  setMapCoords({
    workerLat,
    workerLng,
    worker,
    customerLat,
    customerLng,
    customer: call
  });
  setShowWorkerMap(true);
};

useEffect(() => {
  if (showWorkerMap && mapCoords) {
    setTimeout(() => {
      if (!workerMapDivRef.current) return;

      // Cleanup previous map
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }

      const defaultView = [31.0461, 34.8516];
      let center = initialMapCenter || defaultView;
      let zoom = initialMapZoom || 16;

      if (mapCoords.workerLat && mapCoords.workerLng) {
        center = [mapCoords.workerLat, mapCoords.workerLng];
      } else if (mapCoords.customerLat && mapCoords.customerLng) {
        center = [mapCoords.customerLat, mapCoords.customerLng];
      }

      const map = L.map(workerMapDivRef.current, { zoomControl: false }).setView(center, zoom);
      mapRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Worker marker (tool icon, blue)
      if (mapCoords.workerLat && mapCoords.workerLng) {
        const workerMarker = L.marker([mapCoords.workerLat, mapCoords.workerLng], {
          draggable: false,
          icon: workerIcon,
        }).addTo(map);

        const workerFullAddress =
          (mapCoords.worker.street
            ? `${mapCoords.worker.street} ${mapCoords.worker.houseNumber || ""}, `
            : "") +
          (mapCoords.worker.city || "");

        workerMarker.bindPopup(`
          <div style="min-width:220px;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;">
            <b>🧑‍🔧 Worker:</b> ${mapCoords.worker.name}<br/>
            <b>🛠️ Type:</b> ${mapCoords.worker.workType}<br/>
            ${mapCoords.worker.email ? `<b>✉️ Contact:</b> ${mapCoords.worker.email}<br/>` : ""}
            ${mapCoords.worker.gender ? `<b>🚻 Gender:</b> ${mapCoords.worker.gender}<br/>` : ""}
            ${mapCoords.worker.age ? `<b>🎂 Age:</b> ${mapCoords.worker.age}<br/>` : ""}
            ${workerFullAddress ? `<b>📍 Address:</b> ${workerFullAddress}<br/>` : ""}
            ${mapCoords.worker.description ? `<b>📝 Description:</b> ${mapCoords.worker.description}<br/>` : ""}
          </div>
        `);

        workerMarker.on('click', function () {
          workerMarker.openPopup();
        });
      }

      // Customer marker (user icon)
      if (mapCoords.customerLat && mapCoords.customerLng) {
        const customerMarker = L.marker([mapCoords.customerLat, mapCoords.customerLng], {
          draggable: false,
          icon: userIcon,
        }).addTo(map);

        customerMarker.bindPopup(`
          <div style="min-width:220px;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;">
            <b>👤 Your Call</b><br/>
            <b>📍 Address:</b> ${mapCoords.customer.city}, ${mapCoords.customer.street} ${mapCoords.customer.houseNumber}<br/>
          </div>
        `);
        customerMarker.on('click', function () {
          customerMarker.openPopup();
        });
      }

      // Polyline & distance (optional, only if both exist)
      if (mapCoords.workerLat && mapCoords.workerLng && mapCoords.customerLat && mapCoords.customerLng) {
        const latlngs = [
          [mapCoords.workerLat, mapCoords.workerLng],
          [mapCoords.customerLat, mapCoords.customerLng]
        ];
        L.polyline(latlngs, { color: '#2b5876', weight: 5, opacity: 0.7, dashArray: '8 8' }).addTo(map);

        const distance = map.distance(
          L.latLng(mapCoords.workerLat, mapCoords.workerLng),
          L.latLng(mapCoords.customerLat, mapCoords.customerLng)
        );
        const labelOffset = 0.0005;
        const labelLat = mapCoords.workerLat + labelOffset;
        const labelLng = mapCoords.workerLng + labelOffset;
        const tooltipText = distance < 1000
          ? `${distance.toFixed(0)} m`
          : `${(distance / 1000).toFixed(2)} km`;

        L.tooltip({
          permanent: true,
          direction: "right",
          className: "distance-label"
        })
        .setLatLng([labelLat, labelLng])
        .setContent(`<span style="background:white;padding:2px 8px;border-radius:6px;color:#2b5876;font-weight:700">${tooltipText} away</span>`)
        .addTo(map);
      }

      // Style for the label
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

    }, 10);
    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }
}, [showWorkerMap, mapCoords, initialMapCenter, initialMapZoom]);


function getEnglishPart(str) {
  if (!str) return '';
  // Prefer text after "|", fallback to whole string
  if (str.includes('|')) {
    const parts = str.split('|');
    return parts[1].trim() || parts[0].trim();
  }
  // If no pipe, try to extract only English chars
  const match = str.match(/[A-Za-z0-9 ,'-]+/g);
  return match ? match.join(' ').trim() : str.trim();
};


  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={{ ...styles.header, justifyContent: 'space-between' }}>
        {/* Left - Logo */}
        <div style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
          House<span style={styles.logoHighlight}>Fix</span>
        </div>

        {/* Center - Menu */}
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
        

        {/* Right - Page title */}
        <div style={styles.rightTitle}>
          <FaTools />
          My Calls
        </div>
      </header>
<Modal
  isOpen={modalOpen}
  onRequestClose={() => setModalOpen(false)}
  contentLabel="Applicants"
  style={{
    content: {
      maxWidth   : '600px',
      maxHeight:'500px',
      margin     : 'auto',
      borderRadius: 8,
      padding    : 20,
      overflow:'auto'
    }
  }}
>
  <h2 style={{ marginBottom: 16, color: '#4a6fa5' }}>Applicants</h2>

  {/* ─── Approved workers ───────────────────────────── */}
  {approvedWorkers.length > 0 && (
    <>
      <h3 style={{ color: '#28a745' }}>✅ Approved Workers</h3>
      {approvedWorkers.map(w => {
        const r = workerRatings[w._id] || { avg: 0, count: 0, list: [] };
        const fullAddress = w.street
          ? `${w.street} ${w.houseNumber || ''}, ${w.city}`
          : w.city || ''; 
        return (
          <div key={w._id} style={styles.cardStyle}>
            <strong>{w.name}</strong> — {w.workType}<br />
            {w.email || w.phone}<br />

            {/* NEW lines ---------------------------------------------------- */}
            {fullAddress && <span>{fullAddress}<br /></span>}
            {w.gender && <span>Gender: {w.gender}<br /></span>}
            {w.description && (
                <em style={{ display:'block', marginTop:2 }}><span><strong>Description:</strong> {w.description}<br /></span></em>
            )}
            {/* ------------------------------------------------------------- */}

            {/* average stars (unchanged) */}
            <div style={{ marginTop: 6 }}>
              {renderStars(r.avg)}
              <span style={{ marginLeft: 6, fontSize: 12 }}>
                {r.avg.toFixed(1)} ({r.count})
              </span>
            </div>

            {/* feedbacks (unchanged) */}
            {r.list.length > 0 && (
              <details style={{ marginTop: 6 }}>
                <summary style={{ cursor:'pointer', fontSize: 13 }}>
                  {r.list.length} feedback{r.list.length > 1 ? 's' : ''}
                </summary>
                <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                  {r.list.map(f => (
                    <li key={f._id} style={{ marginBottom: 4 }}>
                      <strong>{f.customerName}</strong>: {f.feedback}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        );
      })}

    </>
  )}

  {/* ─── Pending applicants ────────────────────────── */}
  <h3 style={{ marginTop: 16, color: '#4a6fa5' }}>🕒 Pending Applications</h3>
  
  {applicants.length === 0 ? (
    <p>No pending applications</p>
  ) : (
    applicants.map(w => {
      const r = workerRatings[w._id] || { avg: 0, count: 0, list: [] };
      const fullAddress = w.street
        ? `${w.street} ${w.houseNumber || ''}, ${w.city}`
        : w.city || '';
      return(
        <div
          key={w._id}
          style={{
            padding      : 8,
            border       : '1px solid #ddd',
            borderRadius : 4,
            marginBottom : 8
          }}
        >
          <strong>{w.name}</strong> — {w.workType}
          <br />
          {w.email || w.phone}<br/>
          {/* NEW lines ---------------------------------------------------- */}
          {fullAddress && <span>{fullAddress} <button
              style={{ ...styles.viewBtn1, marginLeft: 10 }}
              onClick={() => handleShowWorkerMap(w, calls.find(c => c._id === currentCallId))}
            >
              Show on Map
            </button><br /></span>}
          {w.gender && <span>Gender: {w.gender}<br /></span>}
          {w.description && (
              <em style={{ display:'block', marginTop:2 }}><span><strong>Description:</strong> {w.description}<br /></span></em>
          )}
          {/* ------------------------------------------------------------- */}

          {/* average stars (unchanged) */}
          <div style={{ marginTop: 6 }}>
            {renderStars(r.avg)}
            <span style={{ marginLeft: 6, fontSize: 12 }}>
              {r.avg.toFixed(1)} ({r.count})
            </span>
          </div>

          {/* feedbacks (unchanged) */}
          {r.list.length > 0 && (
            <details style={{ marginTop: 6 }}>
              <summary style={{ cursor:'pointer', fontSize: 13 }}>
                {r.list.length} feedback{r.list.length > 1 ? 's' : ''}
              </summary>
              <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                {r.list.map(f => (
                  <li key={f._id} style={{ marginBottom: 4 }}>
                    <strong>{f.customerName}</strong>: {f.feedback}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* approve-button appears only while nobody was approved yet */}
          {approvedWorkers.length === 0 && (
            <button
              style={{
                marginTop : 8,
                padding   : '4px 8px',
                background: '#4a6fa5',
                color     : '#fff',
                border    : 'none',
                cursor:'pointer',
                borderRadius: 4
              }}
              onClick={async () => {
                if (!token) {
                  alert('You must be logged in to approve'); return;
                }
                try {
                  const response = await fetch(
                    `http://localhost:8000/api/events/approve/${currentCallId}/${w._id}`,
                    { method: 'POST', headers: { 'x-access-token': token } }
                  );
                  if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || 'Approve failed');
                  }
                  // refresh lists inside the modal
                  await openModal(currentCallId);
                  alert('Worker approved successfully!');
                } catch (e) {
                  console.error(e);
                  alert('Could not approve: ' + e.message);
                }
              }}
            >
              Approve
            </button>
          )}
        </div>
      );
    })
  )}

  <button
    style={{
      marginTop : 20,
      padding   : '6px 12px',
      background: '#6c757d',
      color     : '#fff',
      border    : 'none',
      borderRadius: 4,
      cursor: "pointer"
    }}
    onClick={() => setModalOpen(false)}
  >
    Close
  </button>
</Modal>
<Modal
  isOpen={rateOpen}
  onRequestClose={() => setRateOpen(false)}
  contentLabel="Rate your worker"
  style={{
    content: {
      maxWidth   : 400,
      maxHeight   : 400,
      margin     : 'auto',
      borderRadius: 8,
      padding    : 24
    }
  }}
>
  <h2 style={{ textAlign:'center', color:'#4a6fa5' }}>
    How was the work?
  </h2><br />

  {/* ── star picker ───────────────────────────────── */}
  <div
    style={{
      display      : 'flex',
      justifyContent: 'center',
      gap          : 8,
      margin       : '18px 0'
    }}
  >
    {[1,2,3,4,5].map(n =>
      n <= stars ? (
        <FaStar
          key={n}
          size={28}
          style={{ cursor:'pointer', color:'#ffc107' }}
          onClick={() => setStars(n)}
        />
      ) : (
        <FaRegStar
          key={n}
          size={28}
          style={{ cursor:'pointer' }}
          onClick={() => setStars(n)}
        />
      )
    )}
  </div><br /><br />

  {/* ── free-text feedback ───────────────────────── */}
  <textarea
    placeholder="Anything you'd like to add…"
    rows={6}
    value={feedback}
    onChange={e => setFeedback(e.target.value)}
    style={{
      width       : '100%',
      padding     : 10,
      border      : '1px solid #ccc',
      borderRadius: 6
    }}
  />

  {/* ── buttons ──────────────────────────────────── */}
  <div
    style={{
      display    : 'flex',
      justifyContent:'flex-end',
      gap        : 10,
      marginTop  : 18
    }}
  >
    <button
      onClick={() => setRateOpen(false)}
      style={{
        background  : '#6c757d',
        color       : '#fff',
        border      : 'none',
        borderRadius: 6,
        padding     : '8px 20px',
        cursor      : 'pointer'
      }}
    >
      Cancel
    </button>
    <button
      onClick={submitRating}
      style={{
        background  : '#4a6fa5',
        color       : '#fff',
        border      : 'none',
        borderRadius: 6,
        padding     : '8px 26px',
        cursor      : 'pointer',
        fontWeight  : 600
      }}
    >
      Send
    </button>
  </div>
</Modal>
{editOpen && (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    overflowY: 'auto',
    padding: 24
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 12,
      width: '95vw',
      maxWidth: 480,
      minWidth: 260,
      padding: window.innerWidth < 600 ? '18px 4vw' : '28px 32px',
      position: 'relative',
      boxShadow: '0 12px 28px rgba(0,0,0,.18)',
      // THE TWO LINES BELOW ARE CRUCIAL:
      maxHeight: '90vh',       // never taller than viewport
      overflowY: 'auto',       // scroll INSIDE the modal if needed
      margin: '0 auto',
      // optional: add touch scroll on iOS:
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Close (×) */}
      <button
        onClick={cancelbtn}
        style={{
          position: 'absolute',
          top: 14,
          right: 18,
          background: 'transparent',
          border: 'none',
          fontSize: 22,
          cursor: 'pointer',
          color: '#6c757d'
        }}
      >
        &times;
      </button>

      {/* Title */}
      <h2 style={{ color:'#4a6fa5', margin:'0 0 24px', textAlign:'center' }}>
        Edit call
      </h2>

      <div style={{ marginBottom: 18 }}>
        <label style={styles.labelStyle}>Type:</label>
        <select
          value={formData.callType}
          onChange={e => setFormData({ ...formData, callType: e.target.value })}
          style={styles.inputStyle}
        >
          {['Plumbing','Electricity','Painting','Other'].map(o =>
            <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* ② DESCRIPTION immediately after Type */}
      <div style={{ marginBottom: 24 }}>
        <label style={styles.labelStyle}>Description:</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          style={{ ...styles.inputStyle, resize:'vertical' }}
        />
      </div>
      
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

      {/* ──────── FORM FIELDS ──────── */}
      {/* City / Street / House fields */}
      <label style={styles.formLabel}>City</label>
      <input style={styles.input} readOnly value={formData.city} />

      <div style={styles.formGroup}>
  <label>Street</label><br />
  <select
    name="street"
    value={formData.street}
    onChange={handleChange}
    style={styles.input}
  >
    <option value="">-- Select Street --</option>
    {streetOptions.map(s => (          /* <-- now using the memo */
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
</div>

      <label style={styles.formLabel}>House Number</label>
      <input
        style={styles.input}
        type="number"
        placeholder="e.g. 123"
        value={formData.houseNumber}
        onChange={e => setFormData({ ...formData, houseNumber: e.target.value })}
      />

      {showMap && (
        <div style={styles.mapModal}>
          <button style={styles.closeBtn} onClick={() => setShowMap(false)}>
            ×
          </button>
          <div ref={leafletMapDivRef} style={styles.mapContainer} />
        </div>
      )}
            {/* Buttons */}
      <div style={{ display:'flex', justifyContent:'flex-end', gap:12 }}>
        <button
          onClick={cancelbtn}
          style={{
            background:'#6c757d', color:'#fff',
            border:'none', borderRadius:6,
            padding:'10px 20px', cursor:'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={()=>handleEditCall(editingCallId,formData)}
          style={{
            background:'#4a6fa5', color:'#fff',
            border:'none', borderRadius:6,
            padding:'10px 26px', cursor:'pointer',
            fontWeight:600
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

      {/* MAIN CONTENT */}
   <div style={styles.mainContent}>
    {/* ─── Search Bar ─── */}
  <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
    <select
      value={searchType}
      onChange={e => setSearchType(e.target.value)}
      style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
    >
      <option value="callType">Type</option>
      <option value="description">Description</option>
      <option value="address">Address</option>
      <option value="date">Date</option>
    </select>
    <input
      type="text"
      placeholder={`Search by ${searchType}`}
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
    />
  </div>
   {error && (
    <div style={{ color: '#dc3545', margin: '1rem 0' }}>
      {error}
    </div>
  )}

  {loading ? (
    <div style={styles.noCallsMessage}>Loading your calls...</div>
  ) : filteredCalls.length === 0 ? (
    <div style={styles.noCallsMessage}>
      No calls match your search.<br />
      Try clearing the filter or choosing another field.
    </div>
  ) : (
<div style={styles.callsContainer}>
      {filteredCalls.map(call => (
        <div
          key={call._id}
          style={{
            ...styles.callCard,
            transform: hoveredCallId === call._id ? 'scale(1.05)' : 'scale(1)',
            zIndex: hoveredCallId === call._id ? 10 : 1,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            transformOrigin: 'top center',
          }}
          onMouseEnter={() => setHoveredCallId(call._id)}
          onMouseLeave={() => setHoveredCallId(null)}
        >
          <div style={styles.callHeader}>
            <div style={styles.callType}>{call.callType}</div>
            <div style={styles.callDate}>
              {new Date(call.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>

          <div style={styles.callDetails}>
            <div>
              <div style={styles.callDetail}>
                <span style={styles.detailLabel}>Description:</span>
                <span style={styles.detailValue}>
                  {call.description || 'No description provided'}
                </span>
              </div>
              <div style={styles.callDetail}>
                <span style={styles.detailLabel}>Address:</span>
                <span style={styles.detailValue}>
                  {call.street
                    ? `${call.street} ${call.houseNumber}, ${call.city}`
                    : 'Address not specified'}
                </span>
              </div>
              <div style={styles.callDetail}>
                <span style={styles.detailLabel}>Status:</span>
                <span style={styles.detailValue}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...getStatusColor(call.status)
                    }}
                  >
                    {call.status}
                  </span>
                </span>
              </div>
            </div>

            <div style={{
              ...styles.deleteBtnContainer,
              justifyContent: 'space-between',
              flexWrap: 'nowrap'
            }}>
              {/* Right side - Delete */}
              <div>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(call._id)}
                  title="Delete call"
                >
                  <FaTrash size={14} /> Delete
                </button>
              </div>

              {/* Left side - View and Update */}
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  style={{ ...styles.viewBtn, background: '#17a2b8' }}
                  onClick={() => openEdit(call)}
                >
                  Update
                </button>
                <button
                  style={styles.viewBtn}
                  onClick={() => openModal(call._id)}
                >
                  View Applicants
                </button>
              </div>
            </div>

            {call.status.toLowerCase() === 'completed' && !call.rated && (
              <button
                style={{
                  ...styles.viewBtn,
                  marginTop: '10px',
                  width: '60%',
                  background: '#FFA500',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem',
                  alignSelf: 'center'
                }}
                onClick={() => openRate(call)}
              >
                <strong>Worker Rate/Feedback</strong>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
<Modal
  isOpen={showWorkerMap && !!mapCoords}
  onRequestClose={() => setShowWorkerMap(false)}
  contentLabel="Worker/Customer Map"
  style={{
    overlay: {
      zIndex: 999999,
      backgroundColor: "rgba(0,0,0,0.7)"
    },
    content: {
      ...styles.mapContainer,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
      border: "none",
      borderRadius: 16,
      width: "90vw",
      height: "80vh",
      boxShadow: '0 8px 30px rgba(0,0,0,0.25)'
    }
  }}
>
  <button
    style={{
      ...styles.closeBtn,
      position: "absolute",
    }}
    onClick={() => setShowWorkerMap(false)}
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
  title="Reset view to worker location"
  onClick={() => {
    if (mapRef.current) {
      if (workerMapCenter) {
        mapRef.current.setView(workerMapCenter, initialMapZoom || 16, { animate: true });
      } else if (initialMapCenter) {
        mapRef.current.setView(initialMapCenter, initialMapZoom || 16, { animate: true });
      }
    }
  }}
>
  ⬆️ Reset View
</button>

  <div
    id="workerCustomerMap"
    style={{ width: "100%", height: "100%", borderRadius: 16 }}
    ref={workerMapDivRef}
  ></div>
</Modal>

    </div>
  );
}