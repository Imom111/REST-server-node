
const { Router } = require('express');
const { check } = require('express-validator');
const { 
    productGet,
    productDelete,
    productPost,
    productPut,
    productGetAll
} = require('../controllers/product');

const  {
    validarCampos,
    validarJWT,
    esAdminRole,
} = require('../middlewares');

const { existeProductoPorId, existeCategoriaPorId, existeProductoPorNombre } = require('../helpers/db-validators.js');

const router = Router();

router.get('/getAll', productGetAll);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], productGet);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio debe ser número').isNumeric(),
    check('categoriaId', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('categoriaId').custom( existeCategoriaPorId ),
    validarCampos,
], productPost );

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeProductoPorNombre ),
    check('precio', 'El precio debe ser número').isNumeric(),
    check('categoriaId', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('categoriaId').custom( existeCategoriaPorId ),
    validarCampos
], productPut);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom( existeProductoPorId ),
    validarCampos
], productDelete);


module.exports = router;    