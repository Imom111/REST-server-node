
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarArchivoSubir
} = require('../middlewares');
const {
    cargarArchivo,
    actualizarImagenCloudinary,
    // actualizarImagen,
    mostrarImagen
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users','products'] ) ),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users','products'] ) ),
    validarCampos
], mostrarImagen);


module.exports = router;