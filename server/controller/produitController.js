const bcrypt = require('bcryptjs');
const produitModel = require('../models/produitModel');

const getProduits = async (rec , res, next) => {
    try {
        const produits = await produitModel.findAll();
        res.json({ produits });
    }
    catch (err) {
        next(err);
    }
}    

const getProduitByid = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number,isNaN(id)) return res.status(400).json({ message : 'id invalide' });
        const produit = await produitModel.findById(id);
        if (!produit) return res.status(404).json({message : 'produit non trouve'});
        res.json({ produit });
    }
    catch (err) {
        next(err);
    }
}

module.exports = { getProduits, getProduitByid };



