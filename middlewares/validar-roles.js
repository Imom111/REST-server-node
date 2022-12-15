const { request, response } = require('express');

const esAdminRole = ( req = request, res = response, next ) => {
    if ( !req.user ) {
        return res.status(500).json({
            msg: 'Se quiere validar rol sin validar token'
        });
    }

    const { rol, nombre } = req.user;
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } No es administrador - No es ADMIN_ROLE`
        });
    }
    next();
}

const tieneRole = ( ...roles) => {
    return ( req = request, res = response, next ) => {
        if ( !req.user ) {
            return res.status(500).json({
                msg: 'Se quiere validar rol sin validar token'
            });
        }
        if ( !roles.includes( req.user.rol ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}