const {Router} = require('express');
const {check} = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoriaID, eliminarCategoria, actualizarCategoria } = require('../controllers/categorias');
const { existeCategoriaBD } = require('../helpers/db-validators');

const { validarJWT, validarCampos, tipoRolValido } = require('../middlewares');


const router = Router();
/* 
{{url}}/api/categorias
*/

//Obtener categorías - publico
router.get('/', obtenerCategorias);

//Obtener una categoría por id - publico
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaBD),
    validarCampos
],obtenerCategoriaID);

//Crear una categoría - privado - cualquier persona con token válido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar -privado -con token valido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaBD),
    validarCampos
],actualizarCategoria);

//Borrar categoría - Admin -borrado logico no físico
router.delete('/:id',[ 
validarJWT,
tipoRolValido('ADMIN_ROLE','VENTAS_ROLES'),
check('id','No es un ID válido').isMongoId(),
check('id').custom(existeCategoriaBD),
//rolValido,
validarCampos
], eliminarCategoria);

module.exports = router;