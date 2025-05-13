import React, { useEffect, useState } from "react";
import styles from "./disponibilite.module.css";
import axios from "axios";
import type { Cours, UserInfo } from "@/interface/Type";
import api from "@/api/api";

const Cours = () => {
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
            const parcoursId = response.data.etudiant?.classe?.id_parcours;
            const niveauId = response.data.etudiant?.classe?.id_niveau;
            const groupe = response.data.etudiant?.classe?.groupe;

            if (parcoursId && niveauId) {
            api.get(`/Cours/AllCoursThisWeek/${parcoursId}/${niveauId}/${groupe}`)
                .then(response => {
                setCours(response.data);
                })
                .catch(error => {
                console.error("Erreur lors de la récupération des cours :", error);
                });
            } else {
            console.warn("L'utilisateur n'est pas un étudiant ou n'a pas de classe.");
            }

        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        });
    }
  }, []);

  const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
 return `${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`;
  }

const coursBySlot: { [key: string]: Cours[] } = {};

const dayMap: { [key: string]: string } = {
  Lundi: "Lu",
  Mardi: "Ma",
  Mercredi: "Me",
  Jeudi: "Je",
  Vendredi: "Ve",
  Samedi: "Sa",
};


cours.forEach((cours) => {
  const debut = new Date(cours.cours_debut);
    // const day = debut.toLocaleDateString("fr-FR", {
    // weekday: "long",
    // timeZone: "UTC",
    // });
const hour = debut.getHours();
const dayIndex = debut.getDay(); // 0 (dimanche) à 6 (samedi)
const abbrevDay = days[dayIndex - 1]; // -1 car "Lu" commence à index 0


//   const abbrevDay = dayMap[day];

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
                    const cours = coursBySlot[key];

                    return (
                    <td key={key} className={styles.timeSlot}>
                        {cours?.map((c) => (
                        <div key={c.id_cours} className={styles.coursInfo}>
                            <strong>Cours #{c.id_cours}</strong><br />
                            {formatDate(c.cours_debut instanceof Date ? c.cours_debut.toISOString() : c.cours_debut)} <br />
                            {formatDate(c.cours_fin instanceof Date ? c.cours_fin.toISOString() : c.cours_fin)}
                        </div>
                        ))}

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

export default Cours;
