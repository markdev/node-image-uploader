DROP DATABASE IF EXISTS sunzora1;

CREATE DATABASE sunzora1;

USE sunzora1;

CREATE TABLE users (
	id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	email varchar(40),
	password varchar(40),
	avatar varchar(40),
	sex enum('male', 'female', 'other'),
	dob datetime,
	createdOn datetime
);

CREATE TABLE contests (
	id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	uId int,
	title varchar(40),
	banner varchar(12),
	rules text,
	deadline datetime,
	judging tinyint,
	competition tinyint,
	FOREIGN KEY (uId) REFERENCES users(id)
);

CREATE TABLE entries (
	id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	uId int,
	cId int,
	picture varchar(12),
	uploadTime datetime,
	FOREIGN KEY (uId) REFERENCES users(id),
	FOREIGN KEY (cId) REFERENCES contests(id)
);

CREATE TABLE messages (
	id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	senderId int,
	recipId int,
	content text,
	sentOn datetime,
	seen tinyint,
	FOREIGN KEY (senderId) REFERENCES users(id),
	FOREIGN KEY (recipId) REFERENCES users(id)
);

CREATE TABLE judges (
	uId int,
	cId int,
	eId int,
	rating int,
	judgedOn datetime,
	FOREIGN KEY (uId) REFERENCES users(id),
	FOREIGN KEY (cId) REFERENCES contests(id),
	FOREIGN KEY (eId) REFERENCES entries(id)
);

CREATE TABLE tags (
	id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	content varchar(40)
);

CREATE TABLE tagAssociations (
	tId int,
	cId int,
	FOREIGN KEY (tId) REFERENCES tags(id),
	FOREIGN KEY (cId) REFERENCES contests(id)
);


INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ('mark.karavan@gmail.com', 'ea82410c7a9991816b5eeeebe195e20a', '', 'male', '1983-04-07 18:34:00', NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ('david@hadden.com', '1610838743cc90e3e4fdda748282d9b8', '', 'male', '1964-04-07 18:34:00', NOW());
