const Rol = require('../models/rol');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const {
    Producto
} = require('../models');

const esRolValido = async (rol = '') => {
    const existeRol = await Rol.findOne({
        rol
    });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe`);
    }
}

//verificar si la identificacion existe
const existeIdentificacion = async (identificacion = '') => {
    const existeIdentificacion = await Usuario.findOne({
        identificacion
    }); //va a buscar en el modelo una identificacion igual al argumento que estoy enviando

    //si encuentra una indentificacion igual a la que estoy pasando quiere decir que ya existe...
    if (existeIdentificacion) {
        throw new Error(`La identificacion: ${identificacion} ya existe`);
    }
}

//verificar si correo existe
const existeEmail = async (correo = '') => {

    const existeEmail = await Usuario.findOne({
        correo
    }); //va a buscar en el modelo un correo que sea igual al argumento que estoy enviando

    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya existe`);
    }
}

//verificar si existe el usuario por id
const existeUsuarioID = async (id = '') => {

    const existeUsuario = await Usuario.findById(id); //va a buscar en el modelo un correo que sea igual al argumento que estoy enviando

    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`);
    }
}

//Verificar si existe la categoria por id
const existeCategoriaBD = async (id = '') => {

    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {
        throw new Error(`La categoría con el id: ${id}, no existe`)

    }
}

//Verificar si existe el producto por id
const existeProductoBD = async (id = '') => {

    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El producto con el id: ${id}, no existe`)

    }
}

//Validar las colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida`);
    }

    return true;

}

module.exports = {
    esRolValido,
    existeIdentificacion,
    existeEmail,
    existeUsuarioID,
    existeCategoriaBD,
    existeProductoBD,
    coleccionesPermitidas
}