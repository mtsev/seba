/*
--------------------------------------------------------------------
MySQL database schema for lo-fi society Discord server
Used by Google Form script and Discord bot for member verification
--------------------------------------------------------------------
Discord bot:    https://github.com/mtsev/seba
Google script:  https://github.com/mtsev/seba-form-script
--------------------------------------------------------------------
Author:         Mandy Tao
Version:        1.0
--------------------------------------------------------------------
*/

-- create table for form submissions
CREATE TABLE submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME,
    discord_name VARCHAR (50) NOT NULL,
    real_name VARCHAR (50) NOT NULL,
    email_address VARCHAR (50) NOT NULL,
    zid VARCHAR (8),
    phone_number VARCHAR (10)
);

-- create table for verified members
CREATE TABLE verified_members (
    verified_member_id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR (20) NOT NULL,
    submission_id INT,
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id),
    UNIQUE (discord_id)
);
