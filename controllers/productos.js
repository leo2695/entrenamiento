const {response,request} = require("express");

const {Producto}=require('../models');

//Crear Producto
const crearProducto= async (req=request,res=response)=>{

    const {estado, usuario,...body}=req.body;
    //const nombre=req.body.nombre.toUpperCase(); //así o como lo dejé en la línea 12

    //si ya existe el Producto
    const productoDB=await Producto.findOne({nombre: body.nombre.toUpperCase()});

    if(productoDB){
        return res.status(400).json({
            message: `El producto: ${productoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data={
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    //prepararlo para guardar
    const producto=await new Producto(data);
    //guardar en db
    await producto.save();

    res.status(201).json({
        producto
    });

}

//OBTENER productos paginado total populate
const obtenerProductos=async(req=request,res=response)=>{
    const{limite=5, desde=0}=req.query;
    const queryEstado={estado: true};

    const [totalProductos,productos]= await Promise.all([
        Producto.countDocuments(queryEstado),
        Producto.find(queryEstado)
        .populate('usuario','nombre') //aquí solo sale el nombre de ese usuario
        .populate('categoria','nombre') //aquí solo sale el nombre de ese usuario
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({totalProductos,productos});
}

//OBTENER Producto por id - populate
const obtenerProductoID=async(req=request,res=response)=>{
const {id}=req.params;

const [productoDB]= await Promise.all([
    Producto.findOne({_id:id})
    .populate('usuario')
    .populate('categoria')
]); 

res.json(productoDB);

}

//ACTUALIZAR
const actualizarProducto= async (req=request, res=response)=>{
    const {id} = req.params;
    const {estado, usuario,...actualizar} = req.body; //... esto se llama operador rest es como decir que quiero ese resto de cosas que no especifique

    if(actualizar.nombre){
        actualizar.nombre=actualizar.nombre.toUpperCase();
    }
    actualizar.usuario=req.usuario._id;
    const productoDB=await Producto.findByIdAndUpdate(id,actualizar, {new:true});

    res.json(productoDB);
}

//BORRAR estado:false
const eliminarProducto= async (req=request, res=response)=>{

    const { id }=req.params;

    //Cambiar Estado Producto
    const producto=await Producto.findByIdAndUpdate(id, { estado:false});

    res.json({producto});
}

module.exports={
    crearProducto,
    obtenerProductos,
    obtenerProductoID,
    eliminarProducto,
    actualizarProducto
}