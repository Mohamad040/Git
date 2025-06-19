import { useRef ,useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaBriefcase, FaCalendarAlt, FaCheck, FaTools, FaHome, FaUser, FaInfoCircle, FaSignOutAlt, FaListAlt, FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
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
  mainContent: {
    flex: 1,
    padding: '2rem 5%',
    display: 'flex',
    justifyContent: 'center',
  },
  jobsContainer: {
    width: '90%',
    maxWidth: '1400px',
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  jobsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  jobsTitle: {
    fontSize: '1.8rem',
    color: '#2c3e50',
    fontWeight: '600',
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  jobsIcon: {
    fontSize: '2rem',
    color: '#4fd1c5',
  },
  jobList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  jobItemContainer: {
    perspective: '1000px',
    marginBottom: '1.5rem',
  },
  jobItemInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.8s ease',
    transformStyle: 'preserve-3d',
  },
  jobItemFlipped: {
    transform: 'rotateY(180deg)',
  },
  jobItemFront: {
    position: 'relative',
    backfaceVisibility: 'hidden',
    padding: '1.8rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #4fd1c5',
  },
  jobItemBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '1.8rem',
    transform: 'rotateY(180deg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderLeft: '4px solid #48bb78',
  },
  jobTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2b5876',
    marginBottom: '0.8rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  jobDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    color: '#718096',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  doneButton: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    padding: '0.8rem 1.5rem',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 6px rgba(72, 187, 120, 0.2)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
    },
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '2.5rem',
    color: '#718096',
    fontSize: '1.2rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #e2e8f0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  decorativeElement: {
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #2b5876, #4fd1c5, #2b5876)',
    margin: '1.5rem 0',
    borderRadius: '2px',
  },
  celebrationIcon: {
    fontSize: '3rem',
    color: '#48bb78',
    marginBottom: '1rem',
    animation: 'bounce 1s infinite alternate',
  },
  celebrationText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2b5876',
    marginBottom: '0.5rem',
  },
  celebrationSubtext: {
    color: '#718096',
    fontSize: '1rem',
  },
  ratingPrompt: {
    marginTop: '1.5rem',
    fontSize: '1rem',
    color: '#4a5568',
  },
  '@keyframes bounce': {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(-10px)' },
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
  detailLabel: {
    fontWeight: '600',
    minWidth: '120px',
    color: '#4a5568',
  },
  searchOptionsContainer: {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: '#f8fafc',
  borderRadius: '30px',
  padding: '0.6rem 1.2rem',
  border: '1px solid #e2e8f0',
  marginLeft: 'auto',
},
searchContainer: {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f8fafc',
  borderRadius: '30px',
  padding: '0.6rem 1.2rem',
  border: '1px solid #e2e8f0',
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
searchSelect: {
  border: 'none',
  background: 'transparent',
  outline: 'none',
  fontSize: '1rem',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
},

};

export default function WorkerJob({ onDelete }) {
  const [jobs, setJobs] = useState([]);
  const token = JSON.parse(localStorage.getItem('userData'))?.accessToken;
  const navigate = useNavigate();
  const location = useLocation();
  const [flippedCards, setFlippedCards] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [mapCoords, setMapCoords] = useState(null); // {lat, lng, address}
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('Description');
  const [workerPosition, setWorkerPosition] = useState(null); // {lat, lng}
  const [initialMapCenter, setInitialMapCenter] = useState(null); // [lat, lng]
  const [initialMapZoom, setInitialMapZoom] = useState(16);
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

  const handleMenuSelect = (option) => {
    if (option === 'MainPage') navigate('/WorkerMain');
    else if (option === 'MyWorks') navigate('/WorkerJob');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Help') navigate('/HelpPage');
    else if (option === 'MyRequests') navigate('/WorkerRequests');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };
  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    switch (searchOption) {
      case 'Description':
        return job.description?.toLowerCase().includes(term);
      case 'Address':
        return `${job.city} ${job.street} ${job.houseNumber}`.toLowerCase().includes(term);
      case 'Date':
        return new Date(job.date || job.createdAt).toLocaleDateString().includes(searchTerm);
      default:
        return true;
    }
  });
  // Fetch all calls this worker has been approved for
  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/events/getApprovedCalls', {
      headers: { 'x-access-token': token }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load your jobs');
        return res.json();
      })
      .then(data => {
        setJobs(data);
        // Initialize flipped state for completed jobs
        const initialFlipped = {};
        data.forEach(job => {
          if (job.status === 'completed') {
            initialFlipped[job._id] = true;
          }
        });
        setFlippedCards(initialFlipped);
      })
      .catch(err => console.error('WorkerJob fetch error:', err));
  }, [token]);

  const handleDone = async (callID) => {
    try {
      const res = await fetch(`http://localhost:8000/api/events/completeCall/${callID}`, {
        method: 'POST',
        headers: { 'x-access-token': token }
      });
      
      if (!res.ok) throw new Error('Failed to complete call');
      
      // Flip the card
      setFlippedCards(prev => ({ ...prev, [callID]: true }));
      
      // Update status
      setJobs(prevJobs => prevJobs.map(j => 
        j._id === callID ? { ...j, status: 'completed' } : j
      ));
    } catch (err) {
      console.error('Error completing job:', err);
    }
  };

  const toggleFlip = (callID) => {
    setFlippedCards(prev => ({ ...prev, [callID]: !prev[callID] }));
  };

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
      {/* Header */}
      <header style={{ ...styles.header, justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
          House<span style={styles.logoHighlight}>Fix</span>
        </div>

        {/* Menu */}
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

        {/* Page title */}
        <div style={styles.rightTitle}>
          <FaTools />
          MyWorks
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.jobsContainer}>
          <div style={styles.jobsHeader}>
            <FaBriefcase style={styles.jobsIcon} />
            <h2 style={styles.jobsTitle}>Your Approved Jobs</h2>
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

          <div style={styles.decorativeElement}></div>

          {jobs.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No jobs assigned yet. Check back later!</p>
            </div>
          ) : (
            <div style={styles.jobList}>
              {filteredJobs.map(job => (
                <div key={job._id} style={styles.jobItemContainer}>
                  <div 
                    style={{
                      ...styles.jobItemInner,
                      ...(flippedCards[job._id] && styles.jobItemFlipped)
                    }}
                    onClick={() => {
                      if (job.status === 'completed') {
                        toggleFlip(job._id);
                      }
                    }}
                  >
                    {/* Front of card - Job details */}
                    <div style={styles.jobItemFront}>
                      {job.status !== 'completed' && (
                        <button
                          style={styles.doneButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDone(job._id);
                          }}
                        >
                          <FaCheck /> Mark as Done
                        </button>
                      )}
                      <h3 style={styles.jobTitle}>{job.callType}</h3>
                      <div style={styles.jobDetail}>
                        <FaCalendarAlt />
                        <span>{new Date(job.date || job.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={styles.jobDetail}>
                        <strong>Description:</strong> {job.description}
                      </div>
                      {job.city && job.street && job.houseNumber && (
                        <div style={styles.jobDetail}>
                          <span style={styles.detailLabel}>Address:</span>
                          <span>
                            {job.city}, {job.street} {job.houseNumber}
                            {job.status !== 'completed' && (
                              <button
                                style={{ marginLeft: 10, padding: '4px 12px', borderRadius: 20, border: "none", background: "#2b5876", color: "white", cursor: "pointer" }}
                                onClick={e => { e.stopPropagation(); handleShowOnMap(job); }}
                              >
                                Show on Map
                              </button>
                            )}
                          </span>
                        </div>
                      )}
                      {job.costumerdetails && (
                        <div style={styles.jobDetail}>
                          <strong>Customer:</strong> {job.costumerdetails.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Back of card - Completion message */}
                    <div style={styles.jobItemBack}>
                      <FaCheck style={styles.celebrationIcon} />
                      <h3 style={styles.celebrationText}>Job Completed!</h3>
                      <p style={styles.celebrationSubtext}>
                        Great work on this {job.callType.toLowerCase()} job
                      </p>

                    </div>
                  </div>
                </div>
              ))}
            </div>
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

WorkerJob.propTypes = {
  onDelete: PropTypes.func.isRequired,
};