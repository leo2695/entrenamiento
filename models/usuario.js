const {
    Schema,
    model
} = require('mongoose');

const UsuarioSchema = Schema({

    identificacion: {
        type: String,
        required: [true, 'La identificacion es obligatorio'],
        unique: true
    },

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },

    imagen: {
        type: String,
    },

    fechaNacimiento: {
        type: String,
        //field: 'fecha_modificacion'
        required: [true, 'La fecha de Nacimiento es requerida']
    },

    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE'
        //emun: ['ADMIN_ROLE', 'USER_ROLE']
    },

    estado: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    }

});

//puedo crear metodos para sobreescribir los metodos existentes de Mongoose o crear metodos personalizados//
//sobreescribir el metodo toJSON
UsuarioSchema.methods.toJSON = function () {
    //tiene que ser una función normal, no puede ser flecha porque necesito usar el this. porque va a hacer referencia a la instancia creada
    const {
        __v,
        password,
        _id,
        ...usuario
    } = this.toObject(); //acá los nombres que ponga especificamente no los veo en las respuestas de postman, solo los que deje en ...usuario se van a mostrar
    //transformar un nombre de campo por otro nombre
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);