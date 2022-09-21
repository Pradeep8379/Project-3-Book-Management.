const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");


const { isValidIsbn, isValidUserId, isValidObjectId } = require("../validation/validation");



const createBook = async function (req, res) {

    try {
        let data = req.body
        const { title, excerpt, userId, ISBN, category, reviews, deletedAt, isDeleted, releasedAt } = data;
        let userDetail = await userModel.findById(data["userId"]);

        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .send({ status: false, message: "Data is required for creating user..." })
        };
        if (!title) {
            return res
                .status(400)
                .send({ status: false, message: "title is mandatory" })
        };
        if (!excerpt) {
            return res
                .status(400)
                .send({ status: false, message: "excerpt is mandatory" })
        };
        if (!userId) {
            return res
                .status(400)
                .send({ status: false, message: "userId is mandatory" })
        };
        if (!isValidUserId(userId)) {
            return res
                .status(400)
                .send({ status: false, message: "please enter valid userId..." })
        };
        if (!userDetail) {
            return res
                .status(400)
                .send({ status: false, msg: " user is not present." });
        }

        if (!ISBN) {
            return res
                .status(400)
                .send({ status: false, message: "ISBN number is mandatory" })
        };
        if (!isValidIsbn(ISBN)) {
            return res
                .status(400)
                .send({ status: false, message: "please enter valid ISBN number..." })
        };
        if (!category) {
            return res
                .status(400)
                .send({ status: false, message: "category is mandatory" })
        };
        if (!releasedAt) {
            return res
                .status(400)
                .send({ status: false, message: "released at   is mandatory" })
        };

        const newBook = await bookModel.create(data);
        return res.status(201).send({ status: true, message: " Book created successfully", data: newBook });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });

    }
}

const getBooks = async function (req, res) {
    try
     { let filters = req.query;
  
      if (Object.keys(filters).length == 0) {
          let books = await bookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });
          if (Object.keys(books).length == 0) {
              return res.status(404).send({ status: false, message: "No Books Found..." })
          }
          // let sortedBooks = books.sort((a, b) => (a.name > b.name ? 1 : -1))
          return res.status(200).send({ status: true, message: 'Success', Data: books })
      };
      //    Destructuring
      const { userId, category, subcategory, releasedAt, reviews } = filters;
  
      if (!isValidObjectId(userId) || userId.length != 24) {
          return res
              .status(400)
              .send({ status: false, message: "Invalid User Id..." })
      }
  
      // if (userId) {
      //     let validUserId = await userModel.findById({ userId: userId })
      //     if (!validUserId) {
      //         return res
      //             .status(400)
      //             .send({ message: "Book Not Found..." })
      //     };
      // }
      //    adding filters
      if (userId)
          filters.userId = userId;
      if (category)
          filters.category = category;
      if (subcategory)
          filters.subcategory = subcategory;
      if (releasedAt)
          filters.releasedAt = releasedAt;
      if (reviews)
          filters.reviews = reviews;
  
      filters.isDeleted = false;
  
      let Data = await bookModel.find(filters).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });
      if (Object.keys(Data) == 0) {
          return res
              .status(400)
              .send({ status: false, message: "Book Not Found..." })
      }
      // sorting array of objects
      // let sortedData = Data.sort((a, b) => (a.name > b.name ? 1 : -1))
      return res.status(200).send({ status: true, message: 'Success', Data: Data })
  }
  catch(error){
      return res.status(500).send({ status: false, message: error.message })
  }
  }
  
module.exports={getBooks}

module.exports.createBook = createBook