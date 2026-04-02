const produitModel = require('../models/produitModel');

// Mock data for development when DB is not available
const mockProduits = [
  {
    id_products: 1,
    name: "Veste en Laine",
    description: "Veste chaude et confortable",
    price: 185000,
    image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",
    size: "M",
    color: "Beige",
    hover_image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",
    delivery: "Standard",
    published: true
  },
  {
    id_products: 2,
    name: "Pantalon Chino",
    description: "Pantalon élégant",
    price: 95000,
    image_url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
    size: "L",
    color: "Noir",
    hover_image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
    delivery: "Express",
    published: true
  }
];

const getProduits = async (req, res, next) => {
    try {
        const produits = await produitModel.getAllProduits();
        res.json({ produits });
    } catch (err) {
        console.warn("Database not available, using mock data");
        res.json({ produits: mockProduits });
    }
};

const getProduitById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'id invalide' });
        const produit = await produitModel.findById(id);
        if (!produit) return res.status(404).json({ message: 'produit non trouve' });
        res.json({ produit });
    } catch (err) {
        console.warn("Database not available, using mock data");
        const produit = mockProduits.find(p => p.id_products === parseInt(req.params.id));
        if (!produit) return res.status(404).json({ message: 'produit non trouve' });
        res.json({ produit });
    }
};

const createProduit = async (req, res, next) => {
    try {
        const produit = req.body;
        const newProduit = await produitModel.createProduit(produit);
        res.status(201).json({ produit: newProduit });
    } catch (err) {
        console.warn("Database not available, simulating create");
        const newProduit = {
            ...req.body,
            id_products: mockProduits.length + 1
        };
        mockProduits.push(newProduit);
        res.status(201).json({ produit: newProduit });
    }
};

const updateProduit = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'id invalide' });
        const produit = req.body;
        const updatedProduit = await produitModel.updateProduit(id, produit);
        if (!updatedProduit) return res.status(404).json({ message: 'produit non trouve' });
        res.json({ produit: updatedProduit });
    } catch (err) {
        console.warn("Database not available, simulating update");
        const index = mockProduits.findIndex(p => p.id_products === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ message: 'produit non trouve' });
        mockProduits[index] = { ...mockProduits[index], ...req.body };
        res.json({ produit: mockProduits[index] });
    }
};

const deleteProduit = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'id invalide' });
        const deletedProduit = await produitModel.deleteProduit(id);
        if (!deletedProduit) return res.status(404).json({ message: 'produit non trouve' });
        res.json({ message: 'produit supprime' });
    } catch (err) {
        console.warn("Database not available, simulating delete");
        const index = mockProduits.findIndex(p => p.id_products === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ message: 'produit non trouve' });
        mockProduits.splice(index, 1);
        res.json({ message: 'produit supprime' });
    }
};

module.exports = { getProduits, getProduitById, createProduit, updateProduit, deleteProduit };



