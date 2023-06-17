const mongoose = require('mongoose')

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
    coverImage: {
        type: Buffer,
        required: true 
    },
    coverImageType: {
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
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
        //return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage}` 
    }
})

module.exports = mongoose.model('Document', documentSchema)

