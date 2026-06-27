const connection = require("../config/db");

// Add Book
const addBook = (req, res) => {
  const { title, author, isbn, category, quantity } = req.body;

  if (!title || !author || !isbn || !category || !quantity) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (quantity < 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity cannot be negative.",
    });
  }

  const sql = `
        INSERT INTO books
        (title, author, isbn, category, quantity, availableQuantity)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  connection.query(
    sql,
    [title, author, isbn, category, quantity, quantity],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Book added successfully",
      });
    },
  );
};

// Get All Books
const getBooks = (req, res) => {
  connection.query("SELECT * FROM books", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.status(200).json({
      success: true,
      books: results,
    });
  });
};

// Get Book By ID
const getBookById = (req, res) => {
  const { id } = req.params;

  connection.query("SELECT * FROM books WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book: results[0],
    });
  });
};

// Update Book
const updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, category, quantity, availableQuantity } =
    req.body;

  if (quantity < 0 || availableQuantity < 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity cannot be negative.",
    });
  }

  const sql = `
        UPDATE books
        SET
            title = ?,
            author = ?,
            isbn = ?,
            category = ?,
            quantity = ?,
            availableQuantity = ?
        WHERE id = ?
    `;

  connection.query(
    sql,
    [title, author, isbn, category, quantity, availableQuantity, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Book updated successfully",
      });
    },
  );
};

const deleteBook = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Book ID",
    });
  }

  connection.query(
    `SELECT *
        FROM borrow_records
        WHERE book_id=?
        AND status='borrowed'`,
    [id],
    (err, borrowed) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (borrowed.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Book cannot be deleted because it is currently borrowed.",
        });
      }

      connection.query("DELETE FROM books WHERE id=?", [id], (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Book not found.",
          });
        }

        res.json({
          success: true,
          message: "Book deleted successfully.",
        });
      });
    },
  );
};

module.exports = {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
