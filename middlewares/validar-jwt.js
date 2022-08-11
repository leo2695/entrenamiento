const {
    response,
    request
} = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    //ser capaz de obtener el jwt //leer headers
    const token = req.header('x-token');

    // console.log(token);
    if (!token) {
        return res.status(401).json({
            message: 'No esta autorizado'
        });
    }

    try {

        //verificar el jwt
        const { uid } = jwt.verify(token, process.env.SECRETKEY);

        //leer el modelo
        const usuario= await Usuario.findById(uid);

        //verificar si da undefined
        if(!usuario){
            return res.status(401).json({
                message:'Token no valido - no existe BD'
            });
        }

        //verificar estado de usuario
        if(!usuario.estado){
            return res.status(401).json({
                message:'Token no valido - estado'
            });
        }

        //propiedad nueva para enviarlo
        req.usuario=usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no válido'
        })

    }

}

module.exports = {
    validarJWT
}