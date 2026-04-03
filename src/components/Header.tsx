import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>☕</span>
          <span className={styles.logoText}>Ember Roast Co.</span>
        </div>
        <nav className={styles.nav}>
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
          <a href="#subscribe">Subscribe</a>
        </nav>
        <button className={styles.cartBtn}>
          🛒 <span className={styles.cartCount}>0</span>
        </button>
      </div>
    </header>
  );
}
