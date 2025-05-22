import React, { useEffect, useState } from "react";
import styles from "@/styles/disponibilite.module.css";
import axios from "axios";
import {UserInfo } from "@/interface/Type";
import { Modal, Select } from "antd";
import { getMatiereClasse, getProfMatiere, MatiereClasse } from "@/function/matiere";
import { getSalles, getSallesAvalaible, Salle } from "@/function/salle";
import { formatDateTime } from "@/function/date";
import Cours from "./Cours";
import { addCours, CoursDTO } from "@/function/cours";

interface DisponibiliteItem {
  day: string;
  hour: { start: number; end: number };
  available: boolean;
  date?: string;
}

interface WeekData {
  id: string;
  label: string;
  dates: string;
  startDate: Date;
}

export default function DisponibiliteProfesseur() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentDisponibilites, setCurrentDisponibilites] = useState<DisponibiliteItem[]>([]);
  const [disponibilites, setDisponibilites] = useState<Map<string, DisponibiliteItem[]>>(new Map());
  const [salle, setSalle] = useState<Salle[]>([]);
  const [matiere_classes, setMatiereClasses] = useState<MatiereClasse[]>([]);
  const [sentDisponibilites, setSentDisponibilites] = useState<any[]>([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const[selectedSalle, setSelectedSalle]= useState<Salle>();
  const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa"];
  const hours = [
    { start: 8, end: 10 },
    { start: 10, end: 12 },
    { start: 14, end: 16 },
    { start: 16, end: 18 },
  ];
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<WeekData[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const[showModalAddCours, setShowModalAddCours] = useState(false);
const [selectedDate, setSelectedDate] = useState<{ dateDebut: string; dateFin: string } | null>(null);


  useEffect(() => {
    const userJson = sessionStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user?.id;

    if (userId) {
      axios.get(`http://localhost:3002/utilisateur/${userId}`)
        .then(response => {
          setUserInfo(response.data);
          getProfMatiere(setMatiereClasses, response.data.enseignant.id_enseignant);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        });
    };


  }, []);

  // Fonction pour générer les semaines à partir d'une date de début
  const generateWeeks = (startDate: Date, numberOfWeeks: number): WeekData[] => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
    const weeks: WeekData[] = [];

    for (let i = 0; i < numberOfWeeks; i++) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + i * 7);

      const end = new Date(start);
      end.setDate(start.getDate() + 4);

      weeks.push({
        id: `semaine${i + 1}`,
        label: `Semaine ${i + 1}`,
        dates: `du ${start.toLocaleDateString("fr-FR", options)} au ${end.toLocaleDateString("fr-FR", options)}`,
        startDate: new Date(start) // Stocker la date de début réelle
      });
    }

    return weeks;
  };

  // Fonction pour obtenir le prochain lundi à partir d'une date
  const getNextMonday = (fromDate: Date = new Date()): Date => {
    const day = fromDate.getDay();
    const daysUntilNextMonday = (day === 0) ? 1 : 8 - day;
    const nextMonday = new Date(fromDate);
    nextMonday.setDate(nextMonday.getDate() + daysUntilNextMonday);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  };

  // État pour le filtre de semaine pour les disponibilités envoyées
  const [selectedSentWeekFilter, setSelectedSentWeekFilter] = useState<string>("all");

  // Convertir une date en format 'YYYY-MM-DD'
  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (userInfo?.enseignant?.id_enseignant) {
      // Récupérer les disponibilités déjà envoyées
      axios.get(`http://localhost:3002/disponibilite/week/${userInfo.enseignant.id_enseignant}`)
        .then(res => {
          const disponibilitesData = res.data;
          setSentDisponibilites(disponibilitesData);

          // Extraire les dates de début de semaine déjà enregistrées
          const sentWeekStartDates = disponibilitesData.map((week: any) =>
            formatDateToString(new Date(week.debut_semaine))
          );

          // Générer les semaines à partir du prochain lundi
          const nextMonday = getNextMonday();
          const generatedWeeks = generateWeeks(nextMonday, 10);
          setWeeks(generatedWeeks);

          // Filtrer les semaines qui n'ont pas encore de disponibilités
          const availableWeeks = generatedWeeks.filter(week =>
            !sentWeekStartDates.includes(formatDateToString(week.startDate))
          );
          setAvailableWeeks(availableWeeks);

          // Initialiser les disponibilités pour toutes les semaines
          const dispoMap = new Map<string, DisponibiliteItem[]>();
          generatedWeeks.forEach(week => {
            const weekStart = new Date(week.startDate);
            const slots: DisponibiliteItem[] = [];

            for (let i = 0; i < days.length; i++) {
              const dayDate = new Date(weekStart);
              dayDate.setDate(dayDate.getDate() + i);

              hours.forEach(hour => {
                slots.push({
                  day: days[i],
                  hour,
                  available: false,
                  date: formatDateToString(dayDate)
                });
              });
            }

            dispoMap.set(week.id, slots);
          });
          setDisponibilites(dispoMap);

          // Sélectionner la première semaine disponible
          if (availableWeeks.length > 0) {
            setSelectedWeek(availableWeeks[0].id);
          }

          // Charger également les disponibilités de la semaine en cours
          if (userInfo.enseignant && userInfo.enseignant.id_enseignant) {
            axios.get(`http://localhost:3002/disponibilite/this-week/${userInfo.enseignant.id_enseignant}`)
              .then(res => {
                setCurrentDisponibilites(res.data);
              })
              .catch(err => console.error("Erreur chargement disponibilités actuelles", err));
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des disponibilités :", error);
        });
    }
  }, [userInfo]);

    const handleModalAdd = () => {
        setShowModalAddCours(false);
    };

    const filteredMatieres = selectedClasse
    ? matiere_classes.filter(
        (mc) =>
          `${mc.classe.id_parcours}-${mc.classe.id_niveau}-${mc.classe.groupe}` === selectedClasse
      )
    : [];

  const classesUniques = Array.from(
  new Map(
    matiere_classes.map((mc) => [
      `${mc.classe.id_parcours}-${mc.classe.id_niveau}-${mc.classe.groupe}`,
      mc.classe,
    ])
  ).values()
);

