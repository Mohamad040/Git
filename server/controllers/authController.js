const constants = require('../constants');
const { SECRET,EMAIL,EMAILPASSWORD } = constants;
const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
let jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configuration for the mailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service
  auth: {
    user: EMAIL,
    pass: EMAILPASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});
exports.authController = {

    signupcos(req, res) {
        infoLogger.info("Costumer signup");
        const { name, email, age, gender, password, city,street, houseNumber } = req.body;
        if (name, email, age, gender, password, city,street, houseNumber) {
            let IsWorker = false; 
            let WorkType = "None"; 
            let IsAdmin = false;
            User.findOne({ email: email })
                .then((user) => {
                    if (user) {
                        errorLogger.error("this email is already exists");
                        res.status(400).json({ "message": "this email is already exists" });
                    }
                    else {
                        // Prepare the user data object

                        let userData = {
                            name,
                            email,
                            age,
                            city,
                            street, 
                            houseNumber,
                            gender,
                            password: bcrypt.hashSync(password, 8),
                            isAdmin:IsAdmin,
                            isWorker:IsWorker,
                            workType:WorkType,
                            userCalls: [],
                        };                        

                        // Create a new user instance with the prepared data
                        const newUser = new User(userData);

                        newUser.save()
                            .then(result => {
                                infoLogger.info(`Adding User  :${req.body.name} is successfully`);
                                res.json(result);
                            })
                            .catch(err => {
                                errorLogger.error(`Error Adding User `);
                                res.status(400).json({ "message": `Error Adding User ` });
                            });
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error User user ` });
                });
        }
        else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },

    signupwor(req, res) {
        infoLogger.info("Worker signup");
        const { name, email, age, gender, password, workType, city,street, houseNumber} = req.body;
        if (name, email, age, gender, password, workType, city,street, houseNumber) {
            let IsWorker = true;
            let IsAdmin = false;
            let Description = ''
            User.findOne({ email: email })
                .then((user) => {
                    if (user) {
                        errorLogger.error("this email is already exists");
                        res.status(400).json({ "message": "this email is already exists" });
                    }
                    else {
                        // Prepare the user data object

                        let userData = {
                            name,
                            email,
                            age,
                            city, 
                            street, 
                            houseNumber,
                            gender,
                            password: bcrypt.hashSync(password, 8),
                            isAdmin:IsAdmin,
                            isWorker:IsWorker,
                            workType,
                            description:Description,
                            userCalls: [],
                            workerCalls: [],
                        };

                        // Create a new user instance with the prepared data
                        const newUser = new User(userData);

                        newUser.save()
                            .then(result => {
                                infoLogger.info(`Adding User  :${req.body.name} is successfully`);
                                res.json(result);
                            })
                            .catch(err => {
                                errorLogger.error(`Error Adding User `);
                                res.status(400).json({ "message": `Error Adding User ` });
                            });
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error User user ` });
                });
        }
        else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },

    async login(req, res) {
        const email = String(req.body.email).toLowerCase();
        try {
            const user = await User.findOne({ email })
            if (!user) {
                errorLogger.error("Wrong user email please enter correct email");
                res.status(400).json({ "message": "Wrong user email please enter correct email" });
                return;
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).json({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },   // 👈 include the flag
            SECRET,
            { expiresIn: 14 * 86400 }
            );
            let userResponse = {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                isAdmin:user.isAdmin,
                isWorker:user.isWorker,
                workType:user.workType,
                city:user.city,
                street:user.street,
                houseNumber:user.houseNumber,
                description:user.description,
                userCalls:user.userCalls,
                accessToken: token
            }
            if (user.isWorker) {
                userResponse.workerCalls = user.workerCalls
            }

            res.status(200).json(userResponse);
        }
        catch (err) {
            errorLogger.error(`Error Getting user from db:${err}`);
            res.status(500).json({ "message": `Error getting user ` });
        }


    },

    async forgetPassword(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ "message": "Email is required" });
        }

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ "message": "User not found" });
                }

                // Generate a 6-digit OTP
                const otp = crypto.randomBytes(3).toString('hex').toUpperCase();

                // Store the OTP in the user's document with an expiration time, e.g., 15 minutes
                user.resetPasswordToken = otp;
                user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

                user.save().then(() => {
                    // Send the OTP via email
                    const mailOptions = {
                        from: 'fadikanane@gmail.com',
                        to: user.email,
                        subject: 'Password Reset',
                        text: `Your OTP for password reset is: ${otp}`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ "message": "Error sending email" });
                        } else {
                            res.json({ "message": "An OTP has been sent to your email" });
                        }
                    });
                });
            })
            .catch(err => {
               errorLogger.error(err);
                res.status(500).json({ "message": "Error finding user" });
            });
    },
    async resetPassword(req, res) {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ "message": "All fields are required" });
        }

        User.findOne({ email: email, resetPasswordToken: otp, resetPasswordExpires: { $gt: Date.now() } })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ "message": "Invalid or expired OTP" });
                }

                // Update the user's password and clear the reset token and expiration
                user.password = bcrypt.hashSync(newPassword, 8);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save().then(() => {
                    res.json({ "message": "Password has been updated" });
                });
            })
            .catch(err => {
               errorLogger.error(err);
                res.status(500).json({ "message": "Error resetting password" });
            });
    },
    async getLocationDetails(req, res) {
        try {
            const { lat, lng } = req.body;
            if (!lat || !lng) {
            return res.status(400).json({ message: "Missing coordinates" });
            }

            const [heData, enData] = await Promise.all([
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=20&addressdetails=1&extratags=1&namedetails=1`).then(r => r.json()),
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=20&addressdetails=1&extratags=1&namedetails=1`).then(r => r.json())
            ]);

            const extract = (data) => {
            const a = data.address;
            const city = a.city || a.town || a.village || a.state_district || a.state ;
            const street = a.road || a.street || a.pedestrian || a.footway || a.neighbourhood || "";
            const houseNumber = a.house_number || a.housenumber || "";
            console.log("🧭 Address Fields:", a);

            return { city, street, houseNumber };
            };

            const he = extract(heData);
            const en = extract(enData);

            const fullCity = `${he.city}, ${heData.address.country} | ${en.city}, ${enData.address.country}`;
            const finalStreet = (he.street && he.street.trim())  ? he.street
            : (en.street && en.street.trim()) ? en.street
            : "";
            const finalHouseNumber = he.houseNumber || en.houseNumber || "";

            return res.status(200).json({
            city: fullCity,
            street: finalStreet,
            houseNumber: finalHouseNumber
            });

        } catch (err) {
            console.error("❌ Error reverse-geocoding location:", err);
            return res.status(500).json({ message: "Failed to get location details", error: err.message });
        }
    }
};