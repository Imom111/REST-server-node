const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('./../models/usuario.js');
const { generarJWT } = require('../helpers/generar-jwt.js');
const { googleVerify } = require('../helpers/google-verify.js');

const login = async( req = request, res = response ) => {
    const { correo, password } = req.body;
    try {
        const user = await Usuario.findOne({ correo });
        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña no son correctos - correo'
            }); 
        }

        if ( !user.estado ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña no son correctos - estatus: false'
            }); 
        }

        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña no son correctos - password'
            }); 
        }
        if ( !user.estado ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña no son correctos - correo'
            }); 
        }

        const token = await generarJWT( user.id );
        res.json({
            correo,
            password,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Llame al administrador del sistema'
        }); 
    }
}

const googleSingIn = async( req = request, res = response ) => {
    const { id_token } = req.body;
    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        let user = await Usuario.findOne({ correo });
        if ( !user ) {
            // Se crea usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }
            user = new Usuario( data );
            await user.save();
        }
        // Si el usuario
        if ( !user.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador dle sistema - usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generarJWT( user.id );
        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        });
    }
}

module.exports = {
    login,
    googleSingIn
}

