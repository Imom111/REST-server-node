const validarCampos = require('./../middlewares/validar-campos.js');
const validarJWT = require('../middlewares/validar-jwt.js');
const esAdminRole = require('../middlewares/validar-roles.js');
const validarArchivoSubir = require('../middlewares/validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...esAdminRole,
    ...validarArchivoSubir
}