const {
    request,
    response
} = require("express")

const rolValido = (req = request, res = response, next) => {

    //asegurarnos que estamos llamando bien el admin role
    /*req.usuario si esto viene es porque ya paso el middleware anterior de validarJWT eso 
    quiere decir que el susuario existe y ya se valido el JWT, asi no tengo que volver a hacer una consulta en el Backend*/
    if (!req.usuario) { //si no viene el usuario es porque no se valido correctamente el token
        return res.status(500).json({
            message: 'No ha validado el token'
        });

    }

    const { rol,nombre}=req.usuario;

    if (rol !=='ADMIN_ROLE' || rol !=='SUPER_ROLE') {
        return res.status(401).json({
            message: `${nombre} no tiene los privilegios`
        });
        
    }
    next();
}

//este middleware es en lugar del primero, este es como para permitir mas roles y hacerlo mas flexible
const tipoRolValido=(...roles)=>{//todo lo que la persona mande quedara en "roles", operador rest o spread.. esto por si solo lo va a transformar en un arreglo

    //hay que regresar una funcion como en el resto de middlewares, primero recibo argumentos arriba y aca ejecuto la funcion
    return (req = request, res = response, next)=>{
        //console.log(roles, req.usuario.rol);

           //asegurarnos que estamos llamando bien el admin role
    if (!req.usuario) {
        return res.status(500).json({
            message: 'No ha validado token'
        });
    }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                message: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }

}

module.exports = {
    rolValido,
    tipoRolValido
}