const express = require('express');
const router = express.Router();
const { getProduits, getProduitById, createProduit, updateProduit, deleteProduit } = require('../controller/produitController');

router.get('/', getProduits);
router.get('/:id', getProduitById);
router.post('/', createProduit);
router.put('/:id', updateProduit);
router.delete('/:id', deleteProduit);

module.exports = router;