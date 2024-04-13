-- schema.sql

-- Table to store circular shift strings
CREATE TABLE CircularShift (
    id INTEGER PRIMARY KEY,
	input TEXT NOT NULL,
    value TEXT NOT NULL
);