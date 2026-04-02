const produitModel = require('../models/produitModel');

// Mock data for development when DB is not available
const mockProduits = [
  {
    id_products: 1,
    name: "Chemise en Lin Craie",
    description: "Coupe décontractée, 100% lin naturel.",
    price: 88,
    old_price: null,
    tag: "Nouveau",
    category: "Vêtements",
    sub: "Hauts",
    size: "XS,S,M,L,XL",
    color: "#EAE0D0,#2C2420,#6B1E2A",
    image_url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    published: true
  },
  {
    id_products: 2,
    name: "Pull Mérinos",
    description: "Mérinos éthique, poids intermédiaire.",
    price: 112,
    old_price: 148,
    tag: "Soldes",
    category: "Vêtements",
    sub: "Hauts",
    size: "S,M,L",
    color: "#C8B9A8,#1A1410,#4A3728",
    image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    published: true
  },
  {
    id_products: 3,
    name: "Sur-chemise en Toile",
    description: "Toile de coton lavée, deux poches poitrine.",
    price: 155,
    old_price: null,
    tag: "Best-seller",
    category: "Vêtements",
    sub: "Manteaux",
    size: "S,M,L,XL",
    color: "#8C7B6B,#2C2420",
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80",
    published: true
  },
  {
    id_products: 4,
    name: "Pantalon Large",
    description: "Tissu crêpe fluide, taille élastique.",
    price: 95,
    old_price: null,
    tag: null,
    category: "Vêtements",
    sub: "Bas",
    size: "XS,S,M,L,XL",
    color: "#E8E0D0,#2C2420,#4A5C4A",
    image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
    published: true
  },
  {
    id_products: 5,
    name: "Robe Midi Satinée",
    description: "Viscose satinée, bretelles réglables.",
    price: 128,
    old_price: null,
    tag: "Nouveau",
    category: "Vêtements",
    sub: "Robes",
    size: "XS,S,M,L",
    color: "#D4B896,#2C2420,#8B7355",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    published: true
  },
  {
    id_products: 6,
    name: "Manteau en Laine",
    description: "60% mélange laine, épaules tombantes.",
    price: 295,
    old_price: 380,
    tag: "Soldes",
    category: "Vêtements",
    sub: "Manteaux",
    size: "S,M,L,XL",
    color: "#C8B9A8,#1A1410",
    image_url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&q=80",
    published: true
  },
  {
    id_products: 7,
    name: "Mule en Cuir",
    description: "Cuir pleine fleur tanné végétal.",
    price: 145,
    old_price: null,
    tag: "Best-seller",
    category: "Chaussures",
    sub: "Ballerines",
    size: "36,37,38,39,40,41",
    color: "#C8A882,#2C2420,#6B1E2A",
    image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
    published: true
  },
  {
    id_products: 8,
    name: "Chelsea Boot",
    description: "Élastiques glissants, semelle cuir.",
    price: 220,
    old_price: null,
    tag: "Nouveau",
    category: "Chaussures",
    sub: "Bottes",
    size: "36,37,38,39,40,41,42",
    color: "#2C2420,#8C7B6B",
    image_url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    published: true
  },
  {
    id_products: 9,
    name: "Sneaker Court",
    description: "Silhouette basse, semelle caoutchouc naturel.",
    price: 168,
    old_price: 210,
    tag: "Soldes",
    category: "Chaussures",
    sub: "Baskets",
    size: "36,37,38,39,40,41,42,43",
    color: "#FAFAF8,#2C2420",
    image_url: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80",
    published: true
  },
  {
    id_products: 10,
    name: "Sandale à Lanières",
    description: "Bride cheville réglable, semelle liège.",
    price: 118,
    old_price: null,
    tag: null,
    category: "Chaussures",
    sub: "Sandales",
    size: "36,37,38,39,40,41",
    color: "#C8A882,#2C2420",
    image_url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
    published: true
  },
  {
    id_products: 11,
    name: "Bottine",
    description: "Talon carré, zip latéral, cuir souple.",
    price: 195,
    old_price: null,
    tag: null,
    category: "Chaussures",
    sub: "Bottes",
    size: "36,37,38,39,40,41",
    color: "#6B5040,#2C2420",
    image_url: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
    published: true
  },
  {
    id_products: 12,
    name: "Ballerine",
    description: "Cuir nappa doux, bout amande.",
    price: 98,
    old_price: null,
    tag: "Best-seller",
    category: "Chaussures",
    sub: "Ballerines",
    size: "35,36,37,38,39,40",
    color: "#C8A882,#2C2420,#6B1E2A",
    image_url: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&q=80",
    hover_image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
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



