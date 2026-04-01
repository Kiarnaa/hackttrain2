const express = require('express');
const router = express.Router();
const { getProduits, getProduitById } = require('../controller/produitController');

router.get('/', getProduits);
router.get('/:id', getProduitById);

module.exports = router;