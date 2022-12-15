
const { Router } = require('express');
const { check } = require('express-validator');
const { 
    categoryGet,
    categoryDelete,
    categoryPost,
    categoryPut,
    categoryGetAll
} = require('../controllers/category');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const  {
    validarCampos,
    validarJWT,
    esAdminRole
} = require('../middlewares');

const router = Router();

router.get('/getAll', categoryGetAll);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], categoryGet);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoryPost );

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoryPut);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], categoryDelete);

module.exports = router;