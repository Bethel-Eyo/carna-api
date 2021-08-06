CREATE DATABASE carnadb;

-- \c into todo_database

CREATE TABLE admins(
  admin_id SERIAL PRIMARY KEY,
  name VARCHAR(70),
  username VARCHAR(70),
  password VARCHAR(255),
  createdAt VARCHAR(70)
  UNIQUE(username)
);

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(70),
  username VARCHAR(70),
  password VARCHAR(255),
  country VARCHAR(70),
  city VARCHAR(70),
  createdAt VARCHAR(70)
  UNIQUE(username)
);

CREATE TABLE courses(
  course_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  createdAt VARCHAR(70),
  description VARCHAR(255)
  UNIQUE(title)
);

CREATE TABLE user_library(
  library_id SERIAL PRIMARY KEY,
  user_id INT,
  course_id INT,
  course_title VARCHAR(255),
  course_description VARCHAR(255),
  createdAt VARCHAR(70),
      FOREIGN KEY(user_id)
        REFERENCES users(user_id),
  CONSTRAINT fk_course
      FOREIGN KEY(course_id)
        REFERENCES courses(course_id)  
);
