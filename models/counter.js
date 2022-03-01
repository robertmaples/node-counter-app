const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Counter', counterSchema);