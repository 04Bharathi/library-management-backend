const connection = require("../config/db");

// Borrow Book
const borrowBook = (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  // if (!Number.isInteger(bookId) || bookId <= 0) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Invalid Book ID.",
  //   });
  // }

  connection.query(
    "SELECT * FROM books WHERE id = ?",
    [bookId],
    (err, bookResult) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      if (bookResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Book not found.",
        });
      }

      const book = bookResult[0];

      if (book.availableQuantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Book is currently unavailable.",
        });
      }

      connection.query(
        `SELECT id
                 FROM borrow_records
                 WHERE user_id = ?
                 AND book_id = ?
                 AND status = 'borrowed'`,
        [userId, bookId],
        (err, borrowResult) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: err.message });

          if (borrowResult.length > 0) {
            return res.status(400).json({
              success: false,
              message:
                "You have already borrowed this book. Return it before borrowing again.",
            });
          }

          // Insert borrow record
          connection.query(
            `INSERT INTO borrow_records
                    (user_id, book_id, borrow_date, status)
                    VALUES (?, ?, CURDATE(), "borrowed")`,
            [userId, bookId],
            (err) => {
              if (err)
                return res
                  .status(500)
                  .json({ success: false, message: err.message });

              // Update available quantity
              connection.query(
                `UPDATE books
                         SET availableQuantity = availableQuantity - 1
                         WHERE id = ?`,
                [bookId],
                (err) => {
                  if (err)
                    return res.status(500).json({
                      success: false,
                      message: err.message,
                    });

                  res.status(201).json({
                    success: true,
                    message: "Book borrowed successfully.",
                  });
                },
              );
            },
          );
        },
      );
    },
  );
};

const returnBook = (req, res) => {
  const userId = req.user.id;
  const borrowId  = req.params.id;

  connection.query(
    `SELECT * FROM borrow_records
     WHERE id = ? AND user_id = ?`,
    [borrowId, userId],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: err.message,
        });

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Borrow record not found.",
        });
      }

      const record = results[0];

      if (record.status === "returned") {
        return res.status(400).json({
          success: false,
          message: "Book has already been returned.",
        });
      }

      connection.query(
        `UPDATE borrow_records
         SET status='returned',
             return_date = CURDATE()
         WHERE id = ?`,
        [borrowId],
        (err) => {
          if (err)
            return res.status(500).json({
              success: false,
              message: err.message,
            });

          connection.query(
            `UPDATE books
             SET availableQuantity = availableQuantity + 1
             WHERE id = ?`,
            [record.book_id],
            (err) => {
              if (err)
                return res.status(500).json({
                  success: false,
                  message: err.message,
                });

              res.json({
                success: true,
                message: "Book returned successfully.",
              });
            },
          );
        },
      );
    },
  );
};

const myBorrowHistory = (req, res) => {
  connection.query(
    `SELECT
      br.id,
      b.title,
      b.author,
      br.borrow_date,
      br.return_date,
      br.status
    FROM borrow_records br
    JOIN books b ON br.book_id = b.id
    WHERE br.user_id = ?
    ORDER BY br.borrow_date DESC`,
    [req.user.id],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: err.message,
        });

      res.json({
        success: true,
        borrowHistory: results,
      });
    },
  );
};

const getAllBorrowRecords = (req, res) => {
  connection.query(
    `SELECT
      br.id,
      u.name AS memberName,
      u.email,
      b.title,
      b.author,
      br.borrow_date,
      br.return_date,
      br.status
    FROM borrow_records br
    JOIN users u ON br.user_id = u.id
    JOIN books b ON br.book_id = b.id
    ORDER BY br.borrow_date DESC`,
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: err.message,
        });

      res.json({
        success: true,
        records: results,
      });
    },
  );
};

module.exports = {
  borrowBook,
  returnBook,
  myBorrowHistory,
  getAllBorrowRecords,
};
