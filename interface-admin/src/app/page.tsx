'use client';
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>Schedulo</h1>
        </div>
        <nav className={styles.navCenter}>
          <Link href="/" className={styles.navLink}>Accueil</Link>
          <Link href="/about" className={styles.navLink}>À propos</Link>
          <Link href="/contact" className={styles.navLink}>Nous contacter</Link>
        </nav>
        <div className={styles.navRight}>
          <Link href="/login" className={styles.loginBtn}>Se connecter</Link>
          <Link href="/register" className={styles.registerBtn}>Créer un compte</Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>Organisez votre temps avec <span>Schedulo</span>,</h2>
            <p className={styles.heroSubtitle}>
              Une solution intuitive et complète pour organiser vos emplois du temps
            </p>
            <div className={styles.ctas}>
              <a href="/register" className={`${styles.ctaButton} ${styles.primary}`}>
                En savoir plus
              </a>
              <a href="/demo" className={`${styles.ctaButton} ${styles.secondary}`}>
                Voir la démo
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            {/* Placeholder pour une image/illustration */}
            <div className={styles.imagePlaceholder}>
              <div className={styles.calendarDemo}></div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <h3 className={styles.sectionTitle}>Fonctionnalités principales</h3>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📅</div>
              <h4>Planification intuitive</h4>
              <p>Créez et modifiez facilement vos emplois du temps avec notre interface glisser-déposer</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h4>Partage simplifié</h4>
              <p>Partagez vos emplois du temps avec d&#39;autres utilisateurs en quelques clics</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔔</div>
              <h4>Notifications personnalisées</h4>
              <p>Recevez des rappels pour ne jamais manquer un événement important</p>
            </div>
          </div>
        </section>

        <section className={styles.testimonials}>
          <h3 className={styles.sectionTitle}>Ce que disent nos utilisateurs</h3>
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <p>Schedulo a révolutionné ma façon de gérer mon temps. Je ne pourrais plus m&#39;en passer !</p>
              <p className={styles.testimonialAuthor}>Marie L., Enseignante</p>
            </div>
            <div className={styles.testimonialCard}>
              <p>Interface intuitive et fonctionnalités puissantes. Parfait pour notre équipe.</p>
              <p className={styles.testimonialAuthor}>Thomas D., Chef de projet</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h4>Schedulo</h4>
            <p>La solution simple pour gérer votre emploi du temps</p>
          </div>
          <div className={styles.footerColumn}>
            <h4>Liens rapides</h4>
            <a href="/about">À propos</a>
            <a href="/pricing">Tarifs</a>
            <a href="/contact">Contact</a>
          </div>
          <div className={styles.footerColumn}>
            <h4>Légal</h4>
            <a href="/terms">Conditions d&#39;utilisation</a>
            <a href="/privacy">Politique de confidentialité</a>
          </div>
          <div className={styles.footerColumn}>
            <h4>Suivez-nous</h4>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Schedulo. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}