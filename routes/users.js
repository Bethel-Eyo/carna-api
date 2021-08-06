require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.get('/', async (req, res) => {
	return res.status(200).json({
		message: 'Hello World',
	});
});

// Get list of courses
router.get('/get-all-courses', authenticateUserToken, async (req, res) => {
	try {
		const allCourses = await pool.query('SELECT * FROM courses');
		res.json(allCourses.rows);
	} catch (err) {
		console.error(err.message);
	}
});

// Get list of courses for a particular user
router.get('/get-enrolled-courses/:id', authenticateUserToken, async (req, res) => {
	try {
		const { id } = req.params;
		const userCourses = await pool.query('SELECT * FROM user_library WHERE user_id = $1', [id]);
		res.json(userCourses.rows);
	} catch (err) {
		console.error(err.message);
	}
});

// Enables user to add a course to their library
router.post('/enroll-in-course', authenticateUserToken, async (req, res) => {
	try {
		const library = req.body;
		const userCourse = await pool.query(
			'INSERT INTO user_library (user_id, course_id, course_title, course_description, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[library.user_id, library.course_id, library.course_title, library.course_description, new Date()]
		);

		let feedback = {
			message: 'Successful',
			data: userCourse.rows[0],
		};
		res.json(feedback);
	} catch (err) {
		console.error(err.message);
	}
});

// Enables user to remove a course from their library
router.delete('/cancel-enrollment/:id', authenticateUserToken, async (req, res) => {
	try {
		const { id } = req.params;
		const deleteCourse = await pool.query('DELETE FROM user_library WHERE library_id = $1', [id]);
		res.json('Course was removed from library successfully');
	} catch (err) {
		console.error(err.message);
	}
});

// Create middleware to Check user token validity
function authenticateUserToken(req, res, next) {
	const autheHeader = req.headers['authorization'];
	// if authHeader is not null, return token or else return undefined
	const token = autheHeader && autheHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (err, user) => {
		// 403: we see that you have a token but this token is no longer valid so you no longer have access
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

module.exports = router;
