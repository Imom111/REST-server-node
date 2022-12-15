const { response, request } = require('express');
const { Categoria } = require('./../models');

const categoryGet = async(req = request, res = response) => {
    const id = req.params.id;
    const category = await Categoria.findById( id ).populate('usuario');
    res.status(200).json({
        category
    });
}

const categoryGetAll = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ categorias, total ] = await Promise.all([
        await Categoria.find( query )
            .populate('usuario')
            .limit(Number(limite))
            .skip(Number(desde)),
            Categoria.countDocuments( query )
    ]);
    res.json({ total, categorias });

}

const categoryPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, usuario, estado, __v, ...resto } = req.body;
    const property = 'nombre';
    resto[property] = resto[property].toUpperCase();
    const category = await Categoria.findByIdAndUpdate( id, resto, { new: true} );
    res.json(category);
}

const categoryPost = async(req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: 'La categoría ya existe'
        });
    }

    const data = {
        nombre,
        usuario: req.user._id
    }

    const category = new Categoria( data );
    await category.save();
    res.status(200).json( category );
}

const categoryDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const category = await Categoria.findOneAndUpdate( {'_id': id}, { estado: false }, { new: true} );
    // const usuarioAutentificado = req.user;
    // res.json({ usuario, usuarioAutentificado });
    res.json({ category });
}

module.exports = {
    categoryGet,
    categoryPut,
    categoryPost,
    categoryDelete,
    categoryGetAll
}