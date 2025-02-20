"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/logo/logo.png"
            alt="KaporalFit Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.logoText}>KaporalFit</span>
        </Link>

        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <Link href="/features">Fonctionnalités</Link>
          <Link href="/pricing">Tarifs</Link>
          <Link href="/about">À propos</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className={styles.authButtons}>
          <Link href="/login" className={styles.loginButton}>
            Connexion
          </Link>
          <Link href="/register" className={styles.signupButton}>
            S&apos;inscrire
          </Link>
        </div>
        <ThemeToggle />
        <button 
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
} 