const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let roles = {
    values: ['USER_ROLE','ADMIN_ROLE']
};

let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'the name is necessary']
    },
    email: {
        type: String,
        required: [true, 'the email is necessary'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'the password is necessary']
    },
    img: {
        type: String,
        required: [false]
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
})

usuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Usuario', usuarioSchema);