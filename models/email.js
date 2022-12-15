const { Schema, model } = require('mongoose');

const EmailSchema = Schema({
    email: {
        type: String,
        required: [true, 'El email es obligatorio']
    }
});

module.exports = model( "Email", EmailSchema );