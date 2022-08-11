const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const {
    dbConnection
} = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        /*this.usuariosPath = '/api/usuarios';
        this.authPath='/api/auth';*/

        this.paths={
            auth: '/api/auth',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        }

        //Conectar BD
        this.database();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async database() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //directorio público
        this.app.use(express.static('public'));

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir:'/tmp/',
            createParentPath:true
        }));

        //Lectura y parseo del body
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port, () => { //callback
            console.log('Servidor corriendo en el puerto:', this.port);
        });
    }
}

module.exports = Server;