import { BarChart2, BookOpen, Clock, LogOut, Sliders, Users } from "lucide-react";
import styles from '../app/enseignant/enseignant.module.css';
import { useRouter } from 'next/navigation';

export const Sidebar = ({ activePage, setActivePage }: { activePage: string; setActivePage: (page: string) => void }) => {
    const router = useRouter();
    const menuItems = [
        { name: "Tableau de bord", icon: <BarChart2 className={styles.menuIcon} /> },
        { name: "Disponibilités", icon: <Clock className={styles.menuIcon} /> },
        { name: "Cours", icon: <BookOpen className={styles.menuIcon} /> },
        { name: "Étudiants", icon: <Users className={styles.menuIcon} /> },
        { name: "Paramètres", icon: <Sliders className={styles.menuIcon} /> }
    ];

    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            sessionStorage.removeItem("user");
            sessionStorage.clear();

            // Redirection vers la page de login avec gestion des erreurs
            try {
                router.push('/login');
            } catch (error) {
                console.error("Erreur lors de la redirection :", error);
            }
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.menuItems}>
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        className={`${styles.menuItem} ${activePage === item.name ? styles.activeMenuItem : ''}`}
                        onClick={() => setActivePage(item.name)}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
            <div className={styles.logoutContainer}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    <LogOut className={styles.menuIcon} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};
