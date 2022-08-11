const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
    Station1Id: {
        type: String,
        required: true,
    },
    Station2Id: {
        type: String,
        required: true,
    },
    PhoneNumber: {
        type: Number,
        required: true,
    },
    Class: {
        type: String,
        required: true,
    },
    JourneyType: {
        type: String,
        required: true,
    },
    NumberOfAdults: {
        type: Number,
    },
    NumberOfChildren: {
        type: Number,
    },
    PaymentID: {
        type: String,
    },
}, { timestamps: true, _id: true });


const Ticket = new mongoose.model('Tickets', TicketSchema);

module.exports = Ticket;