import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/images/logo.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';
import { useNavigate } from "react-router-dom";


const WorkerSignup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', gender: '',
    workType: '', city: '', street: '', houseNumber: ''
  });
  const [showMap, setShowMap] = useState(false);
  const [streets, setStreets] = useState([]);
  const [showStreetFields, setShowStreetFields] = useState(false);
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

        L.Control.geocoder().addTo(map).on('markgeocode', async (e) => {
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
        });
      }, 0);
    }
  }, [showMap]);

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
      workType:formData.workType,
      isWorker: true, // 👈 this is a worker signup
      isAdmin: false,
      city: formData.city,
      street: formData.street,
      houseNumber: formData.houseNumber
    };
  
    try {
      const response = await fetch("http://localhost:8000/api/auth/signupwor", {
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
    pageContainer: { position: 'fixed',          // Ensure it fills the screen
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
    card: { display: 'flex', backgroundColor: '#ffffffee', borderRadius: '10px', maxWidth: '1000px', width: '90%', height: '90vh', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' },
    leftSide: { flex: 1, padding: '40px', overflowY: 'auto' },
    rightSide: { flex: 1, backgroundColor: '#eaf6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoText: { color: '#0077b6', fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' },
    logoSpan: { color: '#023e8a' },
    logoImg: { width: '80%', height: 'auto' },
    heading: { fontSize: '20px', marginBottom: '20px', color: '#333' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formGroup: { textAlign: 'left' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '15px' },
    select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '15px' },
    radioLabel: { marginRight: '15px' },
    accountOptions: { marginTop: '10px', textAlign: 'center', fontSize: '14px' },
    button: { backgroundColor: '#0077b6', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' },
    mapModal: { position: 'fixed', top: '5%', left: '5%', width: '90%', height: '85%', background: 'white', zIndex: 1000, border: '2px solid black' },
    closeBtn: { position: 'absolute', top: '10px', left: '10px', zIndex: 1001 },
    forgot: { fontSize: '14px', backgroundColor: '#0077b6', color: '#fff', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px', textDecoration: 'none', display: 'inline-block', border: 'none' },
    forgot2: { fontSize: '14px', backgroundColor: '#0077b6', color: '#fff', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer',marginBottom: '5px', marginTop: '5px', textDecoration: 'none', display: 'inline-block', border: 'none' }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.leftSide}>
          <div style={styles.logoText}>House<span style={styles.logoSpan}>Fix</span></div>
          <h1 style={styles.heading}>Sign Up - Worker</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            {['name', 'email', 'password', 'age'].map(field => (
              <div key={field} style={styles.formGroup}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input type={field === 'password' ? 'password' : field === 'age' ? 'number' : 'text'} name={field} value={formData[field]} onChange={handleChange} style={styles.input} />
              </div>
            ))}

            <div style={styles.formGroup}>
              <button  type="button" style={styles.forgot2} onClick={handleUseCurrentLocation}>
                Use Current Location
              </button><br />
              <label>City:</label>
              <input type="text" name="city" value={formData.city} readOnly style={styles.input} />
              <button type="button" onClick={() => setShowMap(true)} style={styles.forgot}>Open Map</button>
            </div>

            {showStreetFields && (
              <>
                <div style={styles.formGroup}>
                  <label>Street:</label>
                  <select name="street" value={formData.street} onChange={handleChange} style={styles.select}>
                    <option value="">-- Select Street --</option>
                    {streets.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label>House Number:</label>
                  <input type="number" name="houseNumber" value={formData.houseNumber} onChange={handleChange} style={styles.input} />
                </div>
              </>
            )}

            <div style={styles.formGroup}>
              <label>Gender:</label>
              {['male', 'female', 'other'].map(g => (
                <label key={g} style={styles.radioLabel}>
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} /> {g}
                </label>
              ))}
            </div>

            <div style={styles.formGroup}>
              <label>Work Type:</label>
              <select name="workType" value={formData.workType} onChange={handleChange} style={styles.select}>
                <option value="">Choose a work type</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Painter">Painter</option>
                <option value="Handy Man">Handy Man</option>
              </select>
            </div>

            <button type="submit" style={styles.button}>Submit</button>
          </form>
          <div onClick={() => navigate('/Login')} style={styles.accountOptions}>
            Already have an account? <a href="#" style={styles.link}>Login here</a>
          </div>
        </div>
        <div style={styles.rightSide}>
          <img src={logo} alt="House Fix Logo" style={styles.logoImg} />
        </div>
      </div>

      {showMap && (
        <div style={styles.mapModal}>
          <button onClick={() => setShowMap(false)} style={styles.closeBtn}>Close</button>
          <div id="leafletMap" style={{ width: '100%', height: '100%' }}></div>
        </div>
      )}
    </div>
  );
};

export default WorkerSignup;
