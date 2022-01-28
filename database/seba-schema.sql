/*
--------------------------------------------------------------------
MySQL database schema for lo-fi society Discord server
Used by Google Form script and Discord bot for member verification
--------------------------------------------------------------------
Discord bot:    https://github.com/mtsev/seba
Google script:  https://github.com/mtsev/seba-form-script
--------------------------------------------------------------------
Author:         Mandy Tao
Version:        1.2
--------------------------------------------------------------------
*/

SET NAMES utf8mb4;

-- create table for form submissions
CREATE TABLE IF NOT EXISTS submissions (
    submission_id   SMALLINT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
    added_on        DATETIME            DEFAULT CURRENT_TIMESTAMP,
    discord_name    VARCHAR (50)        NOT NULL,
    real_name       VARCHAR (50)        NOT NULL,
    email_address   VARCHAR (50)        NOT NULL,
    zid             CHAR (8),
    phone_number    VARCHAR (10)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- create table to for verified members
CREATE TABLE IF NOT EXISTS verified_members (
    member_id       SMALLINT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
    discord_id      VARCHAR (20)        NOT NULL,
    submission      SMALLINT UNSIGNED   NOT NULL,

    FOREIGN KEY (submission) REFERENCES submissions(submission_id) ON UPDATE CASCADE,

    UNIQUE (discord_id),
    UNIQUE (submission)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- create table to track username changes
CREATE TABLE IF NOT EXISTS username_history (
    name_id         SMALLINT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
    modified        DATETIME            DEFAULT CURRENT_TIMESTAMP,
    username        VARCHAR (20)        NOT NULL,
    discriminator   CHAR (4)            NOT NULL,
    discord_id      VARCHAR (20)        NOT NULL,

    FOREIGN KEY (discord_id) REFERENCES verified_members(discord_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
