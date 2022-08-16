const {
    Router
} = require('express');
const {
    check,
    query
} = require('express-validator');
const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/user');


const {
    esRolValido, existeEmail, existeUsuarioID, existeIdentificacion
} = require('../helpers/db-validators');


//voy a unificar estos archivos en uno solo, ya que vienen del mismo directorio 'middlewares'
/* const {
    validarCampos
} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { rolValido, tipoRolValido } = require('../middlewares/validar-rol'); */

//en vez de exportar los middlewares
const {validarCampos,validarJWT,tipoRolValido, rolValido} = require('../middlewares');

const router = Router();




router.get('/', [
    query("limite","El valor de limite debe ser númerico").isNumeric().optional(),
    query("desde","El valor de desde debe ser númerico").isNumeric().optional(),
    validarCampos
],usuariosGet);

//ACTUALIZAR
router.put('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioID),
    check('rol').custom(esRolValido),
    validarCampos //validarCampos siempre lo tengo que poner en todas las rutas (ppost,put,get, etc..) para que no continue a la ruta en caso de errores
], usuariosPut);

//CREAR
router.post('/', [
    //arreglo de middlewares
    check('identificacion').custom(existeIdentificacion),
    check('nombre', 'El campo es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener una longitud mínima de 6').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    //check('fechaNacimiento', 'La fecha de nacimiento no es válida').isDate,
    check('correo').custom(existeEmail),
    //check('rol', 'No es válido').isIn(['SUPER_ROLE','ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

//BORRAR
router.delete('/:id',[
    validarJWT, 
    //rolValido,
    tipoRolValido('ADMIN_ROLE','SUPER_ROLE'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioID),
    validarCampos
], usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router;