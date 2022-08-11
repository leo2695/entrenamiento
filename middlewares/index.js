const  validarCampos = require('../middlewares/validar-campos');
const  validarJWT = require('../middlewares/validar-jwt');
const  tipoRolValido = require('../middlewares/validar-rol');
const  validarArchivoSubir  = require('../middlewares/validar-archivo');

module.exports={
    ...validarCampos,
    ...validarJWT,
    ...tipoRolValido,
    ...validarArchivoSubir
}