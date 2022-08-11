const path= require ('path');
const fs= require ('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto }=require('../models');

const cargarArchivo= async (req=request,res=response)=>{

    try {
    //Imagenes
    const pathArchivo= await subirArchivo(req.files,undefined,'imgs');
    
    //TXT
    //const pathArchivo= await subirArchivo(req.files,['txt','md'],'textos');

    res.json({
        archivo: pathArchivo
    });
   
    } catch (error) {
        res.status(400).json({error});
    }
  
}

const actualizarImagen= async (req=request, res=response)=>{

    const { id, coleccion}=req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo= await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    message: `No existe un usuario con el id: ${id}`
                });
            }
            break;

            case 'productos':
                modelo= await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        message: `No existe un producto con el id: ${id}`
                    });
                }
                break;
    
        default:
             return res.status(500).json({
                 message: 'No esta finalizado'
             });
            break;
    }

    //Limpiar imagenes previas
    if (modelo.imagen) {
        
        //hay que borrar la imagen del servidor
        const pathImagen=path.join(__dirname, '../uploads', coleccion, modelo.imagen );

        if (fs.existsSync(pathImagen)) { 
            //
            fs.unlinkSync(pathImagen);
        }
    }

    const pathArchivo= await subirArchivo(req.files,undefined,coleccion);
    modelo.imagen= pathArchivo;

    await modelo.save();


    res.json({
        modelo
    });

}

const obtenerImagen = async(req=request,res=response)=>{

    const { id, coleccion}=req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo= await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    message: `No existe un usuario con el id: ${id}`
                });
            }
            break;

            case 'productos':
                modelo= await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        message: `No existe un producto con el id: ${id}`
                    });
                }
                break;
    
        default:
             return res.status(500).json({
                 message: 'No esta finalizado'
             });
            break;
    }

    //Limpiar imagenes previas
    if (modelo.imagen) {
        
        //hay que borrar la imagen del servidor
        const pathImagen=path.join(__dirname, '../uploads', coleccion, modelo.imagen );

        if (fs.existsSync(pathImagen)) { 
            //
           return res.sendFile(pathImagen);
        }
    }

    const pathImagen=path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImagen);
}

const actualizarImagenCloudinary= async (req=request, res=response)=>{

    const { id, coleccion}=req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo= await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    message: `No existe un usuario con el id: ${id}`
                });
            }
            break;

            case 'productos':
                modelo= await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        message: `No existe un producto con el id: ${id}`
                    });
                }
                break;
    
        default:
             return res.status(500).json({
                 message: 'No esta finalizado'
             });
            break;
    }

    //Limpiar imagenes previas
    if (modelo.imagen) {
        
        //hay que borrar la imagen de Cloudinary
        const nombreArr = modelo.imagen.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1];

        const [public_id] = nombre.split('.');

        //console.log(public_id);
   
        await cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    
    modelo.imagen= secure_url;

    await modelo.save();


    res.json( modelo );

}

module.exports={
    cargarArchivo,
    actualizarImagen,
    obtenerImagen,
    actualizarImagenCloudinary
}