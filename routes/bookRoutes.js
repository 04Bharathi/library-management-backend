const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { borrowBook, returnBook } = require("../controllers/borrowController");

router.post("/", verifyToken, authorizeRoles("librarian"), addBook);
router.post("/:id/borrow", verifyToken, authorizeRoles("member"), borrowBook)
router.post("/:id/return", verifyToken, authorizeRoles("member"), returnBook)
router.put("/:id", verifyToken, authorizeRoles("librarian"), updateBook);
router.delete("/:id", verifyToken, authorizeRoles("librarian"), deleteBook);

router.get("/", verifyToken, getBooks);
router.get("/:id", verifyToken, getBookById);

module.exports = router;
