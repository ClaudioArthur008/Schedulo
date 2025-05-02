'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Auth.module.css';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('professor'); // 'professor' ou 'admin'

    interface LoginFormData {
        email: string;
        password: string;
        userType: 'professeur' | 'admin';
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const loginData: LoginFormData = { email, password, userType: userType as 'professeur' | 'admin' };
        // Logique de connexion à implémenter
        console.log('Login attempt with:', loginData);
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <Link href="/">
                        <span className={styles.logo}>Schedulo</span>
                    </Link>
                    <h2 className={styles.title}>Se connecter</h2>
                    <p className={styles.subtitle}>Accédez à votre espace Schedulo</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.userTypeSelector}>
                        <button
                            type="button"
                            className={`${styles.userTypeButton} ${userType === 'professor' ? styles.active : ''}`}
                            onClick={() => setUserType('professor')}
                        >
                            Professeur
                        </button>
                        <button
                            type="button"
                            className={`${styles.userTypeButton} ${userType === 'admin' ? styles.active : ''}`}
                            onClick={() => setUserType('admin')}
                        >
                            Administrateur
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder={userType === 'professor' ? "email@universite.fr" : "admin@schedulo.fr"}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formOptions}>
                        <div className={styles.checkboxGroup}>
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className={styles.checkbox}
                            />
                            <label htmlFor="remember-me" className={styles.checkboxLabel}>
                                Se souvenir de moi
                            </label>
                        </div>
                        <div className={styles.forgotPassword}>
                            <a href="#" className={styles.link}>
                                Mot de passe oublié?
                            </a>
                        </div>
                    </div>

                    <button type="submit" className={styles.button}>
                        {userType === 'professor' ? 'Accéder à mon emploi du temps' : 'Accéder au panneau d\'administration'}
                    </button>
                </form>

                {userType === 'professor' && (
                    <div className={styles.authFooter}>
                        <p>
                            Première connexion?{' '}
                            <Link href="/signup" className={styles.link}>
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}