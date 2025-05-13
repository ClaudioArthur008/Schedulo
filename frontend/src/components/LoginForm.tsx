'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Auth.module.css';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/api/api';
import axios from 'axios';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [userType, setUserType] = useState('etudiant');
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });
    const router = useRouter();
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Vérification de la validité globale du formulaire
    useEffect(() => {
        const isValid = Boolean(
            formData.email &&
            formData.password &&
            !errors.email &&
            !errors.password
        );

        setFormValid(isValid);
    }, [formData, errors]);

    // Gestion des changements dans les champs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Marquer le champ comme touché lors de la saisie
        if (!touched[name as keyof typeof touched]) {
            setTouched({
                ...touched,
                [name]: true
            });
        }

        // Vérification en temps réel
        validateField(name, value);
    };

    // Gestion de la perte de focus
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched({
            ...touched,
            [name]: true
        });
        validateField(name, formData[name as keyof typeof formData]);
    };

    // Validation des champs individuels
    const validateField = (name: string, value: string) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                newErrors.email = !value ?
                    'Email requis' :
                    (!emailPattern.test(value) ? 'Format d\'email invalide' : '');
                break;

            case 'password':
                newErrors.password = !value ? 'Mot de passe requis' : '';
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    // Validation du formulaire complet
    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        // Email
        if (!formData.email) {
            newErrors.email = 'Email requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        // Mot de passe
        if (!formData.password) {
            newErrors.password = 'Mot de passe requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitted(true);
        setError(null); // Réinitialiser les erreurs précédentes
        setLoading(true); // Indiquer que la requête est en cours

        // Marquer tous les champs comme touchés
        setTouched({
            email: true,
            password: true,
        });

        if (validateForm()) {
            try {
                // const response = await api.post('/auth/login', formData);
                const response = await api.post('/auth/login', formData);
                console.log('Utilisateur connecté avec succès :', response.data);

                // Stocker le token dans localStorage ou sessionStorage selon l'option "Se souvenir de moi"
                if (response.data.access_token) {
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem('token', response.data.access_token);
                    storage.setItem('user', JSON.stringify(response.data.user));

                    // Redirection selon le rôle de l'utilisateur
                    if (response.data.user && response.data.user.role) {
                        switch (response.data.user.role) {
                            case 'etudiant':
                                router.push('/etudiant');
                                break;
                            case 'enseignant':
                                router.push('/enseignant');
                                break;
                            default:
                                router.push('/dashboard');
                        }
                    } else {
                        router.push('/login');
                    }
                }
            } catch (error: any) {
                console.error('Erreur de connexion:', error);

                // Gestion des erreurs
                if (error.response) {
                    const message = error.response.data.message;

                    if (error.response.status === 401) {
                        if (message === 'Votre compte n\'a pas encore été approuvé par un administrateur.') {
                            setError(message);
                        } else if (message === 'Erreur avec les informations d\'authentification') {
                            setError('Erreur interne d’identification. Veuillez contacter un administrateur.');
                        } else {
                            setError('Email ou mot de passe incorrect');
                        }
                    } else if (error.response.status === 500) {
                        setError('Erreur serveur. Veuillez réessayer plus tard.');
                    } else {
                        setError(message || 'Erreur lors de la connexion');
                    }
                } else if (error.request) {
                    setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
                } else {
                    setError('Erreur de connexion');
                }

            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Fonction d'aide pour déterminer si on doit afficher une erreur
    const shouldShowError = (fieldName: keyof typeof touched) => {
        return (touched[fieldName] || formSubmitted) && errors[fieldName];
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className="imageSchool">
                    <Image src="/student.jpg" alt="School" className={styles.image} width={500} height={500} />
                </div>
                <div className={styles.authContent}>
                    <div className={styles.authHeader}>
                        <Link href="/">
                            <span className={styles.logo}>Schedulo</span>
                        </Link>
                        <h2 className={styles.title}>Se connecter</h2>
                        <p className={styles.subtitle}>Accédez à votre espace Schedulo</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.userTypeSelector}>
                            <button
                                type="button"
                                className={`${styles.userTypeButton} ${userType === 'etudiant' ? styles.active : ''}`}
                                onClick={() => setUserType('etudiant')}
                            >
                                Etudiant
                            </button>
                            <button
                                type="button"
                                className={`${styles.userTypeButton} ${userType === 'enseignant' ? styles.active : ''}`}
                                onClick={() => setUserType('enseignant')}
                            >
                                Enseignant
                            </button>
                        </div>

                        {/* Afficher les erreurs globales */}
                        {error && (
                            <div className={styles.globalError}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder={userType === 'enseignant' ? "email@universite.fr" : "email@schedulo.fr"}
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${styles.input} ${shouldShowError('email') ? styles.inputError : ''}`}
                                aria-invalid={errors.email ? 'true' : 'false'}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            {shouldShowError('email') && (
                                <div id="email-error" className={styles.errorMessage}>
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Mot de passe
                            </label>
                            <div className={styles.passwordContainer}>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="Votre mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`${styles.input} ${shouldShowError('password') ? styles.inputError : ''}`}
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className={styles.passwordToggle}
                                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            {shouldShowError('password') && (
                                <div id="password-error" className={styles.errorMessage}>
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className={styles.formOptions}>
                            <div className={styles.checkboxGroup}>
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className={styles.checkbox}
                                />
                                <label htmlFor="remember-me" className={styles.checkboxLabel}>
                                    Se souvenir de moi
                                </label>
                            </div>
                            <div className={styles.forgotPassword}>
                                <Link href="/forgot-password" className={styles.link}>
                                    Mot de passe oublié?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`${styles.button} ${loading ? styles.buttonLoading : ''} ${!formValid ? styles.buttonDisabled : ''}`}
                            disabled={loading || (formSubmitted && !formValid)}
                        >
                            {loading ? 'Connexion en cours...' :
                                userType === 'enseignant' ? 'Accéder à mon emploi du temps' : 'Accéder à mon espace'}
                        </button>
                    </form>

                    {userType === 'enseignant' && (
                        <div className={styles.authFooter}>
                            <p>
                                Première connexion?{' '}
                                <Link href="/register" className={styles.link}>
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}