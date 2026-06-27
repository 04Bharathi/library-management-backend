const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { getMembers, deleteMember } = require("../controllers/memberController");
const { myBorrowHistory } = require("../controllers/borrowController");

router.get("/", verifyToken, authorizeRoles("librarian"), getMembers);
router.get("/me/books", verifyToken, authorizeRoles("member"), myBorrowHistory)

router.delete("/:id", verifyToken, authorizeRoles("librarian"), deleteMember);

module.exports = router;
