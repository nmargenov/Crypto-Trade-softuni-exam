const Crypto = require("../models/Crypto");
const pattern = /^https?:\/\//;

function getAllCrypto(){
    return Crypto.find();
}

function createCrypto(name,image,price,description,paymentMethod,owner){
    if(!pattern.test(image)){
        throw new Error("Invalid image URL!");
    }

    const crypto = {
        name,
        image,
        price,
        description,
        paymentMethod,
        owner
    };

    return Crypto.create(crypto);
}

module.exports = {
    getAllCrypto,
    createCrypto,
}