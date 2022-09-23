const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof (value) === null) return false;
  if (typeof (value) === "string" && value.trim().length > 0) return true;
  return false;
};

// const isvalidRating = function (rating) {
//     if (typeof rating === null) return false;
//     if(typeof rating != "number" ) return false;
//     if(rating < 1 || rating > 5) return false
//     return true
// }

const isValidRating=function(value){
    return /^[1-5]$/.test(value)
}

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

const isValidEmail = function (email) {
  const emailRegex = /^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/;
  return emailRegex.test(email);
};

const isValidMobile = function (number) {
  const mobileRegex = /^[5-9]{1}[0-9]{9}$/;
  return mobileRegex.test(number);
};

const isValidPassword = function (password) {
  const passwordRegex = /^[a-zA-Z0-9]{8,15}$/;
  return passwordRegex.test(password);
};

const isValidName = function (value) {
  const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
  return regex.test(value);
};

const isValidStreet = function (street) {
  const regex = /\w*\s*|\w/;
  return regex.test(street);
};

const isValidCity = function (value) {
  const regex = /^[a-zA-Z]{2,20}$/;
  return regex.test(value);
};

const isValidPincode = function (value) {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(value);
};

const isValidISBN = function (isbn) {
  if (/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn)) return true;
  return false;
};

const isValidId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidReleasedAt = (releasedAt) => {
  // return /^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt);
  return /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt);
};

module.exports = {
  isValid,
  isValidRating,
  isValidTitle,
  isValidEmail,
  isValidMobile,
  isValidPassword,
  isValidName,
  isValidStreet,
  isValidCity,
  isValidPincode,
  isValidISBN,
  isValidId,
  isValidReleasedAt,
};
