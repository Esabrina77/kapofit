import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { FiActivity, FiVideo , FiBarChart2 } from 'react-icons/fi';

import Navbar from '@/components/navigation/Navbar';

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Transformez votre entraînement avec 
            <span className="text-gradient"> KaporalFit</span>
          </h1>
          <p className={styles.subtitle}>
            Votre coach IA personnel qui analyse votre forme en temps réel
            et vous guide vers vos objectifs fitness.
          </p>
          <div className={styles.cta}>
            <Link href="/register" className={styles.primaryButton}>
              Commencer Gratuitement
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              Se connecter
            </Link>
          </div>
        </div>
        
        <div className={styles.heroImage}>
          <Image
            src="/logo/logo.png"
            alt="KaporalFit AI Coaching"
            width={600}
            height={400}
            priority
            className={styles.floatingImage}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Pourquoi choisir KaporalFit ?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <FiActivity className={styles.featureIcon} />
            <h3>IA Temps Réel</h3>
            <p>Analyse instantanée de vos mouvements pour une forme parfaite</p>
          </div>
          <div className={styles.featureCard}>
            <FiVideo className={styles.featureIcon} />
            <h3>Sessions Live</h3>
            <p>Entraînez-vous en direct avec des coachs ou des amis</p>
          </div>
          <div className={styles.featureCard}>
            <FiBarChart2 className={styles.featureIcon} />
            <h3>Suivi Personnalisé</h3>
            <p>Visualisez vos progrès et adaptez vos objectifs</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>Comment ça marche ?</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Créez votre profil</h3>
            <p>Définissez vos objectifs et votre niveau</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Choisissez votre workout</h3>
            <p>Accédez à une variété d&apos;exercices adaptés</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Commencez l&apos;entraînement</h3>
            <p>Suivez les exercices avec feedback en temps réel</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>Ce que disent nos athlètes</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <Image
              src="/images/simon.jpg"
              alt="User testimonial"
              width={60}
              height={60}
              className={styles.testimonialImage}
            />
            <p>&quot;KaporalFit a complètement transformé ma routine d&apos;entraînement. Le feedback en temps réel est incroyable !&quot;</p>
            
          </div>
          {/* Ajoutez d'autres témoignages */}
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing}>
        <h2 className={styles.sectionTitle}>Commencez votre transformation</h2>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <h3>Gratuit</h3>
            <div className={styles.price}>0€</div>
            <ul className={styles.features}>
              <li>Accès aux exercices de base</li>
              <li>Suivi des progrès</li>
              <li>Communauté d&apos;entraide</li>
            </ul>
            <Link href="/register" className={styles.primaryButton}>
              Commencer
            </Link>
          </div>
          <div className={`${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.featuredBadge}>Populaire</div>
            <h3>Premium</h3>
            <div className={styles.price}>19.99€</div>
            <ul className={styles.features}>
              <li>Tous les avantages gratuits</li>
              <li>IA Coach personnel</li>
              <li>Sessions live illimitées</li>
              <li>Programmes personnalisés</li>
            </ul>
            <Link href="/register" className={styles.primaryButton}>
              Essai gratuit de 7 jours
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h2>Prêt à transformer votre entraînement ?</h2>
        <p>Rejoignez des milliers d&apos;athlètes qui ont déjà changé leur vie avec KaporalFit</p>
        <div className={styles.ctaButtons}>
          <Link href="/register" className={styles.primaryButton}>
            Commencer Gratuitement
          </Link>
          <Link href="/contact" className={styles.secondaryButton}>
            Contacter l&apos;équipe
          </Link>
        </div>
      </section>
    </main>
  );
}