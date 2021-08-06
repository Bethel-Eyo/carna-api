require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db");

router.get("/", authenticateAdminToken, async (req, res) => {
  res.send("Got to admin");
});

// Get list of all Users
router.get("/get-all-users", authenticateAdminToken, async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// update a user
router.put("/update-user", authenticateAdminToken, async (req, res) => {
  try {
    const user = req.body;

    const updateUser = await pool.query(
      "UPDATE users SET name = $1, username = $2, password = $3, country = $4, city = $5 WHERE user_id = $6",
      [user.name, user.username, user.password, user.country, user.city, user.user_id]
    );

    res.json("User was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a Course
router.delete("/delete-user/:id", authenticateAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    // because of the foreign key constraint. you will have to the delete the user's library first
    const deleteUserLibrary = await pool.query("DELETE FROM user_library WHERE user_id = $1", [id]);
    const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.json("User was deleted successfully");
  } catch (err) {
    console.error(err.message);
  }
});

// create a course
router.post("/create-course", authenticateAdminToken, async (req, res) => {
  try {
    const course = req.body;
    const newCourse = await pool.query(
      "INSERT INTO courses (title, description, createdAt) VALUES ($1, $2, $3) RETURNING *",
      [course.title, course.description, new Date()]
    );
    let feedback = {
      message: "Successful",
      data: newCourse.rows[0],
    };
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send();
  }
});

// Get list of courses
router.get("/get-all-courses", authenticateAdminToken, async (req, res) => {
  try {
    const allCourses = await pool.query("SELECT * FROM courses");
    res.json(allCourses.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// update a Course
router.put("/update-course", authenticateAdminToken, async (req, res) => {
  try {
    const course = req.body;

    const updateCourse = await pool.query(
      "UPDATE courses SET title = $1, description = $2 WHERE course_id = $3",
      [course.title, course.description, course.course_id]
    );

    res.json("Course was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a Course
router.delete("/delete-course/:id", authenticateAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    // because of the foreign key constraint. you will have to the delete the user's library first
    const deleteUserLibrary = await pool.query("DELETE FROM user_library WHERE course_id = $1", [id]);
    const deleteCourse = await pool.query("DELETE FROM courses WHERE course_id = $1", [id]);
    res.json("Course was deleted successfully");
  } catch (err) {
    console.error(err.message);
  }
});

// Create middleware to Check admin token validity
function authenticateAdminToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // if authHeader is not null, return token or else return undefined
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, user) => {
    // 403: we see that you have a token but this token is no longer valid so you no longer have access
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
