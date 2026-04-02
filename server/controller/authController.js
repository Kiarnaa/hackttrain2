const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Mock users for development when DB is not available
const mockUsers = [
  {
    id_users: 1,
    username: "Test Admin",
    email: "testadmin@example.com",
    age: 25,
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // "password"
  }
];

const signToken = (user) => {
  return jwt.sign({ id: user.id_users }, process.env.JWT_SECRET || 'mock-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async (req, res, next) => {
  const { name, email, password, age } = req.body;
  
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email et password sont requis' });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ username: name, email, password: hashed, age });
    const token = signToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.warn("Database not available, simulating registration");
    // Check if user already exists in mock data
    const existingMockUser = mockUsers.find(u => u.email === email);
    if (existingMockUser) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    // Create mock user
    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id_users: mockUsers.length + 1,
      username: name,
      email,
      age: age || null,
      password: hashed
    };
    mockUsers.push(newUser);

    const token = signToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ user: userWithoutPassword, token });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et password sont requis' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const payloadUser = { id_users: user.id_users, username: user.username, email: user.email, age: user.age };
    const token = signToken(user);

    res.json({ user: payloadUser, token });
  } catch (err) {
    console.warn("Database not available, using mock authentication");
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const payloadUser = { id_users: user.id_users, username: user.username, email: user.email, age: user.age };
    const token = signToken(user);

    res.json({ user: payloadUser, token });
  }
};

const me = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ user });
  } catch (err) {
    console.warn("Database not available, using mock user data");
    const user = mockUsers.find(u => u.id_users === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  }
};

module.exports = { register, login, me };
