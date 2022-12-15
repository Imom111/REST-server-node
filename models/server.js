const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('./../database/config.js');
class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            user: '/api/user',
            auth: '/api/auth',
            category: '/api/category',
            product: '/api/product',
            search: '/api/search',
            uploads: '/api/uploads'
        }
    
        // Conectar a base ded atos
        this.conectarDB();

        this.middlewares();
        
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }
    middlewares(){
        // cors
        this.app.use(cors());

        // lectura y parseo de body
        this.app.use( express.json() );

        // directorio publico
        this.app.use( express.static('public') );

        // carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            // Permite crear directorios especificados
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.category, require('../routes/category'));
        this.app.use(this.paths.product, require('../routes/product'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }
    
    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;