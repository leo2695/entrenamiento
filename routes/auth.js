const {Router} = require('express');

const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { loginController, googleSignIn } = require('../controllers/auth');

const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('password','La contraseña no es válida').not().isEmpty(),
    validarCampos
],loginController);

//Google Sign In
router.post('/google',[
    check('id_token','El id_token es necesario').not().isEmpty(),
    validarCampos
],googleSignIn);


module.exports = router;