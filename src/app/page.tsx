import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Calypsion Digital Twin</h1>
          <p>Explore your 3D assets with a clean, fast viewer built on Next.js and Three.js.</p>
        </div>
        <div className={styles.ctas}>
          <a className={styles.primary} href="/viewer">
            Open Viewer
          </a>
        </div>
      </main>
    </div>
  );
}
