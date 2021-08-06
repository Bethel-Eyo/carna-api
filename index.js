require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

app.use(express.json()); // => req.body
// app.use(express.urlencoded({ extended: false }));
app.use(cors());

// User authenticated endpoints route
app.use("/users", userRouter);

// Admin authenticated endpoints route
app.use("/admin", adminRouter);

// register User
app.post("/register-user", async (req, res) => {
  try {
    const user = req.body;
    // Create a hashed password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    const newUser = await pool.query(
      "INSERT INTO users (name, username, password, country, city, createdAt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user.name, user.username, hashedPassword, user.country, user.city, new Date()]
    );
    let feedback = {
      message: "Successful",
      data: {
        user_id: newUser.rows[0].user_id,
        username: newUser.rows[0].username,
        country: newUser.rows[0].country,
        city: newUser.rows[0].city,
        createdAt: newUser.rows[0].createdat
      }
    }
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send();
  }
});

// User Login
app.post("/user-login", async (req, res) => {
  const { username } = req.body
  // check if the username exists in the database
  const user = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  // check if user was not found
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    // compare the user password with the password in the database
    if(await bcrypt.compare(req.body.password, user.rows[0].password)){
      // generate jwt token
      const access_token = jwt.sign(user.rows[0], process.env.USER_ACCESS_TOKEN_SECRET, { expiresIn: '20m'});
      // res.json(user.rows[0]);
      // return;
      let data = {
        user_id: user.rows[0].user_id,
        name: user.rows[0].name,
        username: user.rows[0].username,
        country: user.rows[0].country,
        city: user.rows[0].city,
        createdAt: user.rows[0].createdat
      }
      res.json({ success: true, message: "Success", user: data, token: access_token });
    } else {
      let response = {
        success: false,
        message: "Password is incorrect",
      }
      res.json(response);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send();
  }
});

// Register Admin
app.post("/register-admin", async (req, res) => {
  try {
    const admin = req.body;
    // Create a hashed password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    const newAdmin = await pool.query(
      "INSERT INTO admins (name, username, password, createdAt) VALUES ($1, $2, $3, $4) RETURNING *",
      [admin.name, admin.username, hashedPassword, new Date()]
    );
    let feedback = {
      message: "Successful",
      data: {
        admin_id: newAdmin.rows[0].admin_id,
        username: newAdmin.rows[0].username,
        created_at: newAdmin.rows[0].createdat
      }
    }
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send();
  }
});

// Admin Login
app.post("/admin-login", async (req, res) => {
  const { username } = req.body
  // check if the username exists in the database
  const user = await pool.query("SELECT * FROM admins WHERE username = $1", [
    username,
  ]);
  // check if user was not found
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    // compare the user password with the password in the database
    if(await bcrypt.compare(req.body.password, user.rows[0].password)){
      // generate jwt token
      const access_token = jwt.sign(user.rows[0], process.env.ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '20m'});
      // res.json(user.rows[0]);
      // return;
      let data = {
        admin_id: user.rows[0].admin_id,
        username: user.rows[0].username,
        createdAt: user.rows[0].createdat
      }
      res.json({ success: true, message: "Success", admin: data, token: access_token });
    } else {
      let response = {
        success: false,
        message: "Password is incorrect",
      }
      res.json(response);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send();
  }
});

module.exports = app.listen(5000);
