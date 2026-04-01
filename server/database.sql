CREATE TABLE IF NOT EXISTS users (
  id_users SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  age INT CHECK (age >= 18),
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id_products SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS wishlists (
  id_wishlists SERIAL PRIMARY KEY,
  id_users INTEGER REFERENCES users(id_users) ON DELETE CASCADE,
  id_products INTEGER REFERENCES products(id_products) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS admin (
  id_admin SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id_categories SERIAL PRIMARY KEY,
  id_products INTEGER REFERENCES products(id_products) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS livraison (
  id_livraison SERIAL PRIMARY KEY,
  id_command INTEGER REFERENCES command(id_command) ON DELETE CASCADE,
  date_livraison DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'non commencé',
  CHECK (status IN ('non commencé', 'en cours', 'livré', 'annulé'))
);

CREATE TABLE payment (
  id_payment SERIAL PRIMARY KEY,
  id_command INTEGER REFERENCES command(id_command) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart (
  id_cart SERIAL PRIMARY KEY,
  id_users INTEGER REFERENCES users(id_users) ON DELETE CASCADE,
  id_products INTEGER REFERENCES products(id_products) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_users, id_products)
);

