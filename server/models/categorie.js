const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categorieSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

module.exports = mongoose.model('Categorie', categorieSchema);