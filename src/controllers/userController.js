const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const { isValid, isValidEmail, isValidMobile, isValidName, isValidStreet, isValidTitle , isValidCity,isValidPincode} = require("../validation/validation");


const createUser = async function (req, res) {

    try {
        let data = req.body
        //using destructuring
        
        const { title, name, phone, email, address, password } = data;

        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .send({ status: false, message: "Data is required for creating user..." })
        };

        if (!isValidTitle(title.trim())) {
            return res
                .status(400)
                .send({ status: false, message: "Please Enter Mr,Miss or Mrs..." })
        };

        if (!name) {
            return res
                .status(400)
                .send({ status: false, message: "name is mandatory" })
        };

        if (!isValid(name.trim()) || !isValidName(name.trim())) {
            return res
                .status(400)
                .send({ status: false, message: "name is required or its should contain aplhabets.." })
        };

        if (!email) {
            return res
                .status(400)
                .send({ status: false, message: "emailId is mandatory..." })
        };

        if (!isValidEmail(email.trim())) {
            return res
                .status(400)
                .send({ status: false, message: "please enter valid emailId..." })
        };

        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) {
            return res
                .status(400)
                .send({ message: "Email Already Registered..." })
        };

        if (!phone) {
            return res
                .status(400)
                .send({ status: false, message: "mobile number is mandatory..." })
        };

        if (!isValidMobile(phone.trim())) {
            return res
                .status(400)
                .send({ status: false, message: "please enter valid mobile number..." })
        };

        if (!password) {
            return res
                .status(400)
                .send({ status: false, message: "password is mandatory..." })
        };
       
        if(!(password.length<16) || !(password.length>7)){
            return res
            .status(400)
             .send({ status: false, message: "invalid password....." })

        }

        let checkMobile = await userModel.findOne({ phone: phone })
        if (checkMobile) {
            return res
                .status(400)
                .send({ message: "Mobile Already Registered" })
        };

        if (!address.street) {
            return res
                .status(400)
                .send({ status: false, message: "street is mandatory..." })
        };
       
        if(!isValidStreet(address.street)){
            return res
            .status(400)
            .send({ status: false, message: "Invalid street..." })
        }
       
        if (!address.city) {
            return res
                .status(400)
                .send({ status: false, message: "city is mandatory..." })
        };

        if(!isValidCity(address.city)){
            return res
            .status(400)
            .send({ status: false, message: "Invalid city..." })
        }
       
        if (!address.pincode) {
            return res
                .status(400)
                .send({ status: false, message: "pincode is mandatory..." })
        };

        if(!isValidPincode(address.pincode)){
            return res
            .status(400)
            .send({ status: false, message: "Invalid pincode..." })
        }
       

        const newUser = await userModel.create(data);

        return res
            .status(201)
            .send({ status: true, message: " user created successfully", data: newUser });

    } catch (err) {
       return res.status(500).send({ status: false, message: err.message });

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
            
        }, "project3",{ expiresIn: "1M"}); 

        res.status(200).send({ status: true, msg: "user Login Successful",token: { token },});

    } catch (err) {
        res.status(500).send({ msg: err.message });
    }

}



module.exports.createUser = createUser
module.exports.userLogin = userLogin