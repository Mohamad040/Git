import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

// Fix Leaflet default icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CustomerSignUp = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', city: '', gender: '', street: '', houseNumber: ''
  });
  const [showMap, setShowMap] = useState(false);
  const [showStreetFields, setShowStreetFields] = useState(false);
  const [streets, setStreets] = useState([]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: formData.age,
      gender: formData.gender,
      isWorker: false, 
      isAdmin: false,
      city: formData.city,
      street: formData.street,
      houseNumber: formData.houseNumber
    };
  
    try {
      const response = await fetch("http://localhost:8000/api/auth/signupcos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Signup successful!");
        navigate("/Login");
      } else {
        alert("Signup failed: " + (result.message || "An error occurred"));
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while signing up.");
    }
  };
  
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

      setShowStreetFields(true);
      await fetchStreetsByCoordinates(lat, lng);
    } catch (err) {
      console.error('Error fetching city:', err);
    }
  };

  const fetchStreetsByCoordinates = async (lat, lon) => {
    try {
      const areaQuery = `[out:json][timeout:25]; is_in(${lat}, ${lon})->.a; area.a[admin_level~"6|7|8"]; out ids;`;
      const areaRes = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: areaQuery });
      const areaData = await areaRes.json();

      if (!areaData.elements.length) return;

      const areaId = areaData.elements[0].id;
      const streetQuery = `[out:json][timeout:25]; way["highway"]["name"](area:${areaId}); out tags;`;
      const streetRes = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: streetQuery });
      const streetData = await streetRes.json();
      const streetNames = streetData.elements.map(el => el.tags.name).filter(Boolean);
      setStreets([...new Set(streetNames)].sort());
    } catch (err) {
      console.error('Error fetching streets:', err);
    }
  };
  const handleUseCurrentLocation = async () => {
    try {
      /* -------- 1. High-accuracy geolocation request -------- */
      navigator.geolocation.getCurrentPosition(
        /* success */ async ({ coords }) => {
          const lat = coords.latitude;
          const lng = coords.longitude;

          /* -------- 2. Send coords to backend -------- */
          const res = await fetch(
            "http://localhost:8000/api/auth/getLocationDetails",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ lat, lng }),
            }
          );

          const data = await res.json();
          console.log("📍 posting coords", { lat, lng });

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch location");
          }

          /* -------- 3.  Update form fields -------- */
          setFormData((prev) => ({
            ...prev,
            city: data.city,
            street: data.street,
            houseNumber: data.houseNumber,
          }));

          /* -------- 4.  User feedback if something is missing -------- */
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
          setShowStreetFields(true);
          /* -------- 5.  Refresh street options -------- */
          await fetchStreetsByCoordinates(lat, lng);
        },

        /* error */
        (error) => {
          console.error("❌ Error getting location from browser:", error);
          alert("Failed to get your location. Please allow location access.");
        },

        /* options */
        {
          enableHighAccuracy: true,
          maximumAge: 0, // never use a cached fix
          timeout: 10_000, // give up after 10 seconds
        }
      );
    } catch (err) {
      console.error("❌ Error using current location:", err);
      alert("Failed to load location: " + err.message);
    }
  };

  const styles = {
    pageContainer: {  position: 'fixed',          // Ensure it fills the screen
      backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45c003edd2be")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'fixed',         // ⬅️ make it fixed to cover the viewport
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',        // ⬅️ no scrollbars
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      margin: 0,
      zIndex: -1 
     },
    card: { display: 'flex', backgroundColor: '#ffffffee', borderRadius: '10px', maxWidth: '1000px', width: '100%', height: '87vh', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', overflow: 'hidden' },
    leftSide: { flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
    rightSide: { flex: 1, backgroundColor: '#eaf6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoText: { color: '#0077b6', fontSize: '32px', fontWeight: 'bold' },
    logoSpan: { color: '#023e8a' },
    logoImg: { width: '80%', height: 'auto', objectFit: 'contain' },
    heading: { fontSize: '20px', marginBottom: '30px', color: '#333' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formGroup: { textAlign: 'left' },
    input: { width: '90%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' },
    select: { width: '90%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' },
    button: { backgroundColor: '#0077b6', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
    forgot: { fontSize: '14px', backgroundColor: '#0077b6', color: '#fff', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px', textDecoration: 'none', display: 'inline-block', border: 'none' },
    forgot2: { fontSize: '14px', backgroundColor: '#0077b6', color: '#fff', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer',marginBottom: '5px', marginTop: '5px', textDecoration: 'none', display: 'inline-block', border: 'none' },
    link: { color: '#0077b6', textDecoration: 'none' },
    accountOptions: { marginTop: '10px', textAlign: 'center', fontSize: '14px' },
    mapContainer: { position: 'fixed', top: '10%', left: '10%', width: '80%', height: '80%', background: 'white', zIndex: 9999, border: '2px solid black' },
    closeBtn: { position: 'absolute', top: '10px', left: '10px', zIndex: 10000 }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.leftSide}>
          <div style={styles.logoText}>House<span style={styles.logoSpan}>Fix</span></div>
          <h1 style={styles.heading}>Sign Up - Customer</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} /></div>
            <div style={styles.formGroup}><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} /></div>
            <div style={styles.formGroup}><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} /></div>
            <div style={styles.formGroup}><label>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} style={styles.input} /></div>
            <div style={styles.formGroup}>
              <button  type="button" style={styles.forgot2} onClick={handleUseCurrentLocation}>
                Use Current Location
              </button><br />
              <label>City</label>
              <input type="text" name="city" value={formData.city} readOnly style={styles.input} />
              <button type="button" onClick={() => setShowMap(true)} style={styles.forgot}>Open Map</button>
            </div>

            {showStreetFields && (
              <>
                <div style={styles.formGroup}><label>Street</label><br /><select name="street" value={formData.street} onChange={handleChange} style={styles.select}><option value="">-- Select Street --</option>{streets.map((street, i) => (<option key={i} value={street}>{street}</option>))}</select></div>
                <div style={styles.formGroup}><label>House Number</label><input type="number" name="houseNumber" value={formData.houseNumber} onChange={handleChange} style={styles.input} /></div>
              </>
            )}

            <div style={styles.formGroup}>
              <label>Gender</label>
              <div>
                <label><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> Male</label>{' '}
                <label><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Female</label>{' '}
                <label><input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} /> Other</label>
              </div>
            </div>
            <button type="submit" style={styles.button}>Submit</button>
          </form>
          <div onClick={() => navigate('/Login')} style={styles.accountOptions}>
            Already have an account? <a href="#" style={styles.link}>Login here</a>
          </div>
        </div>
        <div style={styles.rightSide}><img src={logo} alt="House Fix Logo" style={styles.logoImg} /></div>
      </div>

      {showMap && (
        <div style={styles.mapContainer}>
          <button onClick={() => setShowMap(false)} style={styles.closeBtn}>Close</button>
          <div id="leafletMap" style={{ width: '100%', height: '100%' }}></div>
        </div>
      )}
    </div>
  );
};

export default CustomerSignUp;