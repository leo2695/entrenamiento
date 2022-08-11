const {
    Schema,
    model
} = require('mongoose');

const RoleSchema = Schema({
    rol:{
        type: String,
        required:[true,'El rol es obligatorio']
    }

}, {collection: 'roles'});

module.exports = model('Rol', RoleSchema);