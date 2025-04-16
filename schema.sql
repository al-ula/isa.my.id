-- Drop the tables if they already exist
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Authors;

-- Create the Authors table first
CREATE TABLE IF NOT EXISTS Authors (
    AuthorId INTEGER PRIMARY KEY,
    Name TEXT NOT NULL
);

-- Create the Posts table with a foreign key reference to Authors
CREATE TABLE IF NOT EXISTS Posts (
    PostId TEXT PRIMARY KEY,
    Title TEXT NOT NULL,
    ContentUrl TEXT NOT NULL,
    PostDate TEXT NOT NULL,
    AuthorId INTEGER NOT NULL,
    FOREIGN KEY (AuthorId) REFERENCES Authors(AuthorId)
);

INSERT INTO Authors (AuthorId, Name)
VALUES (1, 'Isa Al Ula');

-- Insert sample posts for the author
-- INSERT INTO Posts (PostId, Title, Content, PostDate, AuthorId)
-- VALUES
--     ('1', 'Hello World', 'Hello World', '2025-02-18', 1),
--     ('2', 'Hello World 2', 'Hello World 2', '2025-02-18', 1),
--     ('4', 'Hello World 3', 'Hello World 3', '2025-02-18', 1);
