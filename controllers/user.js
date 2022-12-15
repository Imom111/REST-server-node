const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('./../models/usuario');


const userGet = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    // const usuarios = await Usuario.find( query )
    //     .limit(Number(limite))
    //     .skip(Number(desde));
    // const total = await Usuario.countDocuments( query );

    const [ usuarios, total ] = await Promise.all([
        await Usuario.find( query )
            .limit(Number(limite))
            .skip(Number(desde)),
            Usuario.countDocuments( query )
    ]);
    res.json({ total, usuarios });
}

const userPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const userPost = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const user = new Usuario( { nombre, correo, password, rol } );

    // Encriptar contraseña
    // Número de vueltas para encriptar contraseña, por defecto 10
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );
    
    // Guardar en la base de datos
    await user.save();
    
    // Respuesta
    res.status(200).json({
        user
    });
}

const userDelete = async(req = request, res = response) => {
    const { id } = req.params;
    // const usuario = await Usuario.findOneAndDelete( {'_id': id} );
    const usuario = await Usuario.findOneAndUpdate( {'_id': id}, { estado: false } );
    const usuarioAutentificado = req.user;
    res.json({ usuario, usuarioAutentificado });
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete
}