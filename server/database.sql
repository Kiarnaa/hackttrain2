CREATE DATABASE ETHKL;
USE ETHKL;

CREATE TABLE users (
    id_users INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    age INT CHECK (age >= 18),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    id_products INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE wishlists (
    id_wishlists INT AUTO_INCREMENT PRIMARY KEY,
    id_users INT,
    id_products INT,
    FOREIGN KEY (id_users) REFERENCES users(id_users),
    FOREIGN KEY (id_products) REFERENCES products(id_products)
);

CREATE TABLE command (
    id_command INT AUTO_INCREMENT PRIMARY KEY,
    id_users INT,
    id_products INT,
    quantity INT NOT NULL,
    FOREIGN KEY (id_users) REFERENCES users(id_users),
    FOREIGN KEY (id_products) REFERENCES products(id_products)
);

CREATE TABLE admin(
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
    id_categories INT AUTO_INCREMENT PRIMARY KEY,
    id_products INT,
    FOREIGN KEY (id_products) REFERENCES products(id_products),
);

CREATE TABLE livraison (
    id_livraison INT AUTO_INCREMENT PRIMARY KEY,
    id_command INT,
    FOREIGN KEY (id_command) REFERENCES command(id_command),
);

