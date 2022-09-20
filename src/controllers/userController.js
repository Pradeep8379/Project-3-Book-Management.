const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');


const createUser = async function (req, res) {
    try {
        let data = req.body;
        let users = await userModel.create(data);
        res.status(201).send({ status: true, data: users });

    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
}

const userLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        let checkData = await userModel.findOne({ email: email, password: password });
        if (!checkData) return res.status(400).send({ status: false, msg: "This email and password is not exist" });

        let token = jwt.sign({
            authorId: checkData._id.toString(),
            group: "group-7",
        }, "project3");

        res.status(200).send({ status: true, msg: "user Login Successful",token: { token },});

    } catch (err) {
        res.status(500).send({ msg: err.message });
    }

}



module.exports.createUser = createUser
module.exports.userLogin = userLogin