const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./university.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to university.db from server.js");
  }
});

/**
 * GET /api/courses
 * Return all courses
 */
app.get("/api/courses", (req, res) => {
  const sql = "SELECT * FROM courses";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching courses:", err.message);
      return res.status(500).json({ error: "Failed to fetch courses" });
    }
    res.json(rows);
  });
});

/**
 * GET /api/courses/:id
 * Return a single course by id
 */
app.get("/api/courses/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM courses WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching course:", err.message);
      return res.status(500).json({ error: "Failed to fetch course" });
    }
    if (!row) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(row);
  });
});

/**
 * POST /api/courses
 * Create a new course
 */
app.post("/api/courses", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  // Minimal validation
  if (!courseCode || !title || !credits || !semester) {
    return res
      .status(400)
      .json({ error: "courseCode, title, credits, and semester are required" });
  }

  const sql = `
    INSERT INTO courses (courseCode, title, credits, description, semester)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [courseCode, title, credits, description || "", semester],
    function (err) {
      if (err) {
        console.error("Error inserting course:", err.message);
        return res.status(500).json({ error: "Failed to create course" });
      }

      // this.lastID gives id of inserted row
      res.status(201).json({
        id: this.lastID,
        courseCode,
        title,
        credits,
        description: description || "",
        semester,
      });
    }
  );
});

/**
 * PUT /api/courses/:id
 * Update an existing course
 */
app.put("/api/courses/:id", (req, res) => {
  const { id } = req.params;
  const { courseCode, title, credits, description, semester } = req.body;

  if (!courseCode || !title || !credits || !semester) {
    return res
      .status(400)
      .json({ error: "courseCode, title, credits, and semester are required" });
  }

  const sql = `
    UPDATE courses
    SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [courseCode, title, credits, description || "", semester, id],
    function (err) {
      if (err) {
        console.error("Error updating course:", err.message);
        return res.status(500).json({ error: "Failed to update course" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({
        id: Number(id),
        courseCode,
        title,
        credits,
        description: description || "",
        semester,
      });
    }
  );
});

/**
 * DELETE /api/courses/:id
 * Delete a course
 */
app.delete("/api/courses/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM courses WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Error deleting course:", err.message);
      return res.status(500).json({ error: "Failed to delete course" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // 204 = No Content
    res.status(204).send();
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
