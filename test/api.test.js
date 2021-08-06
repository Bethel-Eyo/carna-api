const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

// Assertion style
chai.should();
chai.use(chaiHttp);

describe('Users Endpoint', () => {
	// 1. Test user log in - POST
	describe('POST /user-login', () => {
		it('It should log user in', (done) => {
			let data = {
				username: 'kai29',
				password: 'password',
			};
			chai.request(server)
				.post('/user-login')
				.send(data)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	// 2. Test unauthenticated attempt to hit endpoint
	describe('GET /users/get-all-courses', () => {
		it('It should return a 401 since no header is passed', (done) => {
			chai.request(server)
				.get('/users/get-all-courses')
				.end((err, response) => {
					response.should.have.status(401);
					// response.body.should.be.a('array');
					done();
				});
		});
	});

	// Initial values
	var token = '';
	var userId = 1;
	var courseId = 1;
	var libraryId = 1;

	before((done) => {
		let data = {
			username: 'kai29',
			password: 'password',
		};
		chai.request(server)
			.post('/user-login')
			.send(data)
			.end((err, response) => {
				response.should.have.status(200);
				token = response.body.token;
				userId = response.body.user.user_id;
				done();
			});
	});

	// 3. Test authorised get all courses endpoint
	it('It should return data since the header is passed', (done) => {
		chai.request(server)
			.get('/users/get-all-courses')
			.set('Authorization', 'Bearer ' + token)
			.end((err, response) => {
				// set course Id
				courseId = response.body[0].course_id;
				response.should.have.status(200);
				response.body.should.be.a('array');
				done();
			});
	});

	// 4. Test Get enrolled courses - GET
	describe('GET /users/get-enrolled-courses/:id', () => {
		it('enrolled courses should return array of data', (done) => {
			chai.request(server)
				.get('/users/get-enrolled-courses/' + userId)
				.set('Authorization', 'Bearer ' + token)
				.end((err, response) => {
					response.should.have.status(200);
					response.body.should.be.a('array');
					libraryId = response.body[0].library_id;
					done();
				});
		});
	});

	// 5. Test Add course to library - POST
	describe('POST /users/enroll-in-course', () => {
		it('should be able to enroll in a new course', (done) => {
			let data = {
				course_title: 'German',
				course_description: 'The native language of the German machines',
				user_id: userId,
				course_id: courseId,
			};
			chai.request(server)
				.post('/users/enroll-in-course')
				.set('Authorization', 'Bearer ' + token)
				.send(data)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	// 6. Test Cancel Enrollment - DELETE
	describe('DEL /users/cancel-enrollment/:id', () => {
		it("should delete a course from user's library", (done) => {
			chai.request(server)
				.delete('/users/cancel-enrollment/' + libraryId)
				.set('Authorization', 'Bearer ' + token)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});
});

describe('Admins Endpoints', () => {
	// 1. Test Admin login - POST
	describe('POST /admin-login', () => {
		it('It should log admin in', (done) => {
			let data = {
				username: 'betheleyo',
				password: 'password',
			};
			chai.request(server)
				.post('/admin-login')
				.send(data)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	//2. Test Admin Create User - POST
	describe('POST /register-user', () => {
		it('It should create a new user', (done) => {
			let data = {
				username: 'kurtzouma',
				password: 'password',
				city: 'Miami',
				country: 'USA',
				name: 'Kurt Zouma',
			};
			chai.request(server)
				.post('/register-user')
				.send(data)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	let token = '';
	let courseId = 1;
	let userId = 1;

	before((done) => {
		let data = {
			username: 'betheleyo',
			password: 'password',
		};
		chai.request(server)
			.post('/admin-login')
			.send(data)
			.end((err, response) => {
				response.should.have.status(200);
				token = response.body.token;
				done();
			});
	});

	//3. Test Admin Update User - PUT
	describe('PUT /admin/update-user', () => {
		it('It should update a new user', (done) => {
			let data = {
				username: 'kurtzouma23',
				password: 'password',
				city: 'Miami',
				country: 'USA',
				name: 'Kurt Zouma',
			};
			chai.request(server)
				.put('/admin/update-user')
				.set('Authorization', 'Bearer ' + token)
				.send(data)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	})

	//4. Test Admin Get All Users - GET
	it('It should return a list of all users', (done) => {
		chai.request(server)
			.get('/admin/get-all-users')
			.set('Authorization', 'Bearer ' + token)
			.end((err, response) => {
				response.should.have.status(200);
				userId = response.body[0].user_id;
				response.body.should.be.a('array');
				done();
			});
	});

	//5. Test Admin Delete User - DEl
	describe('DEL /admin/delete-user/:id', () => {
		it("should delete a course from user's library", (done) => {
			chai.request(server)
				.delete('/admin/delete-user/' + userId)
				.set('Authorization', 'Bearer ' + token)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	//6. Test Admin Create Course - POST
	describe('POST /admin/create-course', () => {
		it('It should log user in', (done) => {
			let data = {
				title: 'Yoruba',
				description: 'The native language of western nigerians',
			};
			chai.request(server)
				.post('/admin/create-course')
				.set('Authorization', 'Bearer ' + token)
				.send(data)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	//7. Test Admin Update Course - PUT
	describe('POST /admin/update-course', () => {
		it('It should log user in', (done) => {
			let data = {
				title: 'Yorubani',
				description: 'The native language of western nigerians',
			};
			chai.request(server)
				.put('/admin/update-course')
				.set('Authorization', 'Bearer ' + token)
				.send(data)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	//8. Test Admin Get All Courses - GET
	it('It should return all courses data', (done) => {
		chai.request(server)
			.get('/admin/get-all-courses')
			.set('Authorization', 'Bearer ' + token)
			.end((err, response) => {
				// set course Id
				courseId = response.body[0].course_id;
				response.should.have.status(200);
				response.body.should.be.a('array');
				done();
			});
	});

	//9. Test Admin Delete Course - DEl
	describe('DEL /admin/delete-course/:id', () => {
		it("should delete a course from user's library", (done) => {
			chai.request(server)
				.delete('/admin/delete-course/' + courseId)
				.set('Authorization', 'Bearer ' + token)
				.end((err, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});
});
