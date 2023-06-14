const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/documentCovers'

const documentSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true 
    },
    description: {
        type: String,
    },
    creationDate: {
        type: Date,
        required: true 
    },
    pageCount: {
        type: Number,
        required: true 
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true 
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Creator'
    }
    
})

documentSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Document', documentSchema)
module.exports.coverImageBasePath = coverImageBasePath
