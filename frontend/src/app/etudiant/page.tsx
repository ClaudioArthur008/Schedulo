'use client';
import { BarChart2, BookOpen, Clock, PieChart, Users } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import styles from './etudiant.module.css';
import { Sidebar } from "@/components/Sidebar";
import { CourseProps } from "@/interface/cours";
import { Navbar } from "@/components/Navbar";
import  Cours  from "@/components/Cours";
import {Accueil} from "@/components/Accueil";
import { useRouter } from "next/navigation";
import Presence from "@/components/Presence";




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
    }, []);

    const renderContent = () => {
        switch (activePage) {
            case "Accueil":
                return <Accueil />;
            case "Cours":
                return <Cours />;
            case "Presence":
                return <Presence/>;
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