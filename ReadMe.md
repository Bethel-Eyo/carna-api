## Overview

I created an API that provides data to both a web-based admin app(which was built using react). and a mobile app(which was built using react native).

The technology that was used to build the api is node.js and the framework used is express.js

The API provides endpoints that enables the admin to carry out the following functionalities from the web app.
1. Create User.
2. Update User.
3. Get All Users.
4. Delete User.
5. Create Course.
6. Update Course.
7. Get All Courses.
8. Delete Course.
9. Admin authentication using JWT.

The API also provides endpoints that allows the User to carry out the following functionalities from the mobile app.
1. User Authentication using JWT.
2. Get list of all courses.
3. Enroll in a course.
4. Get list of all courses in their user_library.
5. Cancel Enrollment.

## Database Setup
The DBMS that was used with the api is PostgreSQL. (A relational database) - Originally, I am used to using mongodb with express.js but I decided to try out PostgreSQL since that was the preferred technology in the project requirement for the DBMS and I also have a good knowledge of working with SQL and relational databases having worked extensively with Laravel.

Four different tables were created namely.
1. The admins table.
2. The users table.
3. The courses table.
4. The user_library table.

The user_library table contains the course_id, user_id, course_title and course_description.

A database.sql file is included in the root folder of the project to give the reviewer a rough sketch of how the database the schemas and its attributes are structured.

## Authentication

This can be broken down into 4 sections namely:
1. User registration.
2. User Login.
3. Admin registration.
4. Admin Login.

1. User registration.
This includes the endpoint that enables the user to create a new account on the system.
Endpoint: http://localhost:5000/register-user - POST
body-params: name, username, password, city, country

2. User Login
Endpoint: http://localhost:5000/user-login - POST
body-params: username, password

3. Admin registration
Endpoint: http://localhost:5000/register-admin - POST
body-params: name, username, password

4. Admin Login
Endpoint: http://localhost:5000/admin-login - POST
body-params: name, username, password

## Admin User CRUD
1. Create User
Endpoint: http://localhost:5000/register-user - POST
body-params: name, username, password, city, country

2. Update User
Endpoint: http://localhost:5000/admin/update-user - PUT
body-params: name, username, password, city, country, user_id
Authorization: Bearer token

3. Get all Users
Endpoint: http://localhost:5000/admin/get-all-users - GET
Authorization: Bearer token

4. Delete User
Endpoint: http://localhost:5000/admin/delete-user/:id - DEL
Authorization: Bearer token

## Admin Course CRUD
1. Create Course
Endpoint: http://localhost:5000/admin/create-course - POST
body-params: title, description
Authorization: Bearer token

2. Update Course
Endpoint: http://localhost:5000/admin/update-course - PUT
body-params: title, description, course_id
Authorization: Bearer token

3. Get all Coursess
Endpoint: http://localhost:5000/admin/get-all-courses - GET
Authorization: Bearer token

4. Delete Course
Endpoint: http://localhost:5000/admin/delete-user/:id - DEL
Authorization: Bearer token

## User Enrollment features
1. Enroll in Course.
Endpoint: http://localhost:5000/users/enroll-in-course - POST
body-params: course_id, user_id, course_title, course_description
Authorization: Bearer token

2. Cancel Enrollment.
Endpoint: http://localhost:5000/users/cancel-enrollment/:id - DEL
Authorization: Bearer token

3. Get Courses in user-library
Endpoint: http://localhost:5000/users/get-enrolled-courses/:id - GET
Authorization: Bearer token

4. Get all Coursess
Endpoint: http://localhost:5000/users/get-all-courses - GET
Authorization: Bearer token

## Automated Tests.

I used the mocha library for the api testing and chai library for the assertions.
you can find the test file in test > api.test.js
It tests and passes the 15 endpoints ensuring that all the desired responses are gotten.

You can run the test using - npm test.