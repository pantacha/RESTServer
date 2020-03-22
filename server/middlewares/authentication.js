const jwt = require('jsonwebtoken');

let checkToken = (req, resp, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, encode) => {
        if(err){
            resp.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = encode.usuario;
        next();
    })

}

let checkAdminRole = (req, resp, next) => {
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return resp.status(401).json({
            ok: false,
            err: {
                message: 'usuario no es admin'
            }
        })
    }
}

module.exports = {checkToken, checkAdminRole};