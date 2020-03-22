const bcrypt  = require('bcrypt');
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');

app.post('/login', (req, resp) => {
    let body = req.body;

    Usuario.findOne( {email: body.email}, (err, usuarioDB) => {
        if(err){
            return resp.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){
            return resp.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario o password incorrect'
                }
            })
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return resp.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario o password incorrect'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CAD_TOKEN});

        resp.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
})

module.exports = app;