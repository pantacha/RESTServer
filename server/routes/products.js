const express = require('express');
const _ = require('underscore');

const app = express();

let Products = require('../models/products');
const {checkToken} = require('../middlewares/authentication');


app.get('/products', checkToken, (req, resp) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Products.find({disponible: true})
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'name email')
            .populate('categorie')
            .exec((err, products) => {
                if(err){
                    return resp.status(500).json({
                        ok: false,
                        err
                    })
                }
                Products.countDocuments((err, count) => {
                    if(err){
                        return resp.status(400).json({
                            ok: false,
                            err: {
                                message: 'impossible find the products'
                            }
                        })
                    }
                    resp.json({
                        ok: true,
                        products,
                        count
                    })
                })
            })
})

app.get('/products/:id', checkToken, (req, resp) => {
    let id = req.params.id;

    Products.findById(id)
            .populate('usuario', 'name email')
            .populate('categorie')
            .exec((err, productDB) => {
                if(err){
                    return resp.status(500).json({
                        ok: false,
                        err
                    })
                }
                if(!productDB){
                    return resp.status(400).json({
                        ok: false,
                        err: {
                            message: 'does not find that product'
                        }
                    })
                }
                resp.json({
                    ok: true,
                    product: productDB
                })
            })
})

app.get('/products/buscar/:termino', checkToken, (req, resp) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Products.find({name: regex})
            .populate('categorie')
            .exec((err, products) => {
                if(err){
                    return resp.status(500).json({
                        ok: false,
                        err
                    })
                }
                resp.json({
                    ok: true,
                    products
                })
            })
})

app.post('/products', checkToken, (req, resp) => {
    let body = req.body;

    let products = new Products({
        usuario: req.usuario._id, 
        name: body.name,
        precioUni: body.precioUni,
        description: body.description,
        disponible: body.disponible,
        categorie: body.categorie
    })

    products.save((err, productsDB) => {
        if(err){
            return resp.status(500).json({
                ok: false,
                err
            })
        }
        if(!productsDB){
            return resp.status(400).json({
                ok: false,
                err: {
                    message: 'no operative DB'
                }
            })
        }
        resp.json({
            ok: true,
            product: productsDB
        })
    })
})

app.put('/products/:id', checkToken, (req, resp) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'precioUni', 'description', 'disponible']);

    Products.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productDB) => {
        if(err){
            return resp.status(500).json({
                ok: false,
                err
            })
        }
        if(!productDB){
            return resp.status(400).json({
                ok: false,
                err: {
                    message: 'incorrect ID'
                }
            })
        }
        resp.json({
            ok: true,
            product: productDB
        })
    })
})

app.delete('/products/:id', checkToken, (req, resp) => {
    let id = req.params.id;

    Products.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, productDB) => {
        if(err){
            return resp.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return resp.status(400).json({
                ok: false,
                err: {
                    message: 'incorrect ID'
                }
            })
        }
        resp.json({
            ok: true,
            product: productDB
        })
    })
})

module.exports = app;