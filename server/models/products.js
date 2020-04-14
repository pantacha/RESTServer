const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productsSchema = new Schema({
    name: {
        type: String,
        required: [true, 'the name is neccessary']
    },
    precioUni: {
        type: Number,
        required: [true, 'the unitary price is neccessary']
    },
    description: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

module.exports = mongoose.model('Products', productsSchema);