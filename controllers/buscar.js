const { request, response } = require("express");
const { ObjectId }=require('mongoose').Types;
const { Usuario, Producto, Categoria}=require('../models');
const coleccionesPermitidas=[
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios=async(termino='',res=response)=>{

    const esMongoID= ObjectId.isValid(termino); // si es id de mongo devuelve true

    if (esMongoID) {
        const usuario=await Usuario.findById(termino);
       return res.json({
            results:(usuario)?[usuario]:[]
        });
    }

    //busquedas insensibles
    const regex=new RegExp(termino,'i');

    const usuarios=await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    });

    const cantidad=await Usuario.countDocuments({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    });

    return res.json({
        results:[{cantidad}, usuarios]
    });

}

const buscarProductos=async(termino='',res=response)=>{

    const esMongoID= ObjectId.isValid(termino); // si es id de mongo devuelve true

    if (esMongoID) {
       const producto=await Producto.findById(termino)
                        .populate('categoria','nombre');
       return res.json({
            results:(producto)?[producto]:[]
        });
    }

    //busquedas insensibles
    const regex=new RegExp(termino,'i');

    const categorias=await Categoria.find({nombre:regex,estado:true});
    const productos=await Producto.find({
        $or:[{nombre:regex},{descripcion:regex}],
        $and:[{estado:true}]
    }).populate('categoria','nombre');

    const cantidad=await Producto.countDocuments({
        $or:[{nombre:regex},{descripcion:regex}],
        $and:[{estado:true}]
    });

    return res.json({
        results:[{cantidad}, productos]
    });

}

const buscarCategorias=async(termino='',res=response)=>{

    const esMongoID= ObjectId.isValid(termino); // si es id de mongo devuelve true

    if (esMongoID) {
       const categoria=await Categoria.findById(termino)
                        .populate('usuario','nombre');
       return res.json({
            results:(categoria)?[categoria]:[]
        });
    }

    //busquedas insensibles
    const regex=new RegExp(termino,'i');
    const categorias=await Categoria.find({nombre:regex,estado:true}).populate('usuario','nombre');

    const cantidad=await Categoria.countDocuments({
        $or:[{nombre:regex}],
        $and:[{estado:true}]
    });

    return res.json({
        results:[{cantidad}, categorias]
    });

}

const buscar=(req=request,res=response)=>{

    const{ coleccion, termino }=req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            message: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);
            break;
        case 'categorias':
            buscarCategorias(termino,res);
            break;
        case 'productos':
            buscarProductos(termino,res);
            break;
    
        default:
            res.status(500).json({
                message:'Error en el backend'
            });
            break;
    }
}

module.exports={
    buscar
}