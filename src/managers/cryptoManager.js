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

function getCryptoById(cryptoId){
    return Crypto.findById(cryptoId);
}

function buyCrypto(cryptoId,userId){
    return Crypto.findByIdAndUpdate(cryptoId,{$push:{boughtBy:userId}});
}

function checkIfUserHasBoughtTheCrypto(crypto,userId){
    return crypto.boughtBy.map(c=>c.toString()).includes(userId);
}

function deleteCrypto(cryptoId){
    return Crypto.findByIdAndDelete(cryptoId);
}
function editCrypto(cryptoId,name,image,price,description,paymentMethod){
    if(!pattern.test(image)){
        throw new Error("Invalid image URL!");
    }

    const crypto={
        name,
        image,
        price,
        description,
        paymentMethod
    }
    return Crypto.findByIdAndUpdate(cryptoId,crypto,{runValidators:true});
}
module.exports = {
    getAllCrypto,
    createCrypto,
    getCryptoById,
    buyCrypto,
    checkIfUserHasBoughtTheCrypto,
    deleteCrypto,
    editCrypto,
}