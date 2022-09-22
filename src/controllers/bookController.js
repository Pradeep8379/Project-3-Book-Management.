const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel")
const mongoose = require("mongoose")
const { isValidName, isValid, isValidId, isValidISBN, isValidReleasedAt } = require("../validation/validation");



const createBook = async function (req, res) {

    try {
        let data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .send({ status: false, message: "Data is required for creating book..." })
        };
        console.log(title)
        if (!title || isValidName(title.trim())) return res.status(400).send({ status: false, message: 'title is required and should be a valid format' });
        let checkTitle = await bookModel.findOne({ title: title });
        if (checkTitle) return res.status(409).send({ status: false, message: `'${title}' is already taken` });


        // excerpt validation

        if (!excerpt || !isValidName(excerpt.trim()))
            return res.status(400).send({ status: false, message: 'excerpt is required and should be a valid format' });

        // userId validtion

        if (!userId)
            return res.status(400).send({ status: false, message: "Please enter userId" });

        if (!isValid(userId) || !isValidId(userId))
            return res.status(400).send({ status: false, message: "Please enter valid userId" });

        let checkUser = await userModel.findOne({ _id: userId });
        if (!checkUser)
            return res.status(400).send({ status: false, message: "User is not present" });

        if (!ISBN)
            return res.status(400).send({ status: false, message: "Please enter ISBN" });

        if (!isValid(ISBN) || !isValidISBN(ISBN.trim()))
            return res.status(400).send({ status: false, message: "Please enter valid ISBN " });

        let checkISBN = await bookModel.findOne({ ISBN: ISBN });
        if (checkISBN)
            return res.status(400).send({ status: false, message: `ISBN '${req.body.ISBN}' already exist` });

        // category validation
        if (!category)
            return res.status(400).send({ status: false, message: "Please enter category" });

        if (!isValidName(category.trim()))
            return res.status(400).send({ status: false, message: "Please enter valid Category" });

        // subcategory validation
        if (!subcategory)
            return res.status(400).send({ status: false, message: "Please enter subcategory" });

        if (!isValidName(subcategory.trim()))
            return res.status(400).send({ status: false, message: "Please enter valid subcategory" });

        // released date validation
        if (!releasedAt)
            return res.status(400).send({ status: false, message: "Please enter release date" });

        if (!isValidReleasedAt(releasedAt.trim()))
            return res.status(400).send({ status: false, message: "Please enter valid release date in YYYY-MM-DD format" });

        // creating new book
        const savedData = await bookModel.create(req.body);
        return res.status(201).send({ status: true, message: "Sucessfully created", data: savedData });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}



const getBooks = async function (req, res) {
    try {
        let data = req.query;

        if (Object.keys(data).length == 0) {
            let books = await bookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });
            if (Object.keys(books).length == 0) {
                return res.status(404).send({ status: false, message: "No Books Found..." })
            }
            // let sortedBooks = books.sort((a, b) => (a.name > b.name ? 1 : -1))
            return res.status(200).send({ status: true, message: 'Success', Data: books })
        };
        //    Destructuring
        const { userId, category, subcategory, releasedAt, reviews } = data;

        
            if (userId && !isValidId(userId)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Invalid User Id..." })
            }
    
        if (userId)
            data.userId = userId;
        if (category)
            data.category = category;
        if (subcategory)
            data.subcategory = subcategory;
        if (releasedAt)
            data.releasedAt = releasedAt;
        if (reviews)
            data.reviews = reviews;

        let filter = {
            ...data,
            isDeleted: false
        };

        let bookList = await bookModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });
        if (Object.keys(bookList) == 0) {
            return res
                .status(400)
                .send({ status: false, message: "Book Not Found..." })
        }

        return res.status(200).send({ status: true, message: 'Books list', Data: bookList })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is invalid` })
        }
        let getSpecificBooks = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!getSpecificBooks) {
            return res
                .status(404)
                .send({ status: false, data: "No books can be found" });
        }

        let result = await reviewModel.find({ _id: bookId, isDeleted: false })

        const details = getSpecificBooks._doc;
        details.reviewsData = result;

        return res.status(200).send({ status: true, data: details });

    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
}


module.exports = { createBook, getBooks, getBookById }


