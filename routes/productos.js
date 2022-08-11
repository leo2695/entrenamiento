const {Router} = require('express');
const {check} = require('express-validator');

const { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto, obtenerProductoID } = require('../controllers/productos');
const { existeProductoBD, existeCategoriaBD, existeUsuarioID } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tipoRolValido } = require('../middlewares');


const router = Router();
/* 
{{url}}/api/productos
*/

//Obtener categorías - publico
router.get('/', obtenerProductos);

//Obtener una producto por id - publico
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoBD),
    validarCampos
],obtenerProductoID);

//Crear una categoría - privado - cualquier persona con token válido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id válido').isMongoId(),
    check('categoria').custom(existeCategoriaBD),
    validarCampos
], crearProducto);

//Actualizar -privado -con token valido
router.put('/:id', [
    validarJWT,
    check('categoria','No es un id válido').optional().isMongoId(),
    check('categoria').optional().custom(existeCategoriaBD),
    check('id').custom(existeProductoBD),
    validarCampos
],actualizarProducto);

//Borrar categoría - Admin -borrado logico no físico
router.delete('/:id',[ 
validarJWT,
tipoRolValido('ADMIN_ROLE','VENTAS_ROLES'),
check('id','No es un ID válido').isMongoId(),
check('id').custom(existeProductoBD),
//rolValido,
validarCampos
], eliminarProducto);

module.exports = router;