const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController")
const commonMW = require("../middleware/auth");


// USER API
// register user route
router.post("/register", userController.createUser);
// login user
router.post("/login", userController.userLogin);


//BOOK API
//  create a book
router.post("/books", commonMW.authenticate, bookController.createBook);
// Get Books
router.get("/books", commonMW.authenticate, bookController.getBooks);
// GET One Book
router.get("/books/:bookId", commonMW.authenticate, bookController.getBookById);
// Update Book
router.put("/books/:bookId", commonMW.authenticate, bookController.updateBooks);
// Delete Book
router.delete("/books/:bookId", commonMW.authenticate, bookController.deleteBook);


// Review API
// Create Review
router.post("/books/:bookId/review", reviewController.postReview)
// Update review
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)
// Delete review
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)

// router.all("/*", function (req, res) {
//   res.status(400).send({
//     status: false,
//     message: "The api you request is not available",
//   });
// });

module.exports = router;
