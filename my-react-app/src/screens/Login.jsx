import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert('Please select a role.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      if (
        (role === 'admin' && !data.isAdmin) ||
        (role === 'worker' && !data.isWorker) ||
        (role === 'customer' && (data.isAdmin || data.isWorker))
      ) {
        alert("❌ You are not authorized to log in as " + role);
        return;
      }

      console.log('✅ Login success as', role);
      localStorage.setItem('userData', JSON.stringify(data));
      if (data.isWorker)
        navigate("/WorkerMain");
      else if (data.isAdmin)
        navigate("/AdminMain");
      else if (!data.isAdmin&&!data.isWorker)
        navigate("/CustomerMain");
    } catch (err) {
      console.error("Login error:", err);
      alert("A network error occurred. Please check your connection and try again.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/ForgotPassword");
  };

  const cussignup = (e) => {
    e.preventDefault();
    navigate("/CustomerSignUp");
  };

  const worsignup = (e) => {
    e.preventDefault();
    navigate("/WorkerSignUp");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.leftSide}>
          <div style={styles.logoText}>House<span style={styles.logoSpan}>Fix</span></div>
          <h1 style={styles.heading}>Main Page - Login</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.input}
              />
              <a href="#" onClick={handleForgotPassword} style={styles.forgot}>Forgot password?</a>
            </div>

            <div style={styles.formGroup}>
              <label>Login as:  </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">-- Select Role --</option>
                <option value="admin">Admin</option>
                <option value="worker">Worker</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <button type="submit" style={styles.button}>Login</button>
          </form>

          <div style={styles.divider}><span>or</span></div>

          <div style={styles.accountOptions}>
            <p>Don't have an account?</p>
            <a href="#" onClick={cussignup} style={styles.link}>Create account for customer? click here</a>
            <a href="#" onClick={worsignup} style={styles.link}>Create account for worker? click here</a>
          </div>
        </div>

        <div style={styles.rightSide}>
          <img src={logo} alt="House Fix Logo" style={styles.logoImg} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
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
    zIndex: -1                 // optional: move it behind all content
  },
  
  card: {
    display: 'flex',
    backgroundColor: '#ffffffee',
    borderRadius: '10px',
    maxWidth: '1000px',
    width: '100%',
    minHeight: '600px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden'
  },
  leftSide: {
    flex: 1,
    padding: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  rightSide: {
    flex: 1,
    backgroundColor: '#eaf6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: '#0077b6',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  logoSpan: {
    color: '#023e8a'
  },
  logoImg: {
    width: '80%',
    height: 'auto',
    objectFit: 'contain'
  },
  heading: {
    fontSize: '20px',
    marginBottom: '30px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    textAlign: 'left'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  forgot: {
    display: 'block',
    textAlign: 'right',
    fontSize: '14px',
    marginTop: '5px',
    color: '#0077b6',
    textDecoration: 'none'
  },
  button: {
    backgroundColor: '#0077b6',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  divider: {
    margin: '20px 0',
    position: 'relative',
    height: '1px',
    backgroundColor: '#ccc',
    textAlign: 'center',
    lineHeight: '0'
  },
  accountOptions: {
    marginTop: '20px',
    fontSize: '14px'
  },
  link: {
    display: 'block',
    margin: '10px 0',
    color: '#0077b6',
    fontWeight: 500,
    textDecoration: 'none'
  },
  teams: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '30px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    color: '#555',
    textDecoration: 'none',
    fontSize: '14px'
  },
  select: {
    width: '200px',
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '1.2',
    backgroundColor: '#fff',
    outline: 'none',
  }
  
};

export default Login;
