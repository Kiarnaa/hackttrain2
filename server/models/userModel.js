const db = require('../config/db');

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await db.query('SELECT id_users, username, email, age FROM users WHERE id_users = $1', [id]);
  return result.rows[0] || null;
};

const findAll = async () => {
  const result = await db.query('SELECT id_users, username, email, age FROM users');
  return result.rows;
};

const createUser = async ({ username, email, password, age }) => {
  const result = await db.query(
    'INSERT INTO users (username, email, password, age) VALUES ($1, $2, $3, $4) RETURNING id_users, username, email, age',
    [username, email, password, age || null]
  );
  return result.rows[0];
};

const updateUser = async (id, fields) => {
  const setClauses = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(fields)) {
    if (!['username', 'email', 'password', 'age'].includes(key)) continue;
    setClauses.push(`${key} = $${index}`);
    values.push(value);
    index += 1;
  }

  if (setClauses.length === 0) {
    return findById(id);
  }

  values.push(id);
  const query = `UPDATE users SET ${setClauses.join(', ')} WHERE id_users = $${index} RETURNING id_users, username, email, age`;
  const result = await db.query(query, values);
  return result.rows[0] || null;
};

const deleteUser = async (id) => {
  const result = await db.query('DELETE FROM users WHERE id_users = $1 RETURNING id_users', [id]);
  return result.rows[0] || null;
};

module.exports = {
  findByEmail,
  findById,
  findAll,
  createUser,
  updateUser,
  deleteUser,
};
