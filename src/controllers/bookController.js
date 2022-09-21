const mongoose = require('mongoose');
const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")

// const createBooks = async function(req,res){
//     try {
//         let requestbody = req.body
//         if(!isVAlidRequestBody(requestbody)){
//             return res.status(400).send({status: false, msg: "please input Book Details"})
//         }

//         const { title, excerpt, userId, ISBN, category, subcategory, releasedAt , isDeleted} = requestbody

           
//         let IsbnNumber = /^[7-9][0-9]+$/.test(ISBN)
//         if (IsbnNumber == false) {
//             return res.status(400).send({ status: false, msg: 'please enter a valid ISBN Number' })
//         }
         
//         if (ISBN.length < 13 || ISBN.length > 13) {
//             return res.status(400).send({ status: false, msg: "IsbnNumber should be 13 digit" })
//         }

//         if (isDeleted) {
//             if (isDeleted != "false") {
//                 return res.status(400).send({ status: false, msg: "isDeleted is only take boolean value false" })
//             }
//         }


//         if (!isValid(title)) {
//             return res.status(400).send({ status: false, msg: ' title is required' })
//         }

//         let checkTitle = await bookModel.findOne({title:title})
//         if(checkTitle) {
//         return res.send({status: false, msg: "title must be unique"})
//         }

//         if (!isValid(excerpt)) {
//             return res.status(400).send({ status: false, msg: ' excerpt is required' })
//         }

//         if (!isValid(userId)) {
//             return res.status(400).send({ status: false, msg: ' userId is required' })
//         }
//         let findUserId = await userModel.findById(userId)
//         if(!findUserId) {
//         return res.send({status: false, msg: "user Id is not valid"})
//         }

//         if (!isValid(ISBN)) {
//             return res.status(400).send({ status: false, msg: ' ISBN is required' })
//         }

//         let checkISBN = await bookModel.findOne({ISBN:ISBN})
//         if(checkISBN) {
//         return res.send({status: false, msg: "ISBN must be unique"})
//         }

//         if (!isValid(category)) {
//             return res.status(400).send({ status: false, msg: ' category is required' })
//         }

//         if (!isValid(subcategory)) {
//             return res.status(400).send({ status: false, msg: ' subcategory is required' })
//         }

//         if (!isValid(releasedAt)) {
//             return res.status(400).send({ status: false, msg: ' releasedAt is required' })
//         }

//        // let createBookData = await bookModel.create(requestbody)
//         return res.status(201).send({status: true, msg:"successfully created"})
//     } catch (error) {
//         return res.status(500).send(error.message)
//     }
// }



















const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is invalid` })
        }
        let getSpecificBooks = await bookModel.findOne({_id:bookId ,isDeleted:false});
        if (!getSpecificBooks) {
            return res
                .status(404)
                .send({ status: false, data: "No books can be found" });
        } 

        let result = await reviewModel.find({_id:bookId, isDeleted:false})

        const details = getSpecificBooks._doc;
        details.reviewsData = result;
    
        return res.status(200).send({ status: true, data: details });
        
       
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
}


module.exports.getBookById = getBookById



const jwt = require('jsonwebtoken');

const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        if (!token) {
            return res.status(400).send({ status: false, message: "neccessary header token is missing" })
        }
        
         jwt.verify(token, "Project-1", (err, user)=> {
            if(err){ return res.status(403).send("failed authentication")}
            req.userLoggedIn = user
        })
        next()
         
    }catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports.authentication = authentication
