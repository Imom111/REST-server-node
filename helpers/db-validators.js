const { 
    Usuario,
    Categoria,
    Role,
    Producto
} = require('../models/index.js');

const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
    return true;
}

const emailExiste = async( correo = '' ) => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo ${ correo } ya fue registrado en la BD`);
    }
    return true;
}

const existeUsuarioPorId = async( id ) => {
    const existencia = await Usuario.findById(id);
    if ( !existencia ) {
        throw new Error(`El id ${ id } no existe en la BD - usuario`);
    }
    return true;
}

const existeCategoriaPorId = async( id ) => {
    const existencia = await Categoria.findById(id);
    if ( !existencia ) {
        throw new Error(`El id ${ id } no existe en la BD - categoria`);
    }
    return true;
}

const existeProductoPorId = async( id ) => {
    const existencia = await Producto.findById(id);
    if ( !existencia ) {
        throw new Error(`El id ${ id } no existe en la BD - producto`);
    }
    return true;
}

const existeProductoPorNombre = async( nombre ) => {
    const existencia = await Producto.findOne({ 'nombre': nombre });
    if ( existencia ) {
        throw new Error(`El nombre ${ nombre } ya existe en la BD - producto`);
    }
    return true;
}

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no está permitida, ${ colecciones }`);
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    existeProductoPorNombre,
    coleccionesPermitidas
}