const mongoose = require('mongoose');


// connect to DB
const ConnectDB = (url)=> {
    mongoose.connect(url)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
};

module.exports = ConnectDB;
