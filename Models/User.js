const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    PhoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    BookedTickets: {
        type: Array,
    },
}, { timestamps: true, _id: true });


const User = new mongoose.model('Users', UserSchema);

module.exports = User;