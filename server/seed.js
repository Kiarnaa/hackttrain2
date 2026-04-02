require('dotenv').config();
const db = require('./config/db');

const products = [
  // CLOTHING
  {
    name: 'Chemise en Lin Craie',
    description: 'Coupe décontractée, 100% lin naturel.',
    price: 88.00, old_price: null, tag: 'Nouveau',
    category: 'Vêtements', sub: 'Hauts',
    size: 'XS,S,M,L,XL',
    color: '#EAE0D0,#2C2420,#6B1E2A',
    image_url:   'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
  },
  {
    name: 'Pull Mérinos',
    description: 'Mérinos éthique, poids intermédiaire.',
    price: 112.00, old_price: 148.00, tag: 'Soldes',
    category: 'Vêtements', sub: 'Hauts',
    size: 'S,M,L',
    color: '#C8B9A8,#1A1410,#4A3728',
    image_url:   'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80',
  },
  {
    name: 'Sur-chemise en Toile',
    description: 'Toile de coton lavée, deux poches poitrine.',
    price: 155.00, old_price: null, tag: 'Best-seller',
    category: 'Vêtements', sub: 'Manteaux',
    size: 'S,M,L,XL',
    color: '#8C7B6B,#2C2420',
    image_url:   'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80',
  },
  {
    name: 'Pantalon Large',
    description: 'Tissu crêpe fluide, taille élastique.',
    price: 95.00, old_price: null, tag: null,
    category: 'Vêtements', sub: 'Bas',
    size: 'XS,S,M,L,XL',
    color: '#E8E0D0,#2C2420,#4A5C4A',
    image_url:   'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
  },
  {
    name: 'Robe Midi Satinée',
    description: 'Viscose satinée, bretelles réglables.',
    price: 128.00, old_price: null, tag: 'Nouveau',
    category: 'Vêtements', sub: 'Robes',
    size: 'XS,S,M,L',
    color: '#D4B896,#2C2420,#8B7355',
    image_url:   'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
  },
  {
    name: 'Manteau en Laine',
    description: '60% mélange laine, épaules tombantes.',
    price: 295.00, old_price: 380.00, tag: 'Soldes',
    category: 'Vêtements', sub: 'Manteaux',
    size: 'S,M,L,XL',
    color: '#C8B9A8,#1A1410',
    image_url:   'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&q=80',
  },
  // SHOES
  {
    name: 'Mule en Cuir',
    description: 'Cuir pleine fleur tanné végétal.',
    price: 145.00, old_price: null, tag: 'Best-seller',
    category: 'Chaussures', sub: 'Ballerines',
    size: '36,37,38,39,40,41',
    color: '#C8A882,#2C2420,#6B1E2A',
    image_url:   'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80',
  },
  {
    name: 'Chelsea Boot',
    description: 'Élastiques glissants, semelle cuir.',
    price: 220.00, old_price: null, tag: 'Nouveau',
    category: 'Chaussures', sub: 'Bottes',
    size: '36,37,38,39,40,41,42',
    color: '#2C2420,#8C7B6B',
    image_url:   'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    name: 'Sneaker Court',
    description: 'Silhouette basse, semelle caoutchouc naturel.',
    price: 168.00, old_price: 210.00, tag: 'Soldes',
    category: 'Chaussures', sub: 'Baskets',
    size: '36,37,38,39,40,41,42,43',
    color: '#FAFAF8,#2C2420',
    image_url:   'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80',
  },
  {
    name: 'Sandale à Lanières',
    description: 'Bride cheville réglable, semelle liège.',
    price: 118.00, old_price: null, tag: null,
    category: 'Chaussures', sub: 'Sandales',
    size: '36,37,38,39,40,41',
    color: '#C8A882,#2C2420',
    image_url:   'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
  },
  {
    name: 'Bottine',
    description: 'Talon carré, zip latéral, cuir souple.',
    price: 195.00, old_price: null, tag: null,
    category: 'Chaussures', sub: 'Bottes',
    size: '36,37,38,39,40,41',
    color: '#6B5040,#2C2420',
    image_url:   'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80',
  },
  {
    name: 'Ballerine',
    description: 'Cuir nappa doux, bout amande.',
    price: 98.00, old_price: null, tag: 'Best-seller',
    category: 'Chaussures', sub: 'Ballerines',
    size: '35,36,37,38,39,40',
    color: '#C8A882,#2C2420,#6B1E2A',
    image_url:   'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&q=80',
    hover_image: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80',
  },
];

async function seedDatabase() {
  const client = await db.getClient();
  try {
    console.log('Ajout des colonnes manquantes si nécessaire...');
    const alterStatements = [
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100)',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS sub VARCHAR(100)',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS old_price NUMERIC(10,2)',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS tag VARCHAR(50)',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image VARCHAR(255)',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS size VARCHAR(100)',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS color VARCHAR(100)',
    ];
    for (const sql of alterStatements) {
      await client.query(sql);
    }

    console.log('Suppression des produits existants...');
    await client.query('DELETE FROM products');

    console.log('Insertion des produits...');
    for (const p of products) {
      await client.query(
        `INSERT INTO products
          (name, description, price, old_price, tag, category, sub, size, color, image_url, hover_image, published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true)`,
        [p.name, p.description, p.price, p.old_price, p.tag,
         p.category, p.sub, p.size, p.color, p.image_url, p.hover_image]
      );
    }

    console.log(`✅ ${products.length} produits insérés avec succès !`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur :', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedDatabase();
