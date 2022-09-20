const mongoose = require("mongoose");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false; 
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
};

const isValidTitle = function(title){
    return["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidEmail = function (email) {
    const emailRegex = /^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/


    return emailRegex.test(email);
};

const isValidMobile = function (number) {
    const mobileRegex = /^[5-9]{1}[0-9]{9}$/
    return mobileRegex.test(number);
}
 
const isValidPassword =function(password){
const passwordRegex=/^[a-zA-Z0-9]{8,15}$/;
return  passwordRegex.test(password);
}


const isValidName = function (value) {
    const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    return regex.test(value)
}

// const isValidRequest = function (object) {
//     return Object.keys(object).length > 0 
// };

// const isValidUrl = (value) => {
//     const urlRegex = /(http[s]:\/\/)([a-z\-0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-\/._~:?#\[\]@!$&'()+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png)/i;
//     return urlRegex.test(value)
// };


const isValidStreet = function (street) {
    const regex = /\w*\s*|\w/
    return regex.test(street)
}


const isValidCity = function (value) {
    const regex = /^[a-zA-Z]{2,20}$/
    return regex.test(value)
}


const isValidPincode = function (value) {
    const regex = /^[1-9][0-9]{5}$/
    return regex.test(value)
}

module.exports = { isValid , isValidEmail , isValidMobile , isValidName ,  isValidStreet,isValidTitle ,isValidPassword,isValidCity,isValidPincode};