// a. Import the sqlite3 package
const sqlite3 = require("sqlite3").verbose();

// b. Create a new sqlite3 database called university.db
const db = new sqlite3.Database("./university.db", (err) => {
  if (err) {
    console.error("Error creating/opening university.db:", err.message);
  } else {
    console.log("Connected to university.db");
  }
});

// c. Define a courses table using SQL CREATE TABLE
const createCoursesTableSQL = `
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT NOT NULL,
    title TEXT NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT,
    semester TEXT NOT NULL
  );
`;

// Run the CREATE TABLE command
db.serialize(() => {
  db.run(createCoursesTableSQL, (err) => {
    if (err) {
      console.error("Error creating courses table:", err.message);
    } else {
      console.log("Courses table successfully created.");
    }
  });

  // d. Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database connection:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
