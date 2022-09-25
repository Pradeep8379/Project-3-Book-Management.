const { isValidObjectId } = require("mongoose");
const bookModel = require("../models/bookModel.js");
const reviewModel = require("../models/reviewModel.js");

const validator = require("../utils/validator");
const today = new Date();

// =======================================Create ReView===================================//

const postReview = async function (req, res) {
    try {
        const requestBody = req.body;
        // checking if request body is empty.
        if (Object.keys(requestBody) == 0) {
            return res.status(400).send({ status: false, Message: "send details to add a review..." });
        }

        // checking if bookId is valid and present.
        const bookId = req.params.bookId;
        if (bookId && (!isValidId(bookId))) {
            return res
                .status(400)
                .send({ status: false, Message: "Invalid Book Id..." })
        }
        if (bookId) {
            const noBookId = await bookModel.findOne({ _id: bookId, isDeleted: false });
            if (!noBookId) {
                return res.status(400).send({ status: false, Message: "Book Does Not exists..." });
            }
        }
        // destructuring of request Body
        const { review, rating, reviewedBy } = requestBody;

        // checking Mandatory feilds
        if (!review) {
            return res.status(400).send({ status: false, Message: "Please Enter a Review..." });
        }

        if (!rating) {
            return res.status(400).send({ status: false, Message: "Please Give ratings..." });
        }
        // if reviewedBy not given adding guest key
        if (!reviewedBy) {
            requestBody.reviewedBy = "guest";
        }
        //    rating validation.
        if (!isValidRating(rating)) {
            return res.status(400).send({ status: false, Message: "Please Enter a Valid Rating Between 1 to 5 with No Decimal Places ..." });
        }
        // Name validation.
        if (reviewedBy) {
            if (!isValidName(reviewedBy)) {
                return res.status(400).send({ status: false, Message: "Enter a Valid Name..." });
            }
            // adding reviewedBy
            requestBody.reviewedBy = reviewedBy;
        }

        // adding reviewedBy and bookId.
        requestBody.bookId = bookId;


        // creating review
        const createReview = await reviewModel.create(requestBody)
        const findReview =await reviewModel.findOne(requestBody).select({updatedAt:0,createdAt:0,__v:0}).populate("book")

        // editing response
        // ["updatedAt", "createdAt", "__v"].forEach((x) => delete createReview._doc[x]);


        // increasing reviews by 1.
        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } });

        return res.status(201).send({ status: true, Message: "Review Added successfully", Data: findReview });

    } catch (error) {
        return res.status(500).send({ status: false, Message: error.Message });
    }

}
module.exports = { postReview };