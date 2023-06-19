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
        res.redirect(`documents/${newDocument.id}`)
      } catch {  
         
        renderNewPage(res, document, true)
    }
})


// Show Document Route

// Refactored code:
router.get('/:id', async (req, res) => {
    try {
      // Find the document by its ID and populate the 'creator' field
      const document = await Document.findById(req.params.id).populate('creator').exec();
  
      // Render the 'documents/show' view with the document object
      res.render('documents/show', { document: document });
    } catch (error) {
      // Handle any errors by redirecting to the homepage
      res.redirect('/');
    }
  });
  

//Edit Document Route
router.get('/:id/edit', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
        renderEditPage(res, document)
    } catch {
        res.redirect('/')
    }
        
})

// Update Document Route

router.put('/:id', async (req , res) => {
    let document
    try {
      document = await Document.findById(req.params.id)
      document.title = req.body.title
      document.creator = req.body.creator
      document.creationDate = new Date(req.body.creationDate)
      document.pageCount = req.body.pageCount
      document.description = req.body.description
      if (req.body.cover != null && req.body.cover !== '') {
        saveCover(document, req.body.cover)
      }
      await document.save()
      res.redirect(`/documents/${document.id}`)

    } catch {
  
      if (document != null) {
          renderEditPage(res, document, true)
        } else {
          redirect('/')
        }
      }
    })

// Delete Document Page

router.delete('/:id', async (req, res) => {

    let document
    try {
      //document = await Document.findById(req.params.id)
      const response = await Document.deleteOne({_id: req.params.id})
      document = await Document.findById(req.params.id)
      await document.remove()
      res.redirect('/documents')
    
    } catch {
      
      if (document != null) {
        res.render('documents/show', {
          document: document,
          errorMessage: 'Could not remove document'
        })
      } else {
        res.redirect('/')
      }
      }
     })


async function renderNewPage(res, document, hasError = false) {
    renderFormPage(res, document, 'new', hasError) 
}

async function renderEditPage(res, document, hasError = false) {
    renderFormPage(res, document, 'edit', hasError)
}
//Render Form Page



async function renderFormPage(res, document, form, hasError = false) {
    try {
      const creators = await Creator.find({})
      const params = {
        creators: creators,
        document: document
      }
      
      //if (hasError) params.errorMessage = 'Error Rendering Document'
      
      {
        if (form == 'edit') {
          params.errorMessage = 'Error Updating Document'
        } else {
          params.errorMessage = 'Error Creating Document'
        }
      }
      res.render(`documents/${form}`, params)
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