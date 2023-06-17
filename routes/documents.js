const express = require('express')
const router = express.Router()
const Document = require('../models/document')
const Creator = require('../models/creator')
const imageMimeTypes = ['image/jpg', 'image/png', 'image/gif', 'image/docx']


//All Documents Route

router.get('/', async (req, res) => {
    let query = Document.find()
    if (req.query.title != null && (req.query.title) != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.createdBefore != null && (req.query.createdBefore) != '') {
        query = query.lte('creationDate', req.query.createdBefore)
    }
    if (req.query.createdAfter != null && (req.query.createdAfter) != '') {
        query = query.gte('creationDate', req.query.createdAfter)
    }
    try {
    const documents = await query.exec()
    res.render('documents/index', {
        documents: documents,
        searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})



//New Document Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Document())
    
})

// Create Document Route

router.post('/', async (req, res) => {
    const document = new Document({
        title: req.body.title,
        creator: req.body.creator,
        creationDate: new Date(req.body.creationDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    }) 
    saveCover(document, req.body.cover)

    try {
        const newDocument = await document.save()
        // res.redirect(`documents/$(newDocument.id)`)
        res.redirect(`documents`)
    } catch {            
        renderNewPage(res, document, true)

    }
})


async function renderNewPage(res, document, hasError = false) {
    try {
        const creators = await Creator.find({})
        const params =  {
            creators: creators,
            document: document
        }
        if (hasError) params.errorMessage = 'Error Creating Document'
        res.render('documents/new', params)      
    } catch {
        res.redirect('/documents')
    }
}

function saveCover(document, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        document.coverImage = new Buffer.from(cover.data, 'base64') 
        document.coverImageType = cover.type
    }
}
module.exports = router