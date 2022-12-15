const { response, request } = require('express');
const Producto = require('./../models/product');
const Categoria = require('./../models/category');
const Usuario = require('./../models/usuario');


const productGet = async(req = request, res = response) => {
    const id = req.params.id;
    const product = await Producto.findById( id )
        .populate('usuario')
        .populate('categoria');
    res.status(200).json({
        product
    });
}

const productGetAll = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ productos, total ] = await Promise.all([
        await Producto.find( query )
            .populate('usuario')
            .populate('categoria')
            .limit(Number(limite))
            .skip(Number(desde)),
            Producto.countDocuments( query )
    ]);
    res.json({ total, productos });

}

const productPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { nombre, precio, categoriaId, descripcion, disponible } = req.body;
    const userId = req.user._id;
    const data = {
        nombre,
        usuario: userId,
        precio,
        categoria: categoriaId,
        descripcion,
        disponible
    };
    console.log( data );
    const producto = await Producto.findByIdAndUpdate( id, data );
    res.json(producto);
}

const productPost = async(req = request, res = response) => {
    const { nombre, precio, categoriaId, descripcion, disponible = false } = req.body;
    const userId = req.user._id;
    const data = {
        nombre,
        usuario: userId,
        precio,
        categoria: categoriaId,
        descripcion,
        disponible
    };

    const product = new Producto( data );
    await product.save();
    res.status(200).json({ product });
}

const productDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const product = await Producto.findOneAndUpdate( {'_id': id}, { estado: false }, { new: true} );
    res.json({
        product
    });
}

module.exports = {
    productGet,
    productPut,
    productPost,
    productDelete,
    productGetAll
}