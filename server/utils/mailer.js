// utils/mailer.js
const nodemailer = require('nodemailer');
const { EMAIL, EMAILPASSWORD } = require('../constants');   // ← you use these in authController

const transporter = nodemailer.createTransport({
  service : 'gmail',               // keep the same provider you use for OTP
  auth    : { user: EMAIL, pass: EMAILPASSWORD },
  tls     : { rejectUnauthorized: false }
});

/**
 * Simple promise wrapper
 * @param {string} to       – recipient address
 * @param {string} subject  – mail subject line
 * @param {string} html     – html body
 */
module.exports = (to, subject, html) =>
  transporter.sendMail({ from: EMAIL, to, subject, html });
