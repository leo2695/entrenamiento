const {response,request} = require("express");

const {Categoria}=require('../models');

const crearCategoria= async (req=request,res=response)=>{

    const nombre=req.body.nombre.toUpperCase();

    //si ya existe la categoria
    const categoriaDB=await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            message: `La categoría: ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data={
        nombre,
        usuario: req.usuario._id
    }

    //prepararlo para guardar
    const categoria=await new Categoria(data);
    //guardar en db
    await categoria.save();

    res.status(201).json({
        categoria
    });

}

//OBTENER categorias paginado total populate
const obtenerCategorias=async(req=request,res=response)=>{
    const{limite=5, desde=0}=req.query;
    const queryEstado={estado: true};

    const [totalCategorias,categorias]= await Promise.all([
        Categoria.countDocuments(queryEstado),
        Categoria.find(queryEstado)
        .populate('usuario','nombre') //aquí solo sale el nombre de ese usuario
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({totalCategorias,categorias});
}

//OBTENER categoria por id - populate
const obtenerCategoriaID=async(req=request,res=response)=>{
const {id}=req.params;

const [categoriaDB]= await Promise.all([
    Categoria.findOne({_id:id})
    .populate('usuario')
]); 

res.json(categoriaDB);

}

//ACTUALIZAR
const actualizarCategoria= async (req=request, res=response)=>{
    const {id} = req.params;
    const {estado, usuario,...actualizar} = req.body; //... esto se llama operador rest es como decir que quiero ese resto de cosas que no especifique

    actualizar.nombre=actualizar.nombre.toUpperCase();
    actualizar.usuario=req.usuario._id;
    const categoriaDB=await Categoria.findByIdAndUpdate(id,actualizar, {new:true});

    res.json(categoriaDB);
}

//BORRAR estado:false
const eliminarCategoria= async (req=request, res=response)=>{

    const { id }=req.params;

    //Cambiar Estado Categoria
    const categoria=await Categoria.findByIdAndUpdate(id, { estado:false});

    res.json({categoria});
}

module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaID,
    eliminarCategoria,
    actualizarCategoria
}