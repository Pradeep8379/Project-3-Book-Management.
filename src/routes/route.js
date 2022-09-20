const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/register', userController.createUser)

router.post('/login', userController.userLogin)


router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "The api you request is not available"
    })
})





module.exports = router
