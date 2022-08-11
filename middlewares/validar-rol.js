const {
    request,
    response
} = require("express")

const rolValido = (req = request, res = response, next) => {

    //asegurarnos que estamos llamando bien el admin role
    if (!req.usuario) {
        return res.status(500).json({
            message: 'No ha validado token'
        });

    }

    const { rol,nombre}=req.usuario;

    if (rol !=='ADMIN_ROLE') {
        return res.status(401).json({
            message: `${nombre} no tiene los privilegios`
        });
        
    }
    next();
}

const tipoRolValido=(...roles)=>{//todo lo que la persona mande quedara en roles

    
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