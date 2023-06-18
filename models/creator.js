const mongoose = require('mongoose')
const Document = require('./document')

const creatorSchema = new mongoose.Schema({
name: {
    type: String,
    required: true 
}
})


creatorSchema.pre("deleteOne", async function (next) {
    try {
        const query = this.getFilter();
        const hasDocument = await Document.exists({ creator: query._id });
  
        if (hasDocument) {
            next(new Error("This creator still has documents."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});


/*creatorSchema.pre('findByIdAndRemove', async function () {
    const documents = await Document.find({ creator: this.id });
    if (documents.length > 0) {
        throw new Error('This creator still has documents');
    }
})*/


/*creatorSchema.pre('findByIdAndRemove', async function() {
    const documents = await Document.find({ creator: this.id }).exec();

    if (documents.length > 0) {
        throw new Error('This creator still has documents');
    }
});*/


/*creatorSchema.pre('remove', function(next) {
    Document.find({ creator: this.id }, (err, documents) => {
        if (err) {
            next(err)
        } else if (documents.length > 0) {
            next(new Error('This creator still has documents'))
        } else {
            next()
        }
    })
})*/

module.exports = mongoose.model('Creator', creatorSchema)