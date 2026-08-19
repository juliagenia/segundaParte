// models/index.js centraliza la importación de todos los modelos
// y define las relaciones (asociaciones) entre ellos.
// De este archivo se exportan los modelos ya configurados para usarlos
// en controladores, seeds o rutas.

import sequelize from '../config/database.js';

// Importamos cada modelo.
// Cada modelo se registra en la instancia de Sequelize al ser importado.
import Usuario from './usuarios.model.js';
import Producto from './productos.model.js';
import Rol from './roles.model.js';
import Cliente from './clientes.model.js';
import Favorito from './favoritos.model.js';
import Categoria from './categorias.model.js';
import ProductoCategoria from './productoCategoria.model.js';

// ============================================================
// RELACIÓN 1 A MUCHOS: Rol -> Usuario
// Un rol puede tener muchos usuarios.
// Un usuario puede tener, como máximo, un solo rol (participación opcional).
// La clave foránea se llama "rolId" y vive en la tabla usuarios.
// ============================================================
Rol.hasMany(Usuario, {
    foreignKey: 'rolId',
    as: 'usuarios',       // alias para acceder a los usuarios de un rol
});
Usuario.belongsTo(Rol, {
    foreignKey: 'rolId',
    as: 'rol',            // alias para acceder al rol de un usuario
});

// ============================================================
// RELACIÓN MUCHOS A MUCHOS: Cliente <-> Producto (Favoritos)
// Un cliente puede marcar muchos productos como favoritos.
// Un producto puede ser favorito de muchos clientes.
// La tabla intermedia es "Favorito" (tabla favoritos).
// ------------------------------------------------------------
// NOTA SOBRE LOS PARÁMETROS DE belongsToMany:
// - through: modelo que actúa como tabla intermedia.
// - foreignKey: columna de la tabla intermedia que apunta al
//   modelo origen (el que llama a belongsToMany).
//   Ejemplo: Cliente.belongsToMany(...) usa 'clienteId'.
// - otherKey: columna de la tabla intermedia que apunta al
//   modelo destino (el asociado).
//   Ejemplo: Cliente.belongsToMany(Producto, ...) usa 'productoId'.
// - as: alias con el que vamos a incluir la relación en consultas.
//   Ejemplo: include: { model: Producto, as: 'productosFavoritos' }.
// ============================================================
Cliente.belongsToMany(Producto, {
    through: Favorito,
    foreignKey: 'clienteId',
    otherKey: 'productoId',
    as: 'productosFavoritos',
});
Producto.belongsToMany(Cliente, {
    through: Favorito,
    foreignKey: 'productoId',
    otherKey: 'clienteId',
    as: 'clientesFavoritos',
});

// ============================================================
// RELACIÓN MUCHOS A MUCHOS: Producto <-> Categoria
// Un producto puede tener muchas categorías.
// Una categoría puede contener muchos productos.
// La tabla intermedia es "ProductoCategoria" (tabla productos_categorias).
// Misma lógica de belongsToMany explicada arriba: foreignKey, otherKey y as.
// ============================================================
Producto.belongsToMany(Categoria, {
    through: ProductoCategoria,
    foreignKey: 'productoId',
    otherKey: 'categoriaId',
    as: 'categorias',
});
Categoria.belongsToMany(Producto, {
    through: ProductoCategoria,
    foreignKey: 'categoriaId',
    otherKey: 'productoId',
    as: 'productos',
});

// Exportamos los modelos para poder usarlos en toda la aplicación.
export {
    sequelize,
    Usuario,
    Producto,
    Rol,
    Cliente,
    Favorito,
    Categoria,
    ProductoCategoria,
};

export default {
    sequelize,
    Usuario,
    Producto,
    Rol,
    Cliente,
    Favorito,
    Categoria,
    ProductoCategoria,
};
