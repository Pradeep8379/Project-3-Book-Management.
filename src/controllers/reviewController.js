const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");
const {
  isValidId,
  isValidRating,
  isValidName,
  isValid,
} = require("../validation/validation");
const today = new Date();

const postReview = async function (req, res) {
  try {
    const requestBody = req.body;
    // checking if request body is empty.
    if (Object.keys(requestBody) == 0) {
      return res
        .status(400)
        .send({ status: false, Message: "send details to add a review..." });
    }

    // checking if bookId is valid and present.
    const bookId = req.params.bookId;
    if (bookId && !isValidId(bookId)) {
      return res
        .status(400)
        .send({ status: false, Message: "Invalid Book Id..." });
    }
    if (bookId) {
      const noBookId = await bookModel.findOne({
        _id: bookId,
        isDeleted: false,
      });
      if (!noBookId) {
        return res
          .status(400)
          .send({ status: false, Message: "Book Does Not exists..." });
      }
    }
    // destructuring of request Body
    const { review, rating, reviewedBy } = requestBody;

    // checking Mandatory feilds
    if (!review) {
      return res
        .status(400)
        .send({ status: false, Message: "Please Enter a Review..." });
    }

    if (!rating) {
      return res
        .status(400)
        .send({ status: false, Message: "Please Give ratings..." });
    }
    // if reviewedBy not given adding guest key
    if (!reviewedBy) {
      requestBody.reviewedBy = "Guest";
    }
    //    rating validation.
    if (!isValidRating(rating)) {
      return res.status(400).send({
        status: false,
        Message:
          "Please Enter a Valid Rating Between 1 to 5 with No Decimal Places ...",
      });
    }
    // Name validation.
    if (reviewedBy) {
      if (!isValidName(reviewedBy)) {
        return res
          .status(400)
          .send({ status: false, Message: "Enter a Valid Name..." });
      }
      // adding reviewedBy
      requestBody.reviewedBy = reviewedBy; 
    }
    // adding reviewedBy and bookId.
    requestBody.bookId = bookId;

    // creating review
    // const createReview = await reviewModel.create(requestBody)
    let createReview = await reviewModel.create(requestBody);
    const findReview =await reviewModel.findOne(createReview).select({updatedAt:0,createdAt:0,__v:0}).populate("bookId")
    // createReview = JSON.parse(JSON.stringify(createReview));
    // ["createdAt", "updatedAt", "__v"].forEach(
    //   (ele) => delete createReview._doc[ele]
    // );

    // increasing reviews by 1.
    await bookModel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: 1 } }
    );

    return res.status(201).send({
      status: true,
      message: "Review Added successfully",
      data: findReview,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};





const updateReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;
    const requestBody = req.body;
    const { reviews, rating, reviewedBy } = requestBody;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is mandatory" });
    }

    if (!isValidId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: `${bookId} is not valid book Id` });
    }

    const findBookId = await bookModel.findById({
      _id: bookId,
      isDeleted: false,
    });

    if (!findBookId) {
      return res
        .status(404)
        .send({ status: false, message: "this bookId doesn't exists" });
    }

    if (!reviewId) {
      return res
        .send(400)
        .send({ status: false, message: "reviewId is mandatory" });
    }

    if (!isValidId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: `${reviewId} is not valid review Id` });
    }

    const findReviewId = await reviewModel.findById({
      _id: reviewId,
      isDeleted: false,
    });

    if (!findReviewId) {
      return res
        .status(404)
        .send({ status: false, message: "this reviewId doesn't exists" });
    }

    if (Object.keys(requestBody).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Data is required for updating review details...",
      });
    }

    if (rating && !isValidRating(rating)) {
      return res
        .status(400)
        .send({ status: false, message: "provide rating for updates between 1 to 5" });
    }

    if (reviewedBy && !isValidName(reviewedBy)) {
      return res
        .status(400)
        .send({ status: false, message: "provide reviewBy for updates" });
    }

    if (reviews && !isValid(reviews)) {
      return res
        .status(400)
        .send({ status: false, message: "provide reviews for updates" });
    }

    const updateReviewData = await reviewModel.findByIdAndUpdate(
      { bookId: bookId, _id: reviewId, isDeleted: false },
      { $set: { reviews, rating, reviewedBy } },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "updated successfully",
      data: updateReviewData,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};



const deleteReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is mandatory" });
    }
    //bookId Validation
    if (!isValidId(bookId)) {
      return res.status(400).send({ status: false, msg: "bookId is invalid" });
    }

    if (!reviewId) {
      return res
        .send(400)
        .send({ status: false, message: "reviewId is mandatory" });
    }

    // reviewId validation
    if (!isValidId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, msg: "reviewId is invalid" });
    }

    // bookId matching with book model and is deleted must be false
    const bookDetails = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!bookDetails ) {
      return res.status(400).send({ status: false, msg: "Book not found " });
    }

    // reviewId matching with review model and is deleted must be false
    const reviewDetails = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });
    if (!reviewDetails ) {
      return res.status(400).send({ status: false, msg: "Review not found " });
    }

    //update with is deleted key to  true
    let deleteReview = await reviewModel.updateOne({
      $set: { isDeleted: true },
    });

    await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } });
    res.status(200).send({
      status: true,
      message: "deleted successfully",
      data: deleteReview,
    });

  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { postReview, updateReview, deleteReview };
