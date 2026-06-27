const connection = require("../config/db");

// Get All Members
const getMembers = (req, res) => {
  connection.query(
    `SELECT
            id,
            name,
            email,
            created_at
        FROM users
        WHERE role='member'`,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        members: results,
      });
    },
  );
};

// Delete Member
const deleteMember = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Member ID",
    });
  }

  connection.query(
    `SELECT *
        FROM borrow_records
        WHERE user_id=?
        AND status='borrowed'`,
    [id],
    (err, records) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (records.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Member has borrowed books.",
        });
      }

      connection.query(
        "DELETE FROM users WHERE id=? AND role='member'",
        [id],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "Member not found.",
            });
          }

          res.json({
            success: true,
            message: "Member deleted successfully.",
          });
        },
      );
    },
  );
};

module.exports = {
  getMembers,
  deleteMember,
};
