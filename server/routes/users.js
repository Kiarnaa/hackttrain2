const express = require("express");
const { body } = require("express-validator");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, getUserById);

router.put(
  "/:id",
  protect,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
  ],
  updateUser
);

router.delete("/:id", protect, deleteUser);

module.exports = router;
