const {request,response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    const{limite=5, desde=0}=req.query;
    const queryEstado={estado:true};

    const [totalRegistros,usuarios]=await Promise.all([ //destructuración de arreglos NO de objetos, el primero va ser el resultado de la primera promesa, en orden posicional de como se escribio el codigo no del orden en como se resuelvan en la ejecucion
        Usuario.countDocuments(queryEstado),
        Usuario.find(queryEstado)//eso es enviar una condicion
            .limit(Number(limite))
            .skip(Number(desde))

    ]);

    res.json({totalRegistros,usuarios});
}
const usuariosPut = async (req = request, res = response) => {
    const {id} = req.params;
    const {_id,password,google,...actualizar} = req.body; //... esto se llama operador rest es como decir que quiero ese resto de cosas que no especifique

    //validar con BD
    if (password) {
        //encriptar password
        const salt = bcryptjs.genSaltSync();
        actualizar.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB=await Usuario.findByIdAndUpdate(id,actualizar);

    res.json(usuarioDB);
}
const usuariosPost = async (req = request, res = response) => {

    const {
        identificacion,
        nombre,
        correo,
        password,
        rol,
        fechaNacimiento
    } = req.body;
    const usuario = new Usuario({
        identificacion,
        nombre,
        correo,
        password,
        rol,
        fechaNacimiento
    }); //crear nueva instancia de mi Usuario

    //encriptar password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en BD
    await usuario.save();

    res.json({
        //message: 'POST API Controller',
        usuario
    });
}
const usuariosPatch = (req = request, res = response) => {
    res.json({
        message: 'PATCH API Controller'
    });
}
const usuariosDelete = async (req = request, res = response) => {
    const { id }=req.params;

    //const uid=req.uid;

    //Borrar Físicamente
    //const usuario=await Usuario.findByIdAndDelete(id);
    //res.json(usuario);

    //Cambiar Estado Usuario
    const usuario=await Usuario.findByIdAndUpdate(id, { estado:false});
    //const usuarioAutenticado= req.usuario;

    //res.json({usuario,uid});
    //res.json({usuario,usuarioAutenticado});
    res.json({usuario});
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}