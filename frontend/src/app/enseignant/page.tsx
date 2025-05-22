'use client';
import { BarChart2, BookOpen, Clock, Users } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import styles from './enseignant.module.css';
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import DisponibiliteProfesseur from "@/components/Disponibilite";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Cours, UserInfo } from "@/interface/Type";
import CoursPage from "@/components/Cours";

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
    const [matiereClasse, setMatiereClasse] = useState<Matiere_Classe[]>([]);
    const [etudiantMatiere, setEtudiantMatiere] = useState<Matiere_Classe[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [cours, setCours] = useState<Cours[]>([]);
    const [allCours, setAllCours] = useState<Cours[]>([]);


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
                        // Récupérer les cours de l'enseignant pour la semaine en cours
                        axios.get(`http://localhost:3002/cours/AllCoursForEnseignantThisWeek/${id}`)
                            .then(response => {
                                setCours(response.data);
                            })
                            .catch(error => {
                                console.error("Erreur lors de la récupération des cours :", error);
                            });
                        // Récupérer TOUS les cours de l'enseignant pour calculer les heures mensuelles
                        axios.get(`http://localhost:3002/cours/AllCoursForEnseignant/${id}`)
                            .then(response => {
                                setAllCours(response.data);
                            })
                            .catch(error => {
                                console.error("Erreur lors de la récupération de tous les cours :", error);
                                // En cas d'erreur, utiliser les cours de la semaine comme fallback
                                setAllCours(cours);
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
                    value={calculateMonthlyHours(allCours) + "h"}
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
                <ActivityChart courses={cours} />
                <SubjectsList matiereClasse={matiereClasse} />
            </div>
            <UpcomingCourses courses={cours} />
        </div>
    );
};

// Fonction utilitaire pour calculer les heures de cours du mois actuel
const calculateMonthlyHours = (courses: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalHours = 0;

    courses.forEach(course => {
        if (course.cours_debut && course.cours_fin) {
            const startDate = new Date(course.cours_debut);
            const endDate = new Date(course.cours_fin);

            // Vérifier si le cours appartient au mois actuel
            if (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) {
                // Calculer la durée en heures
                const durationMs = endDate.getTime() - startDate.getTime();
                const durationHours = durationMs / (1000 * 60 * 60);

                totalHours += durationHours;
            }
        }
    });

    return totalHours;
};

// Fonction utilitaire pour calculer l'activité hebdomadaire
const calculateWeeklyActivity = (courses: any[]) => {
    // Initialiser un tableau pour chaque jour de la semaine (0 = Dimanche, 1 = Lundi, etc.)
    const weeklyHours = [0, 0, 0, 0, 0, 0, 0]; // [Dim, Lun, Mar, Mer, Jeu, Ven, Sam]

    courses.forEach(course => {
        if (course.cours_debut && course.cours_fin) {
            const startDate = new Date(course.cours_debut);
            const endDate = new Date(course.cours_fin);

            // Calculer la durée en heures
            const durationMs = endDate.getTime() - startDate.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            // Obtenir le jour de la semaine (0 = Dimanche, 1 = Lundi, etc.)
            const dayOfWeek = startDate.getDay();

            // Ajouter les heures au jour correspondant
            weeklyHours[dayOfWeek] += durationHours;
        }
    });

    // Réorganiser pour commencer par Lundi (index 1) au lieu de Dimanche (index 0)
    return [
        weeklyHours[1], // Lundi
        weeklyHours[2], // Mardi
        weeklyHours[3], // Mercredi
        weeklyHours[4], // Jeudi
        weeklyHours[5], // Vendredi
        weeklyHours[6], // Samedi
        weeklyHours[0]  // Dimanche
    ];
};

// Fonction utilitaire pour normaliser les données pour l'affichage
const normalizeActivityData = (activityHours: number[]) => {
    const maxHours = Math.max(...activityHours);
    if (maxHours === 0) return activityHours.map(() => 0);

    // Normaliser entre 10% et 100% pour un meilleur affichage visuel
    return activityHours.map(hours => {
        if (hours === 0) return 0;
        return 10 + (hours / maxHours) * 90;
    });
};

// Graphique d'activité amélioré
const ActivityChart = ({ courses }: { courses: any[] }) => {
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    // Calculer l'activité réelle basée sur les cours
    const weeklyHours = calculateWeeklyActivity(courses);
    const activityData = normalizeActivityData(weeklyHours);

    // Calculer les statistiques
    const totalHours = weeklyHours.reduce((sum, hours) => sum + hours, 0);
    const averageHours = totalHours / 7;
    const maxDayHours = Math.max(...weeklyHours);
    const maxDayIndex = weeklyHours.indexOf(maxDayHours);

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Activité hebdomadaire</h3>
                <div className={styles.activityStats}>
                    <span className={styles.totalHours}>
                        Total: {totalHours.toFixed(1)}h
                    </span>
                    <span className={styles.averageHours}>
                        Moyenne: {averageHours.toFixed(1)}h/jour
                    </span>
                </div>
            </div>

            <div className={styles.barChart}>
                {activityData.map((height, i) => (
                    <div
                        key={i}
                        className={styles.barColumn}
                        title={`${dayNames[i]}: ${weeklyHours[i].toFixed(1)} heures`}
                    >
                        <div
                            className={`${styles.bar} ${i === maxDayIndex && maxDayHours > 0 ? styles.barHighest : ''}`}
                            style={{
                                height: `${height}%`,
                                backgroundColor: weeklyHours[i] === 0 ? '#e5e7eb' : undefined
                            }}
                        ></div>
                        <span className={styles.barLabel}>{days[i]}</span>
                        <span className={styles.barHours}>
                            {weeklyHours[i] > 0 ? `${weeklyHours[i].toFixed(1)}h` : '0h'}
                        </span>
                    </div>
                ))}
            </div>

            {maxDayHours > 0 && (
                <div className={styles.activityInsight}>
                    <p>Jour le plus chargé: {dayNames[maxDayIndex]} ({maxDayHours.toFixed(1)}h)</p>
                </div>
            )}
        </div>
    );
};

