// seed.js se encarga de cargar datos de ejemplo en la base de datos.
// Es útil para tener registros iniciales con los que probar la aplicación.

import 'dotenv/config';

// Importamos todos los modelos desde el índice para que las asociaciones estén cargadas.
import {
  Producto,
  Usuario,
  Cliente,
  Rol,
  Categoria,
  ProductoCategoria,
  Favorito,
  sequelize,
} from '../src/models/index.js';

// Datos de ejemplo para la tabla productos.
const productosSeed = [
  {
    nombre: 'Notebook Pro 15"',
    precio: 1499999.00,
    stock: 12,
    descripcion: 'Notebook con procesador de última generación, 16 GB de RAM y SSD de 512 GB.',
  },
  {
    nombre: 'Auriculares Inalámbricos',
    precio: 89999.00,
    stock: 45,
    descripcion: 'Auriculares Bluetooth con cancelación de ruido y batería de 30 horas.',
  },
  {
    nombre: 'Monitor 27" Full HD',
    precio: 249999.00,
    stock: 8,
    descripcion: 'Monitor IPS de 27 pulgadas con excelente fidelidad de color.',
  },
  {
    nombre: 'Teclado Mecánico RGB',
    precio: 119999.00,
    stock: 23,
    descripcion: 'Teclado mecánico con switches rojos e iluminación RGB personalizable.',
  },
];

// Datos de ejemplo para la tabla clientes.
// El password se encripta automáticamente gracias al hook del modelo.
const clientesSeed = [
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'cliente@example.com',
    telefono: '1234567890',
    direccion: 'Av. Siempre Viva 742, Springfield',
    password: 'cliente123',
  },
];

// Datos de ejemplo para la tabla roles.
const rolesSeed = [
  { nombre: 'administrador', descripcion: 'Puede gestionar todo el sistema' },
  { nombre: 'vendedor', descripcion: 'Puede gestionar ventas' },
];

// Datos de ejemplo para la tabla usuarios (administrador del sistema).
// El password se encripta automáticamente gracias al hook del modelo.
const usuariosSeed = [
  {
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@example.com',
    edad: 30,
    telefono: '0000000000',
    direccion: 'Oficina central',
    password: 'admin123',
    // rolId se asigna dinámicamente buscando el rol "administrador".
  },
];

// Datos de ejemplo para la tabla categorías.
const categoriasSeed = [
  { nombre: 'Tecnología', descripcion: 'Productos tecnológicos' },
  { nombre: 'Audio', descripcion: 'Auriculares y dispositivos de audio' },
  { nombre: 'Periféricos', descripcion: 'Teclados, mouse y accesorios' },
];

const runSeed = async () => {
  try {
    // Verificamos que podemos conectarnos a la base de datos.
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    // 1. Insertamos los roles de ejemplo.
    for (const item of rolesSeed) {
      const [rol, created] = await Rol.findOrCreate({
        where: { nombre: item.nombre },
        defaults: item,
      });
      console.log(created ? `Rol creado: ${rol.nombre}` : `Rol ya existe: ${rol.nombre}`);
    }

    // Buscamos el rol administrador para asignarlo al usuario admin.
    const rolAdministrador = await Rol.findOne({ where: { nombre: 'administrador' } });

    // 2. Insertamos el usuario administrador con el rol asignado.
    for (const item of usuariosSeed) {
      const datosUsuario = { ...item, rolId: rolAdministrador.id };
      const [usuario, created] = await Usuario.findOrCreate({
        where: { email: datosUsuario.email },
        defaults: datosUsuario,
      });
      console.log(created ? `Usuario creado: ${usuario.email}` : `Usuario ya existe: ${usuario.email}`);
    }

    // 3. Insertamos los clientes de ejemplo.
    for (const item of clientesSeed) {
      const [cliente, created] = await Cliente.findOrCreate({
        where: { email: item.email },
        defaults: item,
      });
      console.log(created ? `Cliente creado: ${cliente.email}` : `Cliente ya existe: ${cliente.email}`);
    }

    // 4. Insertamos las categorías de ejemplo.
    for (const item of categoriasSeed) {
      const [categoria, created] = await Categoria.findOrCreate({
        where: { nombre: item.nombre },
        defaults: item,
      });
      console.log(created ? `Categoría creada: ${categoria.nombre}` : `Categoría ya existe: ${categoria.nombre}`);
    }

    // 5. Insertamos los productos de ejemplo.
    for (const item of productosSeed) {
      const [producto, created] = await Producto.findOrCreate({
        where: { nombre: item.nombre },
        defaults: item,
      });
      console.log(created ? `Producto creado: ${producto.nombre}` : `Producto ya existe: ${producto.nombre}`);
    }

    // 6. Relacionamos productos con categorías (relación MUCHOS A MUCHOS).
    // Para simplificar, usamos findOrCreate en la tabla intermedia.
    const productosCreados = await Producto.findAll();
    const categoriasCreadas = await Categoria.findAll();

    // Mapa de nombres a instancias para facilitar la asignación.
    const categoriaPorNombre = {};
    for (const categoria of categoriasCreadas) {
      categoriaPorNombre[categoria.nombre] = categoria;
    }

    const asignaciones = {
      'Notebook Pro 15"': ['Tecnología'],
      'Auriculares Inalámbricos': ['Audio'],
      'Monitor 27" Full HD': ['Tecnología'],
      'Teclado Mecánico RGB': ['Periféricos'],
    };

    for (const producto of productosCreados) {
      const nombresCategorias = asignaciones[producto.nombre] || [];
      for (const nombreCategoria of nombresCategorias) {
        const categoria = categoriaPorNombre[nombreCategoria];
        if (categoria) {
          const [, created] = await ProductoCategoria.findOrCreate({
            where: { productoId: producto.id, categoriaId: categoria.id },
            defaults: { productoId: producto.id, categoriaId: categoria.id },
          });
          if (created) {
            console.log(`Asignado: ${producto.nombre} -> ${categoria.nombre}`);
          }
        }
      }
    }

    // 7. Agregamos algunos favoritos al cliente de ejemplo.
    const clienteEjemplo = await Cliente.findOne({ where: { email: 'cliente@example.com' } });
    if (clienteEjemplo && productosCreados.length > 0) {
      for (const producto of productosCreados.slice(0, 2)) {
        const [, created] = await Favorito.findOrCreate({
          where: { clienteId: clienteEjemplo.id, productoId: producto.id },
          defaults: { clienteId: clienteEjemplo.id, productoId: producto.id },
        });
        if (created) {
          console.log(`Favorito agregado: cliente ${clienteEjemplo.email} -> ${producto.nombre}`);
        }
      }
    }

    console.log('Seed completado correctamente.');
  } catch (error) {
    console.error('Error al ejecutar el seed:', error);
  } finally {
    // Cerramos la conexión para que el script termine.
    await sequelize.close();
  }
};

runSeed();
