'use client';
import { useEffect, useState } from "react";
import styles from './etudiant.module.css';
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Accueil } from "@/components/Accueil";
import Presence from "@/components/Presence";
import CoursPage from "@/components/Cours";

// Main Professor Interface Component
export default function Etudiant() {
    const [activePage, setActivePage] = useState("Accueil");
    const router = useRouter();

    useEffect(() => {
        const userJson = sessionStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        if (!user || user.role !== "etudiant") {
            router.replace("/login");
        }
    }, [router]);

    const renderContent = () => {
        switch (activePage) {
            case "Accueil":
                return <Accueil />;
            case "Cours":
                return <CoursPage />;
            case "Presence":
                return <Presence />;
            default:
                return (
                    <div className={styles.emptyPage}>
                        <p className={styles.emptyPageText}>
                            La page <strong>{activePage}</strong> est en cours de développement.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.mainContent}>
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                <div className={styles.pageContent}>{renderContent()}</div>
            </div>
        </div>
    );
}