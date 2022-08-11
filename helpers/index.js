const dbValidators  = require('./db-validators');
const generarJWT    = require('./generarJWT');
const googleVerify  = require('./google-verify');
const subirArchivo  = require('./subir-archivo');

//esparcimos todo el contenido, o sea, si un require importa una funcion o constante o variable los voy a tener acá
module.exports={
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}