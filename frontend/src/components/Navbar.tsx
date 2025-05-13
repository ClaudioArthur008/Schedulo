import { useEffect, useState } from "react";
import { BellRing, ChevronDown } from "lucide-react";
import styles from '../app/enseignant/enseignant.module.css';
import axios from "axios";
import { UserInfo } from "@/interface/Type";
import api from "@/api/api";


export const Navbar = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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


    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <div className={styles.logo}>
                    <h1>Schedulo</h1>
                </div>
            </div>
            <div className={styles.userSection}>
                <BellRing className={styles.bellIcon} />
                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                        {userInfo?.enseignant?.id_enseignant? (
                        <span>
                            {userInfo ? ((userInfo.enseignant?.prenom?.[0] ?? "") + (userInfo.enseignant?.nom?.[0] ?? "")) : "Chargement..."}
                        </span>) : (
                        <span>
                            {userInfo ? ((userInfo.etudiant?.prenom?.[0] ?? "") + (userInfo.etudiant?.nom?.[0] ?? "")) : "Chargement..."}
                        </span>)}
                    </div>
                    {userInfo?.enseignant?.id_enseignant? (
                        <span>
                            {userInfo ? ((userInfo.enseignant?.prenom ?? "") + (userInfo.enseignant?.nom?.[0] ?? "")) : "Chargement..."}
                        </span>) : (
                        <span>
                            {userInfo ? ((userInfo.etudiant?.prenom ?? "") + (userInfo.etudiant?.nom?.[0] ?? "")) : "Chargement..."}
                        </span>)
                    }
                    <ChevronDown className={styles.chevronIcon} />
                </div>
            </div>
        </nav>
    );
};
