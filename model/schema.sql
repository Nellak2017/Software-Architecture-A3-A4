-- Schema is changed to work with MySQL (See Github for prior version that works for SQLite)
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS microminerDatabase;

-- Use the database
USE microminerDatabase;

-- Table to store circular shift strings
CREATE TABLE IF NOT EXISTS CircularShift (
    id INT AUTO_INCREMENT PRIMARY KEY,
    input TEXT NOT NULL,
    value TEXT NOT NULL
);