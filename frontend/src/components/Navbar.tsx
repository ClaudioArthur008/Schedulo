import React, { useEffect, useState, useRef } from "react";
import { Bell, ChevronDown } from "lucide-react";
import styles from '../app/enseignant/enseignant.module.css';
import { UserInfo } from "@/interface/Type";
import api from "@/api/api";
import { io, Socket } from "socket.io-client";

type ToastProps = {
    message: string;
    show: boolean;
    onClose: () => void;
};

type Notification = {
    id: string;
    message: string;
};

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
    if (!show) return null;

    return (
        <div className={styles.toast}>
            <div className={styles.toastContent}>
                <span>{message}</span>
                <button onClick={onClose} className={styles.toastClose}>×</button>
            </div>
        </div>
    );
};

export const Navbar = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const notificationPanelRef = useRef<HTMLDivElement>(null);

    // Fonction pour fermer le panneau de notifications lors d'un clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationPanelRef.current &&
                !notificationPanelRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest(`.${styles.bellIcon}`)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Chargement des informations utilisateur
    useEffect(() => {
        const userJson = sessionStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        const userId = user?.id;

        if (userId) {
            api.get(`/utilisateur/${userId}`)
                .then(response => {
                    setUserInfo(response.data);
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des données utilisateur :", error);
                });
        }
    }, []);

    // Configuration du socket et gestion des notifications
    useEffect(() => {
        const userJson = sessionStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        const userId = user?.id;

        if (!userId) return;

        // Connexion à Socket.IO
        socketRef.current = io('http://localhost:3002', {
            query: { userId: userId.toString() }
        });

        const socket = socketRef.current;

        // Enregistrement explicite de l'utilisateur après la connexion
        socket.on('connect', () => {
            console.log('Socket connecté avec ID:', socket.id);
            socket.emit('register', { userId: userId });
        });

        // Gestion des notifications entrantes
        socket.on('notification', (data) => {
            console.log('🔔 Notification reçue :', data);

            // Ajouter la notification à la liste
            const newNotification = {
                id: Date.now().toString(),
                message: data.message || "Nouvelle notification"
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        // Événement pour les erreurs de socket
        socket.on('connect_error', (error) => {
            console.error('Erreur de connexion socket:', error);
        });

        // Confirmation d'enregistrement
        socket.on('registered', (data) => {
            console.log('Utilisateur enregistré avec succès:', data);
        });

        // Déconnexion du socket à la destruction du composant
        return () => {
            console.log('Déconnexion du socket');
            socket.disconnect();
        };
    }, []);

    // Fonction pour supprimer une notification
    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    // Fonction pour marquer toutes les notifications comme lues
    const markAllAsRead = () => {
        setUnreadCount(0);
    };

    // Fonction pour basculer l'affichage du panneau des notifications
    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
        if (!showNotifications) {
            markAllAsRead();
        }
    };

    return (
        <nav className={styles.navbar}>
            {/* Conteneur des notifications toast */}
            <div className={styles.toastContainer}>
                {notifications.map(notif => (
                    <Toast
                        key={notif.id}
                        message={notif.message}
                        show={true}
                        onClose={() => removeNotification(notif.id)}
                    />
                ))}
            </div>

            <div className={styles.logoContainer}>
                <div className={styles.logo}>
                    <h1>Schedulo</h1>
                </div>
            </div>
            <div className={styles.userSection}>
                {/* Icône de notification avec badge */}
                <div className={styles.bellIconContainer} onClick={toggleNotifications}>
                    <Bell className={styles.bellIcon} />
                    {unreadCount > 0 && (
                        <span className={styles.notificationBadge}>{unreadCount}</span>
                    )}
                </div>

                {/* Panneau de notifications */}
                {showNotifications && (
                    <div className={styles.notificationPanel} ref={notificationPanelRef}>
                        <div className={styles.notificationHeader}>
                            <h3>Notifications</h3>
                            {notifications.length > 0 && (
                                <button onClick={() => setNotifications([])} className={styles.clearAll}>
                                    Tout effacer
                                </button>
                            )}
                        </div>
                        <div className={styles.notificationList}>
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div key={notif.id} className={styles.notificationItem}>
                                        <p>{notif.message}</p>
                                        <button
                                            onClick={() => removeNotification(notif.id)}
                                            className={styles.deleteNotification}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyNotifications}>
                                    Aucune notification
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                        {userInfo?.enseignant?.id_enseignant ? (
                            <span>
                                {userInfo ? ((userInfo.enseignant?.prenom?.[0] ?? "") + (userInfo.enseignant?.nom?.[0] ?? "")) : "Chargement..."}
                            </span>) : (
                            <span>
                                {userInfo ? ((userInfo.etudiant?.prenom?.[0] ?? "") + (userInfo.etudiant?.nom?.[0] ?? "")) : "Chargement..."}
                            </span>)}
                    </div>
                    {userInfo?.enseignant?.id_enseignant ? (
                        <span>
                            {userInfo ? `${userInfo.enseignant?.prenom} ${userInfo.enseignant?.nom}` : "Chargement..."}
                        </span>) : (
                        <span>
                            {userInfo ? `${userInfo.etudiant?.prenom} ${userInfo.etudiant?.nom}` : "Chargement..."}
                        </span>)
                    }
                    <ChevronDown className={styles.chevronIcon} />
                </div>
            </div>
        </nav>
    );
};