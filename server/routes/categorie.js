const express = require('express');
const app = express();
const Categorie = require('../models/categorie');
let {checkToken, checkAdminRole} = require('../middlewares/authentication');

app.get('/categorie', checkToken, (req, resp) => {
    Categorie.find({})
             .sort('description')
             .populate('usuario', 'name email')
             .exec((err, categories) => {
                 if(err){
                     return resp.status(500).json({
                         ok: false,
                         err
                     })
                 }
                 if(!categories){
                     return resp.status(400).json({
                         ok: false,
                         err: {
                             message: 'incorrect ID'
                         }
                     })
                 }
                 resp.json({
                     ok: true,
                     categories
                 })
             })
})

app.get('/categorie/:id', checkToken, (req, resp) => {
    let id = req.params.id;
    Categorie.findById(id, (err, categorieDB) => {
        if(err){
            return resp.status(500).json({
                ok: false,
                err
            })
        }
        if(!categorieDB){
            return resp.status(400).json({
                ok: false,
                err: {
                    message: 'imposible find the catefgorie'
                }
            })
        }
        resp.json({
            ok: true,
            categorie: categorieDB
        })
    })
})

app.post('/categorie', checkToken, (req, resp) => {
    let body = req.body;

    let categorie = new Categorie({
        description: body.description,
        usuario: req.usuario._id
    })

    categorie.save((err, categorieDB) => {
        if(err){
            return resp.status(500).json({
                ok: false,
                err
            })
        }
        if(!categorieDB){
            return resp.status(400).json({
                ok: false,
                err
            })
        }
        resp.json({
            ok: true,
            categorie: categorieDB
        })
    })
})

app.put('/categorie/:id', checkToken, (req, resp) => {
    let id = req.params.id;
    let body = req.body;
    let categorieDesc = {
        description: body.description
    }

    Categorie.findByIdAndUpdate(id, categorieDesc, {new: true, runValidators: true}, (err, categorieDB) => {
        if(err){
            return resp.status(500).json({
                ok: false,
                err
            })
        }
        if(!categorieDB){
            return resp.status(400).json({
                ok: false,
                err
            })
        }
        resp.json({
            ok: true,
            categorie: categorieDB
        })
    })
})

app.delete('/categorie/:id', [checkToken, checkAdminRole], (req, resp) => {
    let id = req.params.id;

    Categorie.findByIdAndRemove(id, (err, categorieDB) => {
        if(err){
            return resp.status(500).json({
                ok: false,
                err
            })
        }
        if(!categorieDB){
            return resp.status(400).json({
                ok: false,
                err: {
                    message: 'no se encuentra la categoría en la BD'
                }
            })
        }
        resp.json({
            ok: true,
            messsage: 'se ha borrado'
        })
    })
})

module.exports = app;