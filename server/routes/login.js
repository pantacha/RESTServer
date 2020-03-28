const bcrypt  = require('bcrypt');
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, resp) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token);
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
        if(err){
            resp.status(500).json({
                ok: true,
                err
            })
        };
        if(usuarioDB){
            if(googleUser.google === false){
                resp.status(404).json({
                    ok: false,
                    err: {
                        message: 'usuario ya logeado'
                    }
                })
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CAD_TOKEN});
                
                resp.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        }else{
            let usuario = new Usuario();
            usuario.name = googleUser.name;
            usuario.email = googleUser.email;
            usuario.password = 'joke';
            usuario.img = googleUser.img;
            usuario.google = true;
            
            usuario.save((err, usuarioDB) => {
                if(err){
                    resp.status(400).json({
                        ok: true,
                        err
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
        }
    })
})

module.exports = app;