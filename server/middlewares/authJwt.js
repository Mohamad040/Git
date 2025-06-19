const jwt = require("jsonwebtoken");
const User = require('../models/users');
const { SECRET } = require("../constants");

verifyToken = async (req, res, next) => {
  let token = null;

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  }

  if (!token) {
    return res.status(401).send({ message: "No token provided!" });
  }

  try {
    // 1. Verify the token
    const decoded = jwt.verify(token, SECRET);

    // 2. Fetch the user from DB to get the isAdmin field
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send({ message: "User not found!" });
    }

    // 3. Attach user info to the request
    req.userId = user._id;
    req.isAdmin = !!user.isAdmin;    // <- important!
    req.isWorker = !!user.isWorker;  // (optional, if you need it elsewhere)
    req.user = user;                 // (optional, gives access to all user fields)

    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!", error: err.message });
  }
};

module.exports = {
  verifyToken,
};