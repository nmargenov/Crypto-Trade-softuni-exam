const mongoose = require('mongoose');
const { uri } = require('./config');

async function connectDatabase(){
    await mongoose.connect(uri);
}

module.exports = connectDatabase;
