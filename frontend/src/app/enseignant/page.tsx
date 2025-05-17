'use client';
import { BarChart2, BookOpen, Clock, PieChart, Users } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import styles from './enseignant.module.css';
import { Sidebar } from "@/components/Sidebar";
import { CourseProps } from "@/interface/cours";
import { Navbar } from "@/components/Navbar";
import DisponibiliteProfesseur from "@/components/Disponibilite";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserInfo } from "@/interface/Type";
import { error } from "console";

// StatCard Component
const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: JSX.Element; color: string }) => {
    return (
        <div className={styles.statCard}>
            <div className={styles.statContent}>
                <div>
                    <p className={styles.statTitle}>{title}</p>
                    <p className={styles.statValue}>{value}</p>
                </div>
                <div className={styles.statIcon} style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Dashboard Component
const Dashboard = () => {
    type Matiere_Classe = {
        id_mc: number;
        matiereidmatiere: string;
        classeidparcours: string;
        classeidniveau: string;
        classegroupe: string;
        enseignantidenseignant: string;
        matiere: {
            id_matiere: number;
            nom_matiere: string;
        };
        classe: {
            id_parcours: number;
            id_niveau: number;
            groupe: string;
            nom_parcours: string;
            nom_niveau: string;
        };
    };

    const [matiereClasse, setMatiereClasse] = useState<Matiere_Classe[]>([]);
    const [etudiantMatiere, setEtudiantMatiere] = useState<Matiere_Classe[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const userJson = sessionStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        const idEnseignant = user?.id;

        if (idEnseignant) {
            axios.get(`http://localhost:3002/utilisateur/${idEnseignant}`)
                .then(response => {
                    setUserInfo(response.data);

                    // Une fois userInfo défini, effectuer la deuxième requête
                    const id = response.data?.enseignant?.id_enseignant;
                    if (id) {
                        // Récupérer les matières de l'enseignant
                        axios.get(`http://localhost:3002/matiere_classe/enseignant/${id}`)
                            .then(response => {
                                setMatiereClasse(response.data);
                            })
                            .catch(error => {
                                console.error("Erreur lors de la récupération :", error);
                            });
                        // Récuperer les étudiants liés au cours de l'enseignant
                        axios.get(`http://localhost:3002/matiere_classe/etudiant/${id}`)
                            .then(response => {
                                setEtudiantMatiere(response.data);
                            })
                            .catch(error => {
                                console.error("Erreur lors de la récupération des étudiants de l'étudiant :", error);
                            });
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des données utilisateur :", error);
                });
        }
    }, []);

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>Tableau de bord</h1>

            <div className={styles.statsGrid}>
                <StatCard
                    title="Total de matières"
                    value={matiereClasse.length.toString()}
                    icon={<BookOpen className={styles.statIconSvg} />}
                    color="#6366f1"
                />
                <StatCard
                    title="Étudiants"
                    value={etudiantMatiere.length.toString()}
                    icon={<Users className={styles.statIconSvg} />}
                    color="#4ade80"
                />
                <StatCard
                    title="Heures ce mois"
                    value="48h"
                    icon={<Clock className={styles.statIconSvg} />}
                    color="#facc15"
                />
                <StatCard
                    title="Taux de présence"
                    value="92%"
                    icon={<BarChart2 className={styles.statIconSvg} />}
                    color="#f87171"
                />
            </div>

            <div className={styles.chartGrid}>
                <ActivityChart />
                <DistributionChart />
            </div>

            <UpcomingCourses />
        </div>
    );
};

// Graphique d'activité
const ActivityChart = () => {
    const activityData = [30, 45, 80, 60, 90, 40, 20];
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Activité hebdomadaire</h3>
                <select className={styles.chartSelect}>
                    <option>Cette semaine</option>
                    <option>Semaine dernière</option>
                    <option>Ce mois</option>
                </select>
            </div>
            <div className={styles.barChart}>
                {activityData.map((height, i) => (
                    <div key={i} className={styles.barColumn}>
                        <div
                            className={styles.bar}
                            style={{ height: `${height}%` }}
                        ></div>
                        <span className={styles.barLabel}>{days[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Graphique de répartition
const DistributionChart = () => {
    const segments = [
        { color: "#6366f1", percent: 40, label: "Cours réguliers" },
        { color: "#4ade80", percent: 25, label: "Cours spéciaux" },
        { color: "#facc15", percent: 20, label: "Examens" },
        { color: "#f87171", percent: 15, label: "Réunions" }
    ];

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Répartition des activités</h3>
            <div className={styles.pieChartContainer}>
                <div className={styles.pieChart}>
                    <div className={styles.pieChartInner}></div>
                    <PieChart className={styles.pieChartIcon} />
                </div>
                <div className={styles.pieChartLegend}>
                    {segments.map((segment, i) => (
                        <div key={i} className={styles.legendItem}>
                            <div
                                style={{
                                    backgroundColor: segment.color
                                }}
                            ></div>
                            <span className={styles.legendText}>
                                {segment.label} ({segment.percent}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Liste des cours à venir
const UpcomingCourses = () => {
    const courses: CourseProps[] = [
        { title: "Mathématiques Avancées", date: "Lundi, 14h-16h", students: 28, room: "A-201" },
        { title: "Physique Appliquée", date: "Mardi, 10h-12h", students: 22, room: "B-105" },
        { title: "Statistiques", date: "Mercredi, 8h-10h", students: 19, room: "C-300" }
    ];

    return (
        <div className={styles.courseCard}>
            <h3 className={styles.chartTitle}>Cours à venir</h3>
            <div className={styles.courseList}>
                {courses.map((course, i) => (
                    <div key={i} className={styles.courseItem}>
                        <div>
                            <p className={styles.courseTitle}>{course.title}</p>
                            <p className={styles.courseInfo}>
                                {course.date} • Salle {course.room}
                            </p>
                        </div>
                        <div className={styles.studentCount}>
                            <Users className={styles.smallIcon} />
                            <span>{course.students}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Main Professor Interface Component
export default function ProfessorInterface() {
    const [activePage, setActivePage] = useState("Tableau de bord");
    const router = useRouter();

    useEffect(() => {
        const userJson = sessionStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        if (!user || user.role !== "enseignant") {
            router.replace("/login");
        }
    }, []);

    const renderContent = () => {
        switch (activePage) {
            case "Tableau de bord":
                return <Dashboard />;
            case "Disponibilités":
                return <DisponibiliteProfesseur />;
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