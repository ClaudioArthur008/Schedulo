import React, { useEffect, useState } from "react";
import styles from "./disponibilite.module.css";
import type { Cours, UserInfo } from "@/interface/Type";
import api from "@/api/api";

export default function CoursPage() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [cours, setCours] = useState<Cours[]>([]);

    const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa"];
    const hours = [
        { start: 8, end: 10 },
        { start: 10, end: 12 },
        { start: 14, end: 16 },
        { start: 16, end: 18 },
    ];

    useEffect(() => {
        const userJson = sessionStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        const userId = user?.id;

        if (userId) {
            api.get(`/utilisateur/${userId}`)
                .then(response => {
                    setUserInfo(response.data);
                    const enseignantId = response.data.enseignant?.id_enseignant;
                    const parcoursId = response.data.etudiant?.classe?.id_parcours;
                    const niveauId = response.data.etudiant?.classe?.id_niveau;
                    const groupe = response.data.etudiant?.classe?.groupe;

                    if (parcoursId && niveauId && groupe) {
                        // Étudiant : récupérer les cours de la semaine pour sa classe
                        api.get(`/Cours/AllCoursThisWeek/${parcoursId}/${niveauId}/${groupe}`)
                            .then(response => {
                                setCours(response.data);
                            })
                            .catch(error => {
                                console.error("Erreur lors de la récupération des cours :", error);
                            });
                    } else if (enseignantId) {
                        // Enseignant : récupérer ses cours de la semaine
                        api.get(`/Cours/AllCoursForEnseignantThisWeek/${enseignantId}`)
                            .then(response => {
                                setCours(response.data);
                            })
                            .catch(error => {
                                console.error("Erreur lors de la récupération des cours enseignant :", error);
                            });
                    } else {
                        console.warn("L'utilisateur n'est ni étudiant ni enseignant, ou informations manquantes.");
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des données utilisateur :", error);
                });
        }
    }, []);

    const coursBySlot: { [key: string]: Cours[] } = {};

    cours.forEach((cours) => {
        const debut = new Date(cours.cours_debut);
        const hour = debut.getHours();
        const dayIndex = debut.getDay(); // 0 (dimanche) à 6 (samedi)
        const abbrevDay = days[dayIndex - 1]; // -1 car "Lu" commence à index 0

        const matchedHour = hours.find(h => hour >= h.start && hour < h.end);
        if (matchedHour) {
            const key = `${abbrevDay}-${matchedHour.start}`;
            if (!coursBySlot[key]) coursBySlot[key] = [];
            coursBySlot[key].push(cours);
        }
    });

    return (
        <div className={styles.disponibiliteProfesseur}>
            <div className={styles.scheduleHeader}>
                <h3 className={styles.scheduleTitle}>
                    Emploi du temps
                </h3>
            </div>

            <table className={styles.timeTable}>
                <thead>
                    <tr>
                        <th></th>
                        {hours.map((hour) => (
                            <th
                                key={`${hour.start}-${hour.end}`}
                                className={styles.hourHeader}
                            >
                                {hour.start}h - {hour.end}h
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map((day) => (
                        <tr key={day}>
                            <td className={styles.dayCell}>{day}</td>
                            {hours.map((hour) => {
                                const key = `${day}-${hour.start}`;
                                const coursInSlot = coursBySlot[key];

                                return (
                                    <td key={key} className={styles.timeSlot}>
                                        {coursInSlot?.map((c) => {
                                            // Extraction des informations selon la nouvelle structure
                                            const classe = c.matiere_classes?.classe;
                                            const classeStr = classe
                                                ? `${classe.id_niveau} ${classe.parcours.code_parcours} ${classe.groupe}`
                                                : "Classe inconnue";

                                            const enseignant = c.matiere_classes?.enseignant;
                                            const enseignantStr = enseignant
                                                ? `${enseignant.prenom} ${enseignant.nom}`
                                                : "Enseignant inconnu";
                                            const matiere = c.matiere_classes?.matiere.nom_matiere;

                                            const salle = c.salle?.id_salle ?? "Salle inconnue";

                                            // Déterminer si l'utilisateur est un étudiant
                                            const isEtudiant = userInfo?.etudiant !== null;

                                            return (
                                                <div key={c.id_cours} className={styles.coursInfo}>
                                                    {isEtudiant ? (
                                                        // Affichage pour les étudiants
                                                        <>
                                                            <strong>{matiere}</strong><br />
                                                            {enseignantStr}<br />
                                                            {salle}
                                                        </>
                                                    ) : (
                                                        // Affichage pour les enseignants
                                                        <>
                                                            <strong>{classeStr}</strong><br />
                                                            {matiere}<br />
                                                            {salle}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
