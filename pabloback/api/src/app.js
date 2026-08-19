// app.js configura el servidor Express y la conexión a la base de datos.

import express from "express";
import cors from "cors";
import routes from './routes/index.js';
import sequelize from './config/database.js';

// Importamos el índice de modelos para que Sequelize registre las asociaciones.
// No inicia el servidor, solo carga la configuración de las relaciones.
import './models/index.js';

// Creamos la aplicación Express.
const app = express();

// cors() permite que el frontend (que corre en otro puerto) se comunique con el backend.
// Leemos los orígenes permitidos desde la variable CORS_ORIGINS del .env.
// Los orígenes pueden estar separados por comas, por ejemplo:
// CORS_ORIGINS=http://localhost:5173/,http://localhost:5174/
/*   const allowedOrigins = (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map(origin => origin.trim().replace(/\/$/, '')) // quitamos espacios y la barra final
    .filter(Boolean);   */

// Versión simple con un vector (array) de orígenes permitidos.
const allowedOrigins = [
    'https://miszapatos.com',
    'http://localhost:5173',
    'http://localhost:5174',
];

const corsOptions = {
    // origin es una función que decide si deja pasar la petición.
    origin: (origin, callback) => {
        // Las peticiones sin origin (como curl o apps móviles) se permiten.
        if (!origin) return callback(null, true);

        // Si el vector contiene '*', permitimos todos los orígenes.
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn(`Origen no permitido por CORS: ${origin}`);
        return callback(new Error('No permitido por CORS'));
    },
    credentials: true,
};

app.use(cors(corsOptions));

// express.json() permite leer el cuerpo de las peticiones en formato JSON.
app.use(express.json());

// Asociamos todas las rutas al path raíz '/'.
// Las rutas internas definirán sus propios sub-paths, por ejemplo /productos, /usuarios.
app.use('/', routes);

// El puerto se lee de una variable de entorno o, si no existe, usamos 3000.
const PUERTO = process.env.PORT || 3000;

// Función que inicia el servidor una vez verificada la conexión con la base de datos.
const iniciarServidor = async () => {
    try {
        // sequelize.authenticate() solo verifica que se puede conectar a la base de datos.
        // No realiza migraciones ni modifica tablas.
        
       // await sequelize.sync( { alter: true } );
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // app.listen() pone al servidor a escuchar peticiones en el puerto indicado.
        app.listen(PUERTO, () => {
            console.log('Servidor iniciado correctamente en el puerto:', PUERTO);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

iniciarServidor();
