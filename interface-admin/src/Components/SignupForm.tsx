'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Auth.module.css';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/api/axios';

export default function SignupForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        identifiant: '',
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        identifiant: false,
    });

    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; identifiant?: string; }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [userType, setUserType] = useState('etudiant');

    // Vérification de la validité globale du formulaire
    useEffect(() => {
        const isValid =
            formData.email &&
            formData.password &&
            formData.confirmPassword &&
            formData.identifiant &&
            !errors.email &&
            !errors.password &&
            !errors.confirmPassword &&
            !errors.identifiant;

        setFormValid(!!isValid);
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
                newErrors.password = !value ?
                    'Mot de passe requis' :
                    (value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : '');

                // Vérifier la concordance si confirmPassword existe déjà
                if (formData.confirmPassword) {
                    newErrors.confirmPassword = formData.confirmPassword !== value ?
                        'Les mots de passe ne correspondent pas' : '';
                }
                break;

            case 'confirmPassword':
                newErrors.confirmPassword = !value ?
                    'Confirmation du mot de passe requise' :
                    (value !== formData.password ? 'Les mots de passe ne correspondent pas' : '');
                break;

            case 'identifiant':
                newErrors.identifiant = !value ?
                    userType === 'etudiant' ? 'Matricule requis' : 'Identifiant requis' : '';
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    // Validation du formulaire complet
    const validateForm = () => {
        const newErrors: { email?: string; password?: string; confirmPassword?: string; identifiant?: string; } = {};

        // Email
        if (!formData.email) {
            newErrors.email = 'Email requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        // Mot de passe
        if (!formData.password) {
            newErrors.password = 'Mot de passe requis';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        }

        // Confirmation du mot de passe
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirmation du mot de passe requise';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        // Identifiant/Matricule
        if (!formData.identifiant) {
            newErrors.identifiant = userType === 'etudiant' ? 'Matricule requis' : 'Identifiant requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitted(true);

        // Marquer tous les champs comme touchés
        setTouched({
            email: true,
            password: true,
            confirmPassword: true,
            identifiant: true
        });

        if (validateForm()) {
            // Préparation des données selon le type d'utilisateur
            interface UserData {
                email: string;
                mot_passe: string;
                role: string;
                approuve: boolean;
                etudiant?: { matricule: string };
                enseignant?: { id_enseignant: string };
            }

            let userData: UserData = {
                email: formData.email,
                mot_passe: formData.password,
                role: userType,
                approuve: false
            };

            // Ajouter soit etudiant, soit enseignant selon le type sélectionné
            if (userType === 'etudiant') {
                userData = {
                    ...userData,
                    etudiant: {
                        matricule: formData.identifiant
                    }
                };
            } else {
                userData = {
                    ...userData,
                    enseignant: {
                        id_enseignant: formData.identifiant
                    }
                };
            }

            console.log('Formulaire soumis avec succès :', userData);

             api(token!).post('/utilisateur', userData)
                .then((response) => {
                    console.log('Utilisateur créé avec succès :', response.data);
                    // Rediriger ou afficher un message de succès
                })
                .catch((error) => {
                    console.error('Erreur lors de la création de l\'utilisateur :', error);
                    // Gérer l'erreur (afficher un message, etc.)
                });
        } else {
            console.log('Formulaire invalide :', errors);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                        <h2 className={styles.title}>Créer un compte</h2>
                        <p className={styles.subtitle}>Organisez votre temps avec Schedulo</p>
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
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="exemple@domaine.com"
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
                            <label htmlFor="identifiant" className={styles.label}>
                                {userType === 'etudiant' ? 'Matricule' : 'Identifiant'}
                            </label>
                            <input
                                id="identifiant"
                                name="identifiant"
                                type="text"
                                placeholder={userType === 'etudiant' ? 'Votre numéro matricule' : 'Votre identifiant enseignant'}
                                value={formData.identifiant}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${styles.input} ${shouldShowError('identifiant') ? styles.inputError : ''}`}
                                aria-invalid={errors.identifiant ? 'true' : 'false'}
                                aria-describedby={errors.identifiant ? 'identifiant-error' : undefined}
                            />
                            {shouldShowError('identifiant') && (
                                <div id="identifiant-error" className={styles.errorMessage}>
                                    {errors.identifiant}
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
                                    autoComplete="new-password"
                                    placeholder="8 caractères minimum"
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

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Confirmer le mot de passe
                            </label>
                            <div className={styles.passwordContainer}>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Retapez votre mot de passe"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`${styles.input} ${shouldShowError('confirmPassword') ? styles.inputError : ''}`}
                                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className={styles.passwordToggle}
                                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            {shouldShowError('confirmPassword') && (
                                <div id="confirm-password-error" className={styles.errorMessage}>
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`${styles.button} ${!formValid ? styles.buttonDisabled : ''}`}
                            disabled={formSubmitted && !formValid}
                        >
                            Créer un compte
                        </button>
                    </form>

                    <div className={styles.authFooter}>
                        <p>
                            Vous avez déjà un compte?{' '}
                            <Link href="/login" className={styles.link}>
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}