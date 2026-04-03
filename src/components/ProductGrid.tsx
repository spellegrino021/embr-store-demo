import styles from './ProductGrid.module.css';

interface Product {
  id: number;
  name: string;
  origin: string;
  roast: string;
  notes: string;
  price: string;
  emoji: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    origin: 'Sidamo, Ethiopia',
    roast: 'Light',
    notes: 'Blueberry, jasmine, bright citrus',
    price: '$18.50',
    emoji: '🫐',
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    origin: 'Huila, Colombia',
    roast: 'Medium',
    notes: 'Caramel, walnut, milk chocolate',
    price: '$16.00',
    emoji: '🍫',
  },
  {
    id: 3,
    name: 'Sumatra Mandheling',
    origin: 'North Sumatra',
    roast: 'Dark',
    notes: 'Earthy, cedar, dark cocoa',
    price: '$17.25',
    emoji: '🌿',
  },
  {
    id: 4,
    name: 'Guatemala Antigua',
    origin: 'Antigua Valley',
    roast: 'Medium-Dark',
    notes: 'Smoky, spiced plum, brown sugar',
    price: '$19.00',
    emoji: '🔥',
  },
  {
    id: 5,
    name: 'Kenya AA',
    origin: 'Nyeri, Kenya',
    roast: 'Light-Medium',
    notes: 'Blackcurrant, tomato, winey',
    price: '$21.00',
    emoji: '🍷',
  },
  {
    id: 6,
    name: 'Brazil Santos',
    origin: 'Minas Gerais, Brazil',
    roast: 'Medium',
    notes: 'Peanut, low acidity, smooth body',
    price: '$14.50',
    emoji: '🥜',
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardVisual}>
        <span className={styles.cardEmoji}>{product.emoji}</span>
        <span className={styles.roastBadge}>{product.roast}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{product.name}</h3>
        <p className={styles.cardOrigin}>{product.origin}</p>
        <p className={styles.cardNotes}>{product.notes}</p>
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>{product.price}</span>
          <button className={styles.addBtn}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid() {
  return (
    <section id="shop" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Our Beans</h2>
        <p className={styles.sectionSubtitle}>
          Each bag is roasted within 48 hours of your order. 12 oz bags, whole bean.
        </p>
      </div>
      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
