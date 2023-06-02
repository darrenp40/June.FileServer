const express = require('express')
const router = express.Router()
const Creator = require('../models/creator')

//All Creators Route

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const creators = await Creator.find(searchOptions);
        res.render('creators/index', { 
            creators, 
            searchOptions: req.query 
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

/*router.get('/', async (req, res) => {
    try {
        const creators = await Creator.find({})
        res.render('creators/index', { creators: creators })
    } catch {
        res.redirect('/')
    }
    res.render('creators/index')
})*/

//New Creator Route
router.get('/new', (req, res) => {
    res.render('creators/new', {creator: new Creator()})
})

// Create Creator Route

router.post('/', async (req, res) => {
    const creator = new Creator({
        name: req.body.name
    })
        
    const newCreator = await creator.save()
    .then((newCreator) => {
        res.redirect(`creators`);
    })
    .catch((err) => {
        res.render('creators/new', {
            creator: creator,
            errorMessage: 'Error creating Creator'
        });
    })
         
    /*creator.save((err, newCreator) => {
        if (err) {
            res.render('creators/new', {
                creator: creator,
                errorMessage: 'Error creating Creator'
            })
        } else {
            //res.redirect(`creators/${newCreator.id}`)
            res.redirect(`creators`)
        }*/

    })
  

module.exports = router