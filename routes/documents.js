const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require ('path')
const fs = require('fs')
const Document = require('../models/document')
const Creator = require('../models/creator')
const uploadPath = path.join('public', Document.coverImageBasePath)
const imageMimeTypes = ['image/jpg', 'image/png', 'image/gif']
const { callbackify } = require('util')
const upload = multer({
    dest: uploadPath,
    filterFile: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.imageMimeType))
    }
})

//All Documents Route

router.get('/', async (req, res) => {
    let query = Document.find()
    if (req.query.title != null && (req.query.title) != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.createdBefore != null && (req.query.createdBefore) != '') {
        query = query.lte('createdDate', req.query.createdBefore)
    }
    if (req.query.createdAfter != null && (req.query.createdAfter) != '') {
        query = query.gte('createdDate', req.query.createdAfter)
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

router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const document = new Document({
        title: req.body.title,
        creator: req.body.creator,
        creationDate: new Date(req.body.creationDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName, 
        description: req.body.description
    }) 

    try {
        const newDocument = await document.save()
        // res.redirect(`documents/$(newDocument.id)`)
        res.redirect(`documents`)
    } catch {
        if (document.coverImageName != null) {
            removeDocumentCover(document.coverImageName)
        }
        
        renderNewPage(res, document, true)

    }
})

function removeDocumentCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.err(err)
    })
}

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
module.exports = router