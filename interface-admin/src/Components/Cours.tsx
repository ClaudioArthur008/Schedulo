import React, { useEffect, useState } from "react";
import styles from "@/styles/disponibilite.module.css";
import axios from "axios";
import { UserInfo } from "@/interface/Type";
import { Select } from "antd";
import { getClasse } from "@/function/classe";
import { Classes } from "@/function/etudiant";
import { Cours, getCours } from "@/function/cours";


interface WeekData {
  id: string;
  label: string;
  dates: string;
  startDate: Date;
}

export default function CoursComponent() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa"];
  const hours = [
    { start: 8, end: 10 },
    { start: 10, end: 12 },
    { start: 14, end: 16 },
    { start: 16, end: 18 },
  ];
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [classes, setClasse] = useState<Classes[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [cours, setCours] = useState<Cours[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  useEffect(() => {
    const userJson = sessionStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user?.id;

    if (userId) {
      axios.get(`http://localhost:3002/utilisateur/${userId}`)
        .then(async response => {
          setUserInfo(response.data);
          const token = sessionStorage.getItem("token");
          const classe = await getClasse(token!);
          setClasse(classe);
          getCours(setCours);
          if (classe.length > 0) {
          setSelectedClasse(`${classe[0].id_parcours}-${classe[0].id_niveau}-${classe[0].groupe}`);
        }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        });
    }
  }, []);

  useEffect(() => {
    const generateWeeks = () => {
      const result = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const currentMonday = new Date(today);
      const day = currentMonday.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      currentMonday.setDate(currentMonday.getDate() + diff);

      for (let i = 0; i < 10; i++) {
        const monday = new Date(currentMonday);
        monday.setDate(monday.getDate() + i * 7);

        const dayStr = String(monday.getDate()).padStart(2, '0');
        const monthStr = String(monday.getMonth() + 1).padStart(2, '0');
        const yearStr = monday.getFullYear();

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const endDayStr = String(sunday.getDate()).padStart(2, '0');
        const endMonthStr = String(sunday.getMonth() + 1).padStart(2, '0');
        const endYearStr = sunday.getFullYear();

        result.push({
          id: i.toString(),
          label: `Semaine de ${dayStr}/${monthStr}/${yearStr}`,
          dates: `${dayStr}/${monthStr}/${yearStr} - ${endDayStr}/${endMonthStr}/${endYearStr}`,
          startDate: new Date(monday),
        });
      }
      
      // Initialiser avec la première semaine
      if (result.length > 0) {
        setSelectedWeek(result[0].id); // Utiliser l'ID au lieu du label
      }
      setWeeks(result);
    };
    generateWeeks();
  }, []);


  const getCurrentWeek = () => {
    return weeks.find((week) => week.id === selectedWeek);
  };

  // Fonction pour obtenir les cours filtrés
  const getFilteredCours = () => {
    const currentWeek = getCurrentWeek();
    
    if (!currentWeek || !selectedClasse || !cours || cours.length === 0) {
      return [];
    }

    return cours.filter((c) => {
      // Créer l'ID de classe pour comparaison
      const classeId = `${c.matiere_classes.classe.id_parcours}-${c.matiere_classes.classe.id_niveau}-${c.matiere_classes.classe.groupe}`;
      
      // Vérifier si le cours appartient à la classe sélectionnée
      const matchesClass = classeId === selectedClasse;
      
      // Vérifier si le cours est dans la semaine sélectionnée
      const coursDate = new Date(c.cours_debut);
      const weekStart = new Date(currentWeek.startDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999); 
      
      const isInWeek = coursDate >= weekStart && coursDate <= weekEnd;
      
      return matchesClass && isInWeek;
    });
  };

  // Fonction pour obtenir les cours d'un créneau spécifique
  const getCoursForSlot = (day: string, hour: { start: number; end: number }) => {
    const filteredCours = getFilteredCours();
    
    return filteredCours.filter((c) => {
      const coursDate = new Date(c.cours_debut);
      const coursDay = coursDate.getDay(); 
      const startHour = coursDate.getHours();
      
      const dayMap: { [key: number]: string } = {
        1: "Lu", 2: "Ma", 3: "Me", 4: "Je", 5: "Ve", 6: "Sa", 0: "Di"
      };
      
      const coursAbbrevDay = dayMap[coursDay];
      
      // Vérifier si le cours correspond au jour et au créneau
      const matchesDay = coursAbbrevDay === day;
      const matchesHour = startHour >= hour.start && startHour < hour.end;
      
      return matchesDay && matchesHour;
    });
  };

  return (
    <div className={styles.disponibiliteProfesseur}>
      <div className={styles.header}>
        <h2 className={styles.title}>Emploi du temps</h2>
        <div className={styles.controls}>
          <div className="select-wrapper">
            <Select
              placeholder="Sélectionner une classe"
              style={{ width: 200, marginRight: 10 }}
              value={selectedClasse}
              onChange={(value) => {
                console.log("Classe sélectionnée:", value);
                setSelectedClasse(value);
              }}
            >
              {classes.map((classe) => (
                <Select.Option
                  key={`${classe.id_parcours}-${classe.id_niveau}-${classe.groupe}`}
                  value={`${classe.id_parcours}-${classe.id_niveau}-${classe.groupe}`}
                >
                  {`${classe.id_niveau} ${classe.parcours.code_parcours} gp${classe.groupe}`}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Sélectionner une semaine"
              value={selectedWeek}
              onChange={(value) => {
                console.log("Semaine sélectionnée:", value);
                setSelectedWeek(value);
              }}
              style={{ width: 250 }}
            >
              {weeks.map((week) => (
                <Select.Option key={week.id} value={week.id}>
                  {week.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className={styles.scheduleHeader}>
        <h3 className={styles.scheduleTitle}>
          Emploi du temps {getCurrentWeek()?.dates}
        </h3>
        {selectedClasse && (
          <p className={styles.selectedClass}>
            Classe: {classes.find(c => 
              `${c.id_parcours}-${c.id_niveau}-${c.groupe}` === selectedClasse
            )?.id_niveau} {classes.find(c => 
              `${c.id_parcours}-${c.id_niveau}-${c.groupe}` === selectedClasse
            )?.parcours.code_parcours} gp{classes.find(c => 
              `${c.id_parcours}-${c.id_niveau}-${c.groupe}` === selectedClasse
            )?.groupe}
          </p>
        )}
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
                const coursForSlot = getCoursForSlot(day, hour);

                return (
                  <td
                    key={`${day}-${hour.start}`}
                    className={`${styles.timeSlot}  ${coursForSlot.length > 0 ? styles.available : ""}`}
                  > 
                    {coursForSlot.map((c, index) => (
                      <div key={index} className={styles.coursSlot} >
                        <>
                          <strong>{c.matiere_classes.matiere.nom_matiere}</strong><br />
                          {c.matiere_classes.enseignant.nom}<br />
                        </>
                        {c.salle && (
                          <div className={styles.coursRoom}>
                            S {c.salle.id_salle}
                          </div>
                        )}
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
}