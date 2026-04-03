import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.tagline}>Freshly roasted, shipped weekly</p>
        <h1 className={styles.title}>
          Coffee that <em>actually</em> tastes<br />like the bag smells.
        </h1>
        <p className={styles.subtitle}>
          Single-origin beans sourced from the world's best farms.
          Roasted in small batches, delivered to your door.
        </p>
        <div className={styles.actions}>
          <a href="#shop" className={styles.primaryBtn}>Shop Now</a>
          <a href="#subscribe" className={styles.secondaryBtn}>Subscribe & Save 15%</a>
        </div>
      </div>
      <div className={styles.visual}>
        <div className={styles.heroImage}>
          <span className={styles.emoji}>☕</span>
        </div>
      </div>
    </section>
  );
}
