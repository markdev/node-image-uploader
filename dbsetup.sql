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
	banner varchar(40),
	rules text,
	deadline datetime,
	judging enum('public', 'invite'),
	competition enum('public', 'invite'),
	FOREIGN KEY (uId) REFERENCES users(id)
);

CREATE TABLE entries (
	id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	uId int,
	cId int,
	picture varchar(40),
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

CREATE TABLE userRelations (
	uId int,
	cId int,
	relationship enum('creator', 'judge', 'competitor'),
	FOREIGN KEY (uId) REFERENCES users(id),
	FOREIGN KEY (cId) REFERENCES contests(id)
);


INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ('mark.karavan@gmail.com', 'ea82410c7a9991816b5eeeebe195e20a', '', 'male', '1983-04-07 18:34:00', NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ('david@hadden.com', '1610838743cc90e3e4fdda748282d9b8', '', 'male', '1964-04-07 18:34:00', NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ('chris@acciavatti.com', '6b34fe24ac2ff8103f6fce1f0da2ef57', '', 'male', '1983-07-07 15:23:00', NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("a@a.com", "0cc175b9c0f1b6a831c399e269772661", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("b@b.com", "92eb5ffee6ae2fec3ad71c777531578f", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("c@c.com", "4a8a08f09d37b73795649038408b5f33", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("d@d.com", "8277e0910d750195b448797616e091ad", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("e@e.com", "e1671797c52e15f763380b45e841ec32", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("f@f.com", "8fa14cdd754f91cc6554c9e71929cce7", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("g@g.com", "b2f5ff47436671b6e533d8dc3614845d", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("h@h.com", "2510c39011c5be704182423e3a695e91", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("i@i.com", "865c0c0b4ab0e063e5caa3387c1a8741", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("j@j.com", "363b122c528f54df4a0446b6bab05515", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("k@k.com", "8ce4b16b22b58894aa86c421e8759df3", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("l@l.com", "2db95e8e1a9267b7a1188556b2013b33", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("m@m.com", "6f8f57715090da2632453988d9a1501b", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("n@n.com", "7b8b965ad4bca0e41ab51de7b31363a1", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("o@o.com", "d95679752134a2d9eb61dbd7b91c4bcc", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("p@p.com", "83878c91171338902e0fe0fb97a8c47a", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("q@q.com", "7694f4a66316e53c8cdd9d9954bd611d", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("r@r.com", "4b43b0aee35624cd95b910189b3dc231", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("s@s.com", "03c7c0ace395d80182db07ae2c30f034", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("t@t.com", "e358efa489f58062f10dd7316b65649e", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("u@u.com", "7b774effe4a349c6dd82ad4f4f21d34c", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("v@v.com", "9e3669d19b675bd57058fd4664205d2a", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("w@w.com", "f1290186a5d0b1ceab27f4e77c0c5d68", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("y@y.com", "415290769594460e2e485922904f345d", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("x@x.com", "9dd4e461268c8034f5c8564e155c67a6", "", "male", "1983-04-07 18:34:00", NOW());
INSERT INTO users (email, password, avatar, sex, dob, createdOn) VALUES ("z@z.com", "fbade9e36a3f36d3d676c1b808451dd7", "", "male", "1983-04-07 18:34:00", NOW());



INSERT INTO contests (uId, title, banner, rules, deadline, judging, competition) VALUES (1, "Whiteboard Pics", "c557cba6b28660921bc4f66c914ada62.jpg", "Must be an original whiteboard pic", "2014-11-05 12:00:00", "public", "public");



INSERT INTO userRelations (uId, cId, relationship) VALUES (4, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (5, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (6, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (7, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (8, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (9, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (10, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (11, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (12, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (13, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (14, 1, 'competitor');
INSERT INTO userRelations (uId, cId, relationship) VALUES (15, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (16, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (17, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (18, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (19, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (20, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (21, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (22, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (23, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (24, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (25, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (26, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (27, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (28, 1, 'judge');
INSERT INTO userRelations (uId, cId, relationship) VALUES (29, 1, 'judge');
