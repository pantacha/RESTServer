const bcrypt = require('bcrypt');
const _ = require('underscore');
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', (req, resp) => {
    
    let desde = req.query.desde || 0;
    desde=Number(desde);
    let limite = req.query.limite || 5;
    limite=Number(limite);

    Usuario.find({estado: true}, 'name email img role estado google')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if(err){
                    return resp.status(400).json({
                        ok: false,
                        err
                    })
                }
                Usuario.count({estado: true}, (err, conunt) => {
                    if(err){
                        resp.status(400).json({
                            ok: false,
                            err
                        })
                    }
                    resp.json({
                        ok: true,
                        usuarios,
                        conunt
                    })
                })
            })
})

app.post('/usuario', function (req, res) {

    let body = req.body;
    
    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
            name: usuarioDB.name
        })
    });

});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            usuario: usuarioDB
        })
    })
});

app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado: false}, { new: true}, (err, usuarioDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
        })
    })
});

module.exports = app;