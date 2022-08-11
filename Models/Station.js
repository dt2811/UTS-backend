const mongoose = require('mongoose');
const StationSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true,
    },
    Coordinates: {
        type: String,
        required: true,
    },
    ShortForm: {
        type: String,
        required: true,
    },
}, { timestamps: true, _id: true });


const Stations = new mongoose.model('Stations',  StationSchema);

module.exports = Stations;