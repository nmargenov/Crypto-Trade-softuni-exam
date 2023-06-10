const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required!'],
        minLength:[2,'Username must be atleast 2 characters long!']
    },
    email:{
        type:String,
        required:[true,'Email is required!'],
        minLength:[10,'Email must be atleast 10 characters long!']
    },
    password:{
        type:String,
        required:[true,'Password is required!']
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;