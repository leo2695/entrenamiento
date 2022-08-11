const {response,request} = require("express");

const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');

const {generarJWT} = require("../helpers/generarJWT");
const {googleVerify} = require("../helpers/google-verify");


const loginController = async (req, res = response) => {

    const {
        correo,
        password
    } = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({
            correo
        });

        if (!usuario) {
            return res.status(400).json({
                messagge: 'Usuario no es correcto - correo'
            });
        }

        //verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                messagge: 'Usuario no es correcto - estado'
            });
        }

        //verificar el password
        const passwordValido = bcryptjs.compareSync(password, usuario.password);

        if (!passwordValido) {
            return res.status(400).json({
                messagge: 'Usuario no es correcto - password'
            });
        }

        //generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req = request, res = response) => {
    const {id_token} = req.body;

    //const googleUser= await googleVerify(id_token);
    const {
        correo,
        nombre,
        imagen
    } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({
        correo
    });

    if (!usuario) {
        //tengo que crearlo
        const data = {
            nombre,
            correo,
            password:':P',
            imagen,
            google:true
        };

        usuario = new Usuario(data);
        await usuario.save();
    }

    //si el usuario en BD esta inactivo/borrado
    if (!usuario.estado) {
        return res.status(401).json({
            message:'Usuario bloqueado, hable con el administrador'
        });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);
    res.json({
        usuario,
        token
    });


    //console.log(googleUser);
    try {

        //res.json({message: 'Todo ok! google sign in'});

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Token Google no válido'
        });
    }
}

module.exports = {
    loginController,
    googleSignIn
}