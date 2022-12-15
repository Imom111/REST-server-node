const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('./../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('token');
    if ( !token ) {
        return res.status(401).json({
            msg: 'No se recibió token'
        });
    }
    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        const user = await Usuario.findById( uid );

        if ( !user ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no encontrado'
            });
        }

        if ( !user.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario estado: false'
            }); 
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT
}