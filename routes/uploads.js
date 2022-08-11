const {Router} = require('express');

const {check} = require('express-validator');
const { cargarArchivo, actualizarImagen, obtenerImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(col=>coleccionesPermitidas(col, ['usuarios','productos'])),
    validarCampos
], actualizarImagenCloudinary);
//], actualizarImagen);

router.get('/:coleccion/:id',[
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(col=>coleccionesPermitidas(col, ['usuarios','productos'])),
    validarCampos
], obtenerImagen);

module.exports = router;