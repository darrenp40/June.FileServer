const mongoose = require('mongoose')

const creatorSchema = new mongoose.Schema({
name: {
    type: String,
    required: true 
}
})

module.exports = mongoose.model('Creator', creatorSchema)