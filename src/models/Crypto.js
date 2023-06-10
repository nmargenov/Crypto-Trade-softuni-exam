const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required!'],
        minLength:[2,'Name must be at least 2 characters long!'],
    },
    image:{
        type:String,
        required:[true,'Image is required!'],
    },
    price:{
        type:Number,
        required:[true,'Price is required!'],
        min:[0,'Price must be a positive number'],
    },
    description:{
        type:String,
        required:[true,'Description is required!'],
        minLength:[10,'Description must be at least 10 characters long!']
    },
    paymentMethod:{
        type:String,
        required:[true,'Payment method is required!'],
        enum:{
            values:['crypto-wallet','credit-card','debit-card','paypal'],
            message:'Invalid payment method!'
        },
    },
    boughtBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Crypto = mongoose.model('Crypto',cryptoSchema);

module.exports = Crypto;