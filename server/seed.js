const db = require('./config/db');

const products = [
  // CLOTHING
  {
    name: 'Chemise en Lin Craie',
    description: 'Coupe décontractée, 100% lin naturel.',
    price: 88.00,
    image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80'
  },
  {
    name: 'Pull Mérinos',
    description: 'Mérinos éthique, poids intermédiaire.',
    price: 112.00,
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'
  },
  {
    name: 'Sur-chemise en Toile',
    description: 'Toile de coton lavée, deux poches poitrine.',
    price: 155.00,
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'
  },
  {
    name: 'Pantalon Large',
    description: 'Tissu crêpe fluide, taille élastique.',
    price: 95.00,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'
  },
  {
    name: 'Robe Midi Satinée',
    description: 'Viscose satinée, bretelles réglables.',
    price: 128.00,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'
  },
  {
    name: 'Manteau en Laine',
    description: '60% mélange laine, épaules tombantes.',
    price: 295.00,
    image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80'
  },
  // SHOES
  {
    name: 'Mule en Cuir',
    description: 'Cuir pleine fleur tanné végétal.',
    price: 145.00,
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80'
  },
  {
    name: 'Chelsea Boot',
    description: 'Élastiques glissants, semelle cuir.',
    price: 220.00,
    image_url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80'
  },
  {
    name: 'Sneaker Court',
    description: 'Silhouette basse, semelle caoutchouc naturel.',
    price: 168.00,
    image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80'
  },
  {
    name: 'Sandale à Lanières',
    description: 'Bride cheville réglable, semelle liège.',
    price: 118.00,
    image_url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80'
  },
  {
    name: 'Bottine',
    description: 'Talon carré, zip latéral, cuir souple.',
    price: 195.00,
    image_url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80'
  },
  {
    name: 'Ballerine',
    description: 'Cuir nappa doux, bout amande.',
    price: 98.00,
    image_url: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&q=80'
  }
];

async function seedDatabase() {
  const client = await db.getClient();
  try {
    console.log('Suppression des produits existants...');
    await client.query('DELETE FROM products');

    console.log('Insertion des nouveaux produits...');
    for (const product of products) {
      await client.query(
        'INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4)',
        [product.name, product.description, product.price, product.image_url]
      );
    }

    console.log(`✅ ${products.length} produits insérés avec succès!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedDatabase();
