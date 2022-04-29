import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send(`Access denied no token provided`);
  }

  try {
    const decoded = jwt.verify(token, "privateKey");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send(`Invalid token`);
  }
};