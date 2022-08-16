//creo constantes de todo lo que contienen esos archivos
//al ponerle index.js automaticamente lo primero que se va a buscar es este archivo

const  validarCampos = require('../middlewares/validar-campos');
const  validarJWT = require('../middlewares/validar-jwt');
const  tipoRolValido = require('../middlewares/validar-rol');
const  validarArchivoSubir  = require('../middlewares/validar-archivo');

//utilizo el operador spread para no tener que poner por ej validarCampos.validar... , poniendo ...validarCampos los traigo todos
module.exports={
    ...validarCampos,
    ...validarJWT,
    ...tipoRolValido,
    ...validarArchivoSubir
}