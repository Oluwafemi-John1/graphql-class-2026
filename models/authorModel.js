const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
    name: {type: String, required:true, unique: true},
    gender: {type: String, required:true},
    age: {type: Number, required:true}
}, {
    timestamps: true
})

const authorModel = new mongoose.model('authors', AuthorSchema)
module.exports = authorModel