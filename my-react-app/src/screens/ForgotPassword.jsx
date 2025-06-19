import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/auth/forgetPassword',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        // Attempt to parse the error message from the response
        const errorData = await response.json();
        const errorMessage = errorData.message || "Error sending OTP.";
        alert(errorMessage);
        return;
      }
  
      setStep('otp');
    } catch (error) {
      console.error("Network error:", error);
      alert("A network error occurred. Please check your connection and try again.");
    }
  };
  
  

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });

      if (response.ok) {
        alert('Password reset successfully');
        window.location.href = '/';
      } else {
        alert("Reset failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };
  const havingaccount = (e) => {
    e.preventDefault();
    navigate("/Login");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.leftSide}>
          <div style={styles.logoText}>House<span style={styles.logoSpan}>Fix</span></div>
          <h1 style={styles.heading}>Forgot Password</h1>
          {step === 'email' ? (
            <>
              <h6 style={styles.subtitle}>Enter your registered email to reset your password.</h6>
              <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
                <button type="submit" style={styles.button}>Continue</button>
                <div onClick={havingaccount} style={styles.accountOptions}>
                  Want to Login? <a href="#" style={styles.link}>Login here</a>
                </div>
              </form>
            </>
          ) : (
            <>
              <h6 style={styles.subtitle}>Enter the verification code you received and set a new password.</h6>
              <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <button type="submit" style={styles.button}>Reset Password</button>
                <div onClick={havingaccount} style={styles.accountOptions}>
                  Want to Login? <a href="#" style={styles.link}>Login here</a>
                </div>
              </form>
            </>
          )}
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
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0
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
    marginBottom: '20px',
    color: '#333'
  },
  subtitle: {
    color: '#555',
    fontWeight: 'normal',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px 15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
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
  }
};

export default ForgotPassword;