// // Liste des matières
const SubjectsList = ({ matiereClasse }: { matiereClasse: Matiere_Classe[] }) => {
    // Grouper les matières par nom pour éviter les doublons et compter les classes
    const groupedSubjects = matiereClasse.reduce((acc, mc) => {
        const subjectName = mc.matiere.nom_matiere;
        if (!acc[subjectName]) {
            acc[subjectName] = {
                nom_matiere: subjectName,
                classes: [],
                totalStudents: 0
            };
        }

        // Créer un identifiant unique pour la classe
        const classInfo = {
            id: `${mc.classe.id_parcours}-${mc.classe.id_niveau}-${mc.classe.groupe}`,
            parcours: mc.classe.parcours.code_parcours,
            niveau: mc.classe.id_niveau,
            groupe: mc.classe.groupe
        };

        // Ajouter la classe si elle n'existe pas déjà
        if (!acc[subjectName].classes.find(c => c.id === classInfo.id)) {
            acc[subjectName].classes.push(classInfo);
        }

        return acc;
    }, {} as Record<string, any>);

    const subjects = Object.values(groupedSubjects);

    // Couleurs pour les matières
    const subjectColors = [
        '#6366f1', '#4ade80', '#facc15', '#f87171',
        '#a78bfa', '#fb7185', '#34d399', '#fbbf24',
        '#60a5fa', '#f472b6'
    ];

    const getSubjectIcon = (subjectName: string) => {
        const name = subjectName.toLowerCase();
        if (name.includes('math') || name.includes('calcul') || name.includes('algèbre')) {
            return '📐';
        } else if (name.includes('français') || name.includes('littérature') || name.includes('langue')) {
            return '📚';
        } else if (name.includes('histoire') || name.includes('géographie')) {
            return '🌍';
        } else if (name.includes('science') || name.includes('physique') || name.includes('chimie') || name.includes('biologie')) {
            return '🔬';
        } else if (name.includes('informatique') || name.includes('programmation') || name.includes('tech')) {
            return '💻';
        } else if (name.includes('art') || name.includes('dessin') || name.includes('musique')) {
            return '🎨';
        } else if (name.includes('sport') || name.includes('eps') || name.includes('éducation physique')) {
            return '⚽';
        } else if (name.includes('économie') || name.includes('gestion') || name.includes('commerce')) {
            return '💼';
        } else {
            return '📖';
        }
    };

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Mes Matières</h3>
                <span className={styles.subjectCount}>
                    {subjects.length} matière{subjects.length > 1 ? 's' : ''}
                </span>
            </div>

            <div className={styles.subjectsList}>
                {subjects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <BookOpen className={styles.emptyIcon} />
                        <p>Aucune matière assignée</p>
                    </div>
                ) : (
                    subjects.map((subject, index) => (
                        <div key={subject.nom_matiere} className={styles.subjectItem}>
                            <div className={styles.subjectHeader}>
                                <div className={styles.subjectInfo}>
                                    <div
                                        className={styles.subjectIcon}
                                        style={{ backgroundColor: subjectColors[index % subjectColors.length] }}
                                    >
                                        <span className={styles.subjectEmoji}>
                                            {getSubjectIcon(subject.nom_matiere)}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className={styles.subjectName}>{subject.nom_matiere}</h4>
                                        <p className={styles.subjectMeta}>
                                            {subject.classes.length} classe{subject.classes.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.subjectStats}>
                                    <Users className={styles.statsIcon} />
                                </div>
                            </div>

                            <div className={styles.classesList}>
                                {subject.classes.map((classe: any, classIndex: number) => (
                                    <div key={classe.id} className={styles.classeTag}>
                                        <span className={styles.classeLevel}>{classe.niveau}</span>
                                        <span className={styles.classeLevel}>{classe.parcours}</span>
                                        <span className={styles.classeLevel}>{classe.groupe}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Liste des cours à venir
const UpcomingCourses = ({ courses }: { courses: any[] }) => {
    // Fonction utilitaire pour formater la date
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleString("fr-FR", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className={styles.courseCard}>
            <h3 className={styles.chartTitle}>Cours à venir</h3>
            <div className={styles.courseList}>
                {courses.length === 0 ? (
                    <p>Aucun cours à venir.</p>
                ) : (
                    courses.map((course, i) => (
                        <div key={course.id_cours || i} className={styles.courseItem}>
                            <div>
                                <p className={styles.courseTitle}>
                                    {course.matiere_classes?.matiere?.nom_matiere || "Matière inconnue"}
                                </p>
                                <p className={styles.courseInfo}>
                                    {formatDate(course.cours_debut)} • Salle {course.salle?.id_salle || "?"}
                                </p>
                            </div>
                            <div className={styles.studentCount}>
                                <Users className={styles.smallIcon} />
                                <span>
                                    {course.matiere_classes?.classe?.groupe
                                        ? `${course.matiere_classes.classe.id_niveau} ${course.matiere_classes.classe.parcours.code_parcours} ${course.matiere_classes.classe.groupe}`
                                        : ""}
                                </span>
                            </div>
                        </div>
                    ))
                )}
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
    }, [router]);

    const renderContent = () => {
        switch (activePage) {
            case "Tableau de bord":
                return <Dashboard />;
            case "Disponibilités":
                return <DisponibiliteProfesseur />;
            case "Cours":
                return <CoursPage />
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