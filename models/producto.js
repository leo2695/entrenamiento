const {Schema,model} = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //a como esté en models/usuario.js en la última línea
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion:{
        type: String
    },
    disponible:{
        type: Boolean,
        default: true
    },
    imagen:{
        type: String
    }

});

//puedo crear metodos para sobreescribir los existentes de Mongoose o crear personalizados
//sobreescribir
ProductoSchema.methods.toJSON = function () {
    //tiene que ser una función normal, no puede ser flecha
    const {
        __v,
        estado,
        ...data
    } = this.toObject(); //acá los nombres que ponga especificamente no los veo en las respuestas de postman, solo los que deje en ...data
    //transformarlo
    return data;
}

module.exports = model('Producto', ProductoSchema);