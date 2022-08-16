const jwt = require('jsonwebtoken');

//trabaja en callbacks entonces hay que generar una promesa manualmente
const generarJWT = (uid='') => { //uid = identificador unico del usuario


    return new Promise((resolve, reject) => {

        //generarlo
        const payload={uid};

        jwt.sign(payload, process.env.SECRETKEY,{
            expiresIn:'4h'
        },(error,token)=>{

            if (error) {
                console.log(error);
                reject('No se pudo generar el JWT');
            }else{
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT
}