const handleAdd = async () => {
    const selectedMc = matiere_classes.find(mc =>
        `${mc.classe.id_parcours}-${mc.classe.id_niveau}-${mc.classe.groupe}` === selectedClasse &&
        mc.matiere.id_matiere === selectedMatiere
    );

    if (selectedMc) {
        const cours: CoursDTO = {
          cours_debut: selectedDate?.dateDebut ? new Date(selectedDate.dateDebut) : new Date(),
          cours_fin: selectedDate?.dateFin ? new Date(selectedDate.dateFin) : new Date(),
          status: 0, 
          salle: {
            id_salle: selectedSalle?.id_salle ?? ""
          } as Salle,
          matiere_classes: selectedMc
        }
        await addCours(cours);
    } else {
        console.warn("Aucune correspondance trouvée !");
    }
};


  return (
    <div className={styles.disponibiliteProfesseur}>
        {showModalAddCours && (
        <Modal
          onCancel={handleModalAdd} open={showModalAddCours} footer={null}>
          <h1 className="text-2xl font-semibold">
            Ajouter un enseignant cours
        </h1>    
        <br />                
      <div className="flex flex-col gap-4">
        <Select
          placeholder="Classe"
          className="w-full"
          onChange={(value) => {
            setSelectedClasse(value);
            setSelectedMatiere(null);
      }}
        >
        {classesUniques.map((classe) => (
          <Select.Option
            key={`${classe.id_parcours}-${classe.id_niveau}-${classe.groupe}`}
            value={`${classe.id_parcours}-${classe.id_niveau}-${classe.groupe}`}
          >
            {`${classe.id_niveau} ${classe.parcours.code_parcours} gp${classe.groupe}`}
          </Select.Option>
        ))}

        </Select>
        <Select
          placeholder="Matière"
          className="w-full"
          value={selectedMatiere}
          onChange={(value) => setSelectedMatiere(value)}
          disabled={!selectedClasse}
        >
          {filteredMatieres.map((mc) => (
            <Select.Option
              key={mc.matiere.id_matiere}
              value={mc.matiere.id_matiere}
            >
              {mc.matiere.nom_matiere}
            </Select.Option>
          ))}
        </Select> 
        <Select
          placeholder="Salles"
          className="w-full"
          onChange={(e)=>setSelectedSalle({...selectedSalle, id_salle : e })}
        >
          {salle.map((mc) => (
            <Select.Option
              key={mc.id_salle}
              value={mc.id_salle}
            >
              {mc.id_salle}
            </Select.Option>
          ))}
        </Select>              
        <div className="flex justify-end gap-2 mt-4">
            <button
              className="text-red-500 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
            >
               Annuler
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 cursor-pointer text-white py-2 px-4 rounded-md"
              onClick={async () => { handleAdd()
              }}
            >
              Ajouter
            </button>
        </div>
      </div>
    </Modal>
  )}
      <div className={styles.sentSection}>
        {!sentDisponibilites || sentDisponibilites.length === 0 ? (
          <div className={styles.noSentDisponibilites}>
            <p className={styles.message}>Aucune disponibilité envoyée</p>
          </div>
        ) : (
          <>
            <div className={styles.filterControls}>
              <label htmlFor="weekFilter">Filtrer par semaine: </label>
              <select
                id="weekFilter"
                value={selectedSentWeekFilter}
                onChange={(e) => setSelectedSentWeekFilter(e.target.value)}
                className={styles.weekSelect}
              >
                <option value="all">Toutes les semaines</option>
                {sentDisponibilites.map((weekData, i) => (
                  <option key={i} value={i.toString()}>
                    Semaine du {new Date(weekData.debut_semaine).toLocaleDateString("fr-FR")}
                  </option>
                ))}
              </select>
            </div>

            {selectedSentWeekFilter === "all"
              ? sentDisponibilites.map((weekData, i) => (
                <div key={i} className={styles.weekTableWrapper}>
                  <h4>Semaine du {new Date(weekData.debut_semaine).toLocaleDateString("fr-FR")}</h4>
                  <table className={styles.timeTable}>
                    <thead>
                      <tr>
                        <th></th>
                        {hours.map((hour) => (
                          <th key={`${hour.start}-${hour.end}`} className={styles.hourHeader}>
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
                            const matchedDispo = weekData.disponibilites.find((d: any) => {
                              const dispoDebut = new Date(d.dispo_debut);
                              const dispoFin = new Date(d.dispo_fin);
                              const dayName = dispoDebut.toLocaleDateString("fr-FR", { weekday: "short" });

                              return (
                                dayName.toLowerCase().startsWith(day.toLowerCase()) &&
                                dispoDebut.getHours() === hour.start &&
                                dispoFin.getHours() === hour.end
                              );
                            });

                            const available = !!matchedDispo;

                            return (
                              
                              <td
                                key={`${day}-${hour.start}`}
                                className={`${styles.timeSlot} ${available ? styles.available : ""}`}
                                onClick={() => {
                              if (available && matchedDispo) {
                                  setShowModalAddCours(true);

                                  const dateDebut = new Date(matchedDispo.dispo_debut);
                                  const dateFin = new Date(matchedDispo.dispo_fin);
                                  setSelectedDate({
                                    dateDebut : formatDateTime(dateDebut),
                                    dateFin : formatDateTime(dateFin)
                                  })
                                    getSallesAvalaible(setSalle, dateDebut.toISOString());
                                }
                                }}
                              >
                                {available && <div className={styles.availableIndicator}>Disponible</div>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
              : (() => {
                const weekIndex = parseInt(selectedSentWeekFilter);
                const weekData = sentDisponibilites[weekIndex];
                return (
                  <div className={styles.weekTableWrapper}>
                    <h4>Semaine du {new Date(weekData.debut_semaine).toLocaleDateString("fr-FR")}</h4>
                    <table className={styles.timeTable}>
                      <thead>
                        <tr>
                          <th></th>
                          {hours.map((hour) => (
                            <th key={`${hour.start}-${hour.end}`} className={styles.hourHeader}>
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
                            const matchedDispo = weekData.disponibilites.find((d: any) => {
                              const dispoDebut = new Date(d.dispo_debut);
                              const dispoFin = new Date(d.dispo_fin);
                              const dayName = dispoDebut.toLocaleDateString("fr-FR", { weekday: "short" });

                              return (
                                dayName.toLowerCase().startsWith(day.toLowerCase()) &&
                                dispoDebut.getHours() === hour.start &&
                                dispoFin.getHours() === hour.end
                              );
                            });

                            const available = !!matchedDispo;
                              return (
                                <td
                                  key={`${day}-${hour.start}`}
                                  className={`${styles.timeSlot} ${available ? styles.available : ""}`}
                                  onClick={async() => {
                                    if (available && matchedDispo) {
                                  setShowModalAddCours(true);

                                  const dateDebut = new Date(matchedDispo.dispo_debut);
                                  const dateFin = new Date(matchedDispo.dispo_fin);
                                  setSelectedDate({
                                    dateDebut : formatDateTime(dateDebut),
                                    dateFin : formatDateTime(dateFin)
                                  })
                                    getSallesAvalaible(setSalle, dateDebut.toISOString());
                                  
                                }
                                }}
                                >
                                  {available && <div className={styles.availableIndicator}>Disponible</div>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            }
          </>
        )}
      </div>
    </div>
  );
}