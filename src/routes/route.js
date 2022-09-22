const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')



router.post('/register', userController.createUser)

router.post('/login', userController.userLogin)

router.post('/books', bookController.createBook)

router.get('/books', bookController.getBooks);

router.get('/books/:bookId', bookController.getBookById)


router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "The api you request is not available"
    })
})



module.exports = router
