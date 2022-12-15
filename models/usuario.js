const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        // valor obligatorio, mensaje de error
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        // No permitir duplicados en la base de datos
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: [true],
        default: 'USER_ROLE'
        // Comparación de una enumeración
        // enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },
    estado: {
        type: Boolean,
        // Valor por defecto
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Remover parámetros
UsuarioSchema.methods.toJson = function () {
    const { __v, password, _id, ...user  } = this.toObject();
    user.uid = _id
    return user;
}

module.exports = model( 'Usuario', UsuarioSchema );