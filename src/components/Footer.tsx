import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>☕ Ember Roast Co.</span>
          <p className={styles.tagline}>Small batch, big flavor.</p>
        </div>
        <div className={styles.links}>
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
          <a href="#subscribe">Subscribe</a>
          <a href="#faq">FAQ</a>
        </div>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Ember Roast Co. &mdash; Demo store powered by{' '}
          <a href="https://github.com/spellegrino021/embr-store-demo" target="_blank" rel="noreferrer">
            Embr
          </a>
        </p>
      </div>
    </footer>
  );
}
