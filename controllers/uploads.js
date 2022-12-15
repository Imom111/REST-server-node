const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);

const { response, request } = require('express');

const { subirArchivo } = require('../helpers');
const {
    Producto,
    Usuario
} = require('../models');

const cargarArchivo = async(req = request, res = response) => {
    try {
        // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'img' );
        res.json({
            nombre
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

const actualizarImagenCloudinary = async(req = request, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch ( coleccion ) {
        case 'users':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                res.status(400).json({
                    msg: `No se encontró el usuario con el id ${ id }`
                });
            }
            break;
        case 'products':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                res.status(400).json({
                    msg: `No se encontró el producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.json({ msg:  `No se sabe que hacer con la colección ${ coleccion }` });
    }

    // Limpiar imágenes previas
    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
      
    modelo.img = secure_url;
    await modelo.save();
    res.json({ modelo });
    
}

// const actualizarImagen = async(req = request, res = response) => {
//     const { id, coleccion } = req.params;
//     let modelo;
//     switch ( coleccion ) {
//         case 'users':
//             modelo = await Usuario.findById( id );
//             if ( !modelo ) {
//                 res.status(400).json({
//                     msg: `No se encontró el usuario con el id ${ id }`
//                 });
//             }
//             break;
//         case 'products':
//             modelo = await Producto.findById( id );
//             if ( !modelo ) {
//                 res.status(400).json({
//                     msg: `No se encontró el producto con el id ${ id }`
//                 });
//             }
//             break;
//         default:
//             return res.json({ msg:  `No se sabe que hacer con la colección ${ coleccion }` });
//     }

//     // Limpiar imágenes previas
//     if ( modelo.img ) {
//         // Borrar imagen del servidor
//         const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
//         if ( fs.existsSync(pathImagen) ) {
//             fs.unlinkSync(pathImagen);
//         }
//     }

//     modelo.img = await subirArchivo( req.files, undefined, coleccion );
//     await modelo.save();
//     res.json({ modelo });
    
// }

const mostrarImagen = async(req = request, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch ( coleccion ) {
        case 'users':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                res.status(400).json({
                    msg: `No se encontró el usuario con el id ${ id }`
                });
            }
            break;
        case 'products':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                res.status(400).json({
                    msg: `No se encontró el producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.json({ msg:  `No se sabe que hacer con la colección ${ coleccion }` });
    }

    if ( modelo.img ) {
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen );
        }
    }
    const pathNoImagen = path.join( __dirname, '../assets/no-image.jpg');
    return res.sendFile( pathNoImagen );
}

module.exports = {
    cargarArchivo,
    actualizarImagenCloudinary,
    mostrarImagen
}