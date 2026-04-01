const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAll();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Id invalide' });

    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Id invalide' });

    if (req.user.id_users !== id) {
      return res.status(403).json({ message: 'Métier non autorisé' });
    }

    const fields = {};
    const { username, email, password, age } = req.body;
    if (username) fields.username = username;
    if (email) fields.email = email;
    if (password) fields.password = await bcrypt.hash(password, 10);
    if (age) fields.age = age;

    const updatedUser = await userModel.updateUser(id, fields);
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ user: updatedUser });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Id invalide' });

    if (req.user.id_users !== id) {
      return res.status(403).json({ message: 'Métier non autorisé' });
    }

    const deleted = await userModel.deleteUser(id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
