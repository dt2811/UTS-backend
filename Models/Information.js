const mongoose = require('mongoose');
const InfoSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Details: {
        type: String,
        required: true,
    },
    ImageUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true, _id: true });


const Information = new mongoose.model('Information', InfoSchema);

module.exports = Information;