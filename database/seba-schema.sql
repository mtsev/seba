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

SET NAMES utf8mb4;

-- create table for form submissions
CREATE TABLE submissions (
    submission_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    discord_name VARCHAR (50) NOT NULL,
    real_name VARCHAR (50) NOT NULL,
    email_address VARCHAR (50) NOT NULL,
    zid VARCHAR (8),
    phone_number VARCHAR (10)
) DEFAULT CHARSET=utf8mb4;

-- create table to for verified members
CREATE TABLE verified_members (
    member_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR (20) NOT NULL,
    submission SMALLINT UNSIGNED NOT NULL,
    FOREIGN KEY (submission) REFERENCES submissions(submission_id) ON UPDATE CASCADE,
    UNIQUE (discord_id),
    UNIQUE (submission)
) DEFAULT CHARSET=utf8mb4;

-- create table to track username changes
CREATE TABLE username_history (
    name_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR (20) NOT NULL,
    discrimminator VARCHAR (4) NOT NULL,
    discord_id VARCHAR (20) NOT NULL
) DEFAULT CHARSET=utf8mb4;
