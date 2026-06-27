const express = require("express");

const verifyToken = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);

app.get("/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = app;
