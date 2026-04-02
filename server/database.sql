CREATE TABLE IF NOT EXISTS users (
  id_users SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  age INT CHECK (age >= 18),
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS products (
  id_products SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url VARCHAR(255)
);

-- Add new columns if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS size VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS color VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sub VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS old_price NUMERIC(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tag VARCHAR(50);

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

CREATE TABLE IF NOT EXISTS command (
  id_command SERIAL PRIMARY KEY,
  id_users INTEGER NOT NULL REFERENCES users(id_users) ON DELETE CASCADE,
  id_products INTEGER NOT NULL REFERENCES products(id_products) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS livraison (
  id_livraison SERIAL PRIMARY KEY,
  id_command INTEGER REFERENCES command(id_command) ON DELETE CASCADE,
  date_livraison DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'non commencé',
  CHECK (status IN ('non commencé', 'en cours', 'livré', 'annulé'))
);

CREATE TABLE IF NOT EXISTS payment (
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

CREATE TABLE IF NOT EXISTS payment_webhooks (
  id_webhook SERIAL PRIMARY KEY,
  webhook_id VARCHAR(255) UNIQUE,
  id_payment INTEGER REFERENCES payment(id_payment),
  id_command INTEGER REFERENCES command(id_command),
  status TEXT NOT NULL DEFAULT 'pending',
  payload JSONB,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 5,
  next_retry_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  CHECK (status IN ('pending', 'processing', 'success', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_status ON payment_webhooks(status);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_next_retry ON payment_webhooks(next_retry_at);